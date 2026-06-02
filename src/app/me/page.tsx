import Link from "next/link";
import { getServerSession } from "next-auth";
import { Bookmark, LogIn, MessageSquare } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { PostCard } from "@/components/post-card";
import { authOptions, isGoogleAuthConfigured } from "@/lib/auth";
import type { ForumPost } from "@/lib/forum-types";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <main className="container narrow-page">
        <div className="page-panel">
          <span className="panel-icon">
            <LogIn size={22} />
          </span>
          <h1>Profil member</h1>
          <p>Login Google untuk melihat thread dan bookmark milikmu.</p>
          <Link
            className="button button-primary"
            href={isGoogleAuthConfigured ? "/api/auth/signin" : "/auth/setup"}
          >
            Login Google
          </Link>
        </div>
      </main>
    );
  }

  const [posts, bookmarks] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true, accent: true } },
        postTags: {
          include: { tag: { select: { name: true, slug: true } } },
        },
        _count: {
          select: { comments: true, reactions: true, bookmarks: true },
        },
      },
    }),
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        post: {
          include: {
            author: { select: { name: true, image: true } },
            category: { select: { name: true, slug: true, accent: true } },
            postTags: {
              include: { tag: { select: { name: true, slug: true } } },
            },
            _count: {
              select: { comments: true, reactions: true, bookmarks: true },
            },
          },
        },
      },
    }),
  ]);

  return (
    <main className="container profile-page">
      <section className="profile-hero">
        <Avatar image={session.user.image} name={session.user.name} size="lg" />
        <div>
          <span className="eyebrow">Member area</span>
          <h1>{session.user.name ?? "Member SKIA"}</h1>
          <p>{session.user.email}</p>
        </div>
      </section>

      <section className="profile-grid">
        <div className="profile-column">
          <div className="feed-heading">
            <div>
              <span className="eyebrow">Kontribusi</span>
              <h2>
                <MessageSquare size={20} />
                Thread saya
              </h2>
            </div>
          </div>
          <div className="post-list">
            {posts.length ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post as ForumPost} />
              ))
            ) : (
              <div className="muted-box">Belum membuat thread.</div>
            )}
          </div>
        </div>

        <div className="profile-column">
          <div className="feed-heading">
            <div>
              <span className="eyebrow">Tersimpan</span>
              <h2>
                <Bookmark size={20} />
                Bookmark
              </h2>
            </div>
          </div>
          <div className="post-list">
            {bookmarks.length ? (
              bookmarks.map((bookmark) => (
                <PostCard
                  key={bookmark.id}
                  post={bookmark.post as ForumPost}
                />
              ))
            ) : (
              <div className="muted-box">Belum ada bookmark.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
