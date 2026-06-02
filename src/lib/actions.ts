"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { loginPath, safeReturnPath } from "@/lib/auth-routes";
import { prisma } from "@/lib/prisma";
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

async function requireUserId(callbackUrl = "/") {
  let session;

  try {
    session = await getServerSession(authOptions);
  } catch {
    redirect(loginPath(callbackUrl));
  }

  if (!session?.user?.id) {
    redirect(loginPath(callbackUrl));
  }

  return session.user.id;
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
