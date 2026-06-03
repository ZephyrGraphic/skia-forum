import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Edit3, LogIn, MessageSquare } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { ProfilePostRow } from "@/components/profile-post-row";
import { UserLabels } from "@/components/user-labels";
import { isGoogleAuthConfigured } from "@/lib/auth";
import { loginPath, usernameSetupPath } from "@/lib/auth-routes";
import type { ForumPost } from "@/lib/forum-types";
import { prisma } from "@/lib/prisma";
import { getOptionalSession } from "@/lib/session";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await getOptionalSession();

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
            href={isGoogleAuthConfigured ? loginPath("/me") : "/auth/setup"}
          >
            Login Google
          </Link>
        </div>
      </main>
    );
  }

  const [profile, posts, bookmarks] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        badge: true,
        bio: true,
        email: true,
        image: true,
        role: true,
        username: true,
        _count: {
          select: {
            bookmarks: true,
            comments: true,
            posts: true,
          },
        },
      },
    }),
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
            role: true,
            badge: true,
          },
        },
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
            author: {
              select: {
                name: true,
                username: true,
                image: true,
                role: true,
                badge: true,
              },
            },
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

  if (!profile?.username) {
    redirect(usernameSetupPath("/me"));
  }

  const totalReactions = posts.reduce(
    (total, post) => total + post._count.reactions,
    0,
  );

  return (
    <main className="container profile-page">
      <section className="profile-hero">
        <Avatar image={profile.image} name={profile.username} size="lg" />
        <div className="profile-hero-main">
          <span className="eyebrow">Member area</span>
          <div className="profile-title-row">
            <h1>{profile.username}</h1>
            <UserLabels badge={profile.badge} role={profile.role} />
          </div>
          <p>
            {profile.bio ??
              "Belum ada bio. Tambahkan sedikit konteks supaya member lain mengenal gaya mainmu."}
          </p>
          <div className="profile-stat-row">
            <span>
              <strong>{formatNumber(profile._count.posts)}</strong>
              Thread
            </span>
            <span>
              <strong>{formatNumber(totalReactions)}</strong>
              Upvote
            </span>
            <span>
              <strong>{formatNumber(profile._count.bookmarks)}</strong>
              Bookmark
            </span>
          </div>
        </div>
        <Link
          className="button button-muted profile-edit-button"
          href="/auth/username?callbackUrl=%2Fme&edit=1"
        >
          <Edit3 size={17} />
          Edit Profile
        </Link>
      </section>

      <nav className="profile-tabs" aria-label="Bagian profil">
        <a className="is-active" href="#posts">
          Postingan Saya
        </a>
        <a href="#bookmarks">Simpanan</a>
      </nav>

      <section className="profile-grid">
        <div className="profile-column" id="posts">
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
                <ProfilePostRow
                  canDelete
                  key={post.id}
                  post={post as ForumPost}
                />
              ))
            ) : (
              <div className="muted-box">Belum membuat thread.</div>
            )}
          </div>
        </div>

        <div className="profile-column" id="bookmarks">
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
                <ProfilePostRow
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
