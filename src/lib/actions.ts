"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import {
  loginPath,
  safeReturnPath,
  usernameSetupPath,
} from "@/lib/auth-routes";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";
import { parseTags, slugify } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().trim().min(8).max(120),
  body: z.string().trim().min(24).max(6000),
  categoryId: z.string().trim().min(1),
  type: z.enum(["DISCUSSION", "GUIDE", "NEWS", "QUESTION", "RECRUITMENT"]),
  tags: z.string().trim().max(120).optional(),
});

const commentSchema = z.object({
  postId: z.string().trim().min(1),
  body: z.string().trim().min(3).max(1600),
});

const usernamePattern = /^[A-Za-z0-9][A-Za-z0-9_.-]{2,23}$/;

const profileSchema = z.object({
  bio: z.string().trim().max(180).optional(),
  callbackUrl: z.string().optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(usernamePattern),
});

const deletePostSchema = z.object({
  pathname: z.string().optional(),
  postId: z.string().trim().min(1),
  returnTo: z.string().optional(),
});

type RequireUserOptions = {
  requireUsername?: boolean;
};

async function requireUser(callbackUrl = "/", options: RequireUserOptions = {}) {
  let session;

  try {
    session = await getServerSession(authOptions);
  } catch {
    redirect(loginPath(callbackUrl));
  }

  if (!session?.user?.id) {
    redirect(loginPath(callbackUrl));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { bannedAt: true, username: true },
  });

  if (user?.bannedAt) {
    redirect(
      `/auth/error?error=Banned&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  if (!user) {
    redirect(loginPath(callbackUrl));
  }

  if (options.requireUsername !== false && !user.username) {
    redirect(usernameSetupPath(callbackUrl));
  }

  return {
    id: session.user.id,
    role: session.user.role ?? "MEMBER",
  };
}

async function requireUserId(
  callbackUrl = "/",
  options: RequireUserOptions = {},
) {
  const user = await requireUser(callbackUrl, options);

  return user.id;
}

async function uniquePostSlug(title: string) {
  const base = slugify(title) || "thread";
  let slug = base;
  let suffix = 2;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createPostAction(formData: FormData) {
  const userId = await requireUserId("/compose");
  try {
    await enforceRateLimit({
      identity: userId,
      limit: 4,
      scope: "post:create",
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(`/compose?error=${encodeURIComponent(error.message)}`);
    }

    throw error;
  }

  const result = postSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    categoryId: formData.get("categoryId"),
    type: formData.get("type"),
    tags: formData.get("tags") ?? "",
  });

  if (!result.success) {
    redirect("/compose?error=Lengkapi judul, kategori, dan isi thread.");
  }

  const category = await prisma.category.findUnique({
    where: { id: result.data.categoryId },
    select: { id: true },
  });

  if (!category) {
    redirect("/compose?error=Kategori tidak ditemukan.");
  }

  const tags = parseTags(result.data.tags ?? "");
  const slug = await uniquePostSlug(result.data.title);

  const post = await prisma.post.create({
    data: {
      title: result.data.title,
      slug,
      body: result.data.body,
      type: result.data.type,
      authorId: userId,
      categoryId: category.id,
      postTags: {
        create: tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { slug: slugify(tagName) },
              create: {
                name: tagName,
                slug: slugify(tagName),
              },
            },
          },
        })),
      },
    },
    select: { slug: true },
  });

  revalidatePath("/");
  revalidatePath("/me");
  redirect(`/p/${post.slug}`);
}

export async function createCommentAction(formData: FormData) {
  const result = commentSchema.safeParse({
    postId: formData.get("postId"),
    body: formData.get("body"),
  });

  if (!result.success) {
    redirect("/");
  }

  const post = await prisma.post.findUnique({
    where: { id: result.data.postId },
    select: { id: true, slug: true },
  });

  if (!post) {
    redirect("/");
  }

  const userId = await requireUserId(`/p/${post.slug}#comments`);
  try {
    await enforceRateLimit({
      identity: userId,
      limit: 12,
      scope: "comment:create",
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(`/p/${post.slug}#comments`);
    }

    throw error;
  }

  await prisma.comment.create({
    data: {
      body: result.data.body,
      postId: post.id,
      authorId: userId,
    },
  });

  revalidatePath(`/p/${post.slug}`);
  redirect(`/p/${post.slug}#comments`);
}

export async function toggleReactionAction(formData: FormData) {
  const postId = String(formData.get("postId") ?? "");
  const pathname = safeReturnPath(String(formData.get("pathname") ?? "/"));
  const userId = await requireUserId(pathname);

  if (!postId) {
    redirect(pathname);
  }

  try {
    await enforceRateLimit({
      identity: userId,
      limit: 60,
      scope: "reaction:toggle",
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(pathname);
    }

    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    redirect(pathname);
  }

  const existing = await prisma.reaction.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({
      data: {
        userId,
        postId,
      },
    });
  }

  revalidatePath(pathname);
  redirect(pathname);
}

export async function toggleBookmarkAction(formData: FormData) {
  const postId = String(formData.get("postId") ?? "");
  const pathname = safeReturnPath(String(formData.get("pathname") ?? "/"));
  const userId = await requireUserId(pathname);

  if (!postId) {
    redirect(pathname);
  }

  try {
    await enforceRateLimit({
      identity: userId,
      limit: 60,
      scope: "bookmark:toggle",
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      redirect(pathname);
    }

    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    redirect(pathname);
  }

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
    });
  }

  revalidatePath(pathname);
  revalidatePath("/me");
  redirect(pathname);
}

