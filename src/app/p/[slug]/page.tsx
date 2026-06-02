import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, MessageCircle } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { CommentForm } from "@/components/comment-form";
import { EngagementBar } from "@/components/engagement-bar";
import { UserLabels } from "@/components/user-labels";
import { prisma } from "@/lib/prisma";
import { getOptionalSession } from "@/lib/session";
import {
  cn,
  formatNumber,
  getTypeLabel,
  getTypeTone,
  timeAgo,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

type ThreadPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ThreadPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, body: true },
  });

  if (!post) {
    return { title: "Thread tidak ditemukan" };
  }

  return {
    title: post.title,
    description: post.body.slice(0, 150),
  };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { slug } = await params;
  const [session, post] = await Promise.all([
    getOptionalSession(),
    prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, image: true, role: true, badge: true } },
        category: { select: { name: true, slug: true, accent: true } },
        postTags: {
          include: { tag: { select: { name: true, slug: true } } },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          take: 100,
          include: {
            author: { select: { name: true, image: true, role: true, badge: true } },
          },
        },
        _count: {
          select: { comments: true, reactions: true, bookmarks: true },
        },
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  const userId = session?.user?.id;
  const isBanned = Boolean(session?.user?.bannedAt);
  const userState = userId
    ? await Promise.all([
        prisma.reaction.findUnique({
          where: { userId_postId: { userId, postId: post.id } },
        }),
        prisma.bookmark.findUnique({
          where: { userId_postId: { userId, postId: post.id } },
        }),
      ])
    : [null, null];

  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const [reaction, bookmark] = userState;

  return (
    <main className="container thread-layout">
      <article className="thread-article">
        <div
          className="thread-category-line"
          style={{ "--accent": post.category.accent } as React.CSSProperties}
        >
          <Link href={`/?category=${post.category.slug}`}>
            {post.category.name}
          </Link>
          <span className={cn("type-pill", getTypeTone(post.type))}>
            {getTypeLabel(post.type)}
          </span>
        </div>

        <h1>{post.title}</h1>

        <div className="thread-author">
          <Avatar image={post.author.image} name={post.author.name} />
          <span>
            <strong>{post.author.name ?? "Member"}</strong>
            <UserLabels badge={post.author.badge} role={post.author.role} />
            <small>{timeAgo(post.createdAt)}</small>
          </span>
        </div>

        <div className="thread-body">
          {post.body.split("\n").map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>

        <div className="tag-row thread-tags">
          {post.postTags.map(({ tag }) => (
            <Link href={`/?tag=${tag.slug}`} key={tag.slug}>
              #{tag.name}
            </Link>
          ))}
        </div>

        <EngagementBar
          bookmarks={post._count.bookmarks}
          hasBookmarked={Boolean(bookmark)}
          hasReacted={Boolean(reaction)}
          isLoggedIn={Boolean(userId) && !isBanned}
          pathname={`/p/${post.slug}`}
          postId={post.id}
          reactions={post._count.reactions}
        />
      </article>

      <aside className="thread-side">
        <div className="side-stat">
          <Eye size={18} />
          <span>
            <strong>{formatNumber(post.views + 1)}</strong>
            Dilihat
          </span>
        </div>
        <div className="side-stat">
          <MessageCircle size={18} />
          <span>
            <strong>{formatNumber(post._count.comments)}</strong>
            Komentar
          </span>
        </div>
        <Link className="button button-muted" href="/compose">
          Buat Thread Baru
        </Link>
      </aside>

      <section className="comments-section" id="comments">
        <div className="feed-heading">
          <div>
            <span className="eyebrow">Diskusi</span>
            <h2>Komentar</h2>
          </div>
        </div>

        <div className="comment-list">
          {post.comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              <Avatar image={comment.author.image} name={comment.author.name} />
              <div>
                <div className="comment-head">
                  <span>
                    <strong>{comment.author.name ?? "Member"}</strong>
                    <UserLabels
                      badge={comment.author.badge}
                      role={comment.author.role}
                    />
                  </span>
                  <span>{timeAgo(comment.createdAt)}</span>
                </div>
                <p>{comment.body}</p>
              </div>
            </article>
          ))}
        </div>

        <CommentForm
          isLoggedIn={Boolean(userId)}
          isBanned={isBanned}
          pathname={`/p/${post.slug}#comments`}
          postId={post.id}
        />
      </section>
    </main>
  );
}