function profileFormPath(
  callbackUrl: string,
  type?: "error" | "notice",
  message?: string,
) {
  const params = new URLSearchParams({
    callbackUrl: safeReturnPath(callbackUrl),
  });

  if (type && message) {
    params.set(type, message);
  }

  return `/auth/username?${params.toString()}`;
}

export async function updateProfileAction(formData: FormData) {
  const callbackUrl = safeReturnPath(
    String(formData.get("callbackUrl") ?? "/me"),
  );
  const userId = await requireUserId(callbackUrl, { requireUsername: false });
  const result = profileSchema.safeParse({
    bio: formData.get("bio") ?? "",
    callbackUrl,
    username: formData.get("username"),
  });

  if (!result.success) {
    redirect(
      profileFormPath(
        callbackUrl,
        "error",
        "Username harus 3-24 karakter dan hanya memakai huruf, angka, titik, strip, atau underscore.",
      ),
    );
  }

  const username = result.data.username;
  const existingUser = await prisma.user.findFirst({
    where: {
      id: { not: userId },
      username: { equals: username, mode: "insensitive" },
    },
    select: { id: true },
  });

  if (existingUser) {
    redirect(
      profileFormPath(callbackUrl, "error", "Username itu sudah dipakai."),
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        bio: result.data.bio || null,
        username,
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      redirect(
        profileFormPath(callbackUrl, "error", "Username itu sudah dipakai."),
      );
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/me");
  revalidatePath(callbackUrl);
  redirect(callbackUrl);
}

export async function deletePostAction(formData: FormData) {
  const result = deletePostSchema.safeParse({
    pathname: formData.get("pathname") ?? "/me",
    postId: formData.get("postId"),
    returnTo: formData.get("returnTo") ?? "/me",
  });
  const fallbackPath = result.success
    ? safeReturnPath(result.data.returnTo)
    : "/me";

  if (!result.success) {
    redirect(fallbackPath);
  }

  const pathname = safeReturnPath(result.data.pathname);
  const returnTo = safeReturnPath(result.data.returnTo);
  const user = await requireUser(pathname);
  const post = await prisma.post.findUnique({
    where: { id: result.data.postId },
    select: { authorId: true, slug: true },
  });

  if (!post) {
    redirect(returnTo);
  }

  if (post.authorId !== user.id && user.role !== "ADMIN") {
    redirect(returnTo);
  }

  await prisma.post.delete({ where: { id: result.data.postId } });

  revalidatePath("/");
  revalidatePath("/me");
  revalidatePath(`/p/${post.slug}`);

  redirect(returnTo === `/p/${post.slug}` ? "/" : returnTo);
}
