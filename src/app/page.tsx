import Link from "next/link";
import {
  Clock3,
  DatabaseZap,
  Flame,
  MessageCircle,
  MessageSquarePlus,
  Pin,
  Users,
} from "lucide-react";

import { CategoryNav } from "@/components/category-nav";
import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { PostCard } from "@/components/post-card";
import type { ForumPost } from "@/lib/forum-types";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import type { PostType, Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const postTypes = ["DISCUSSION", "GUIDE", "NEWS", "QUESTION", "RECRUITMENT"];

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function isDatabaseConnectionError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "PrismaClientInitializationError" ||
      error.message.includes("Can't reach database server"))
  );
}

function DatabaseSetupState() {
  return (
    <main>
      <section className="hero-band">
        <HeroBackdrop priority />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Setup database</span>
            <h1>PostgreSQL belum tersambung</h1>
            <p>
              Forum sudah siap, tapi koneksi Prisma Postgres belum tersedia.
              Periksa DATABASE_URL, lalu sinkronkan schema dan seed data.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/auth/setup">
                <DatabaseZap size={18} />
                Cek OAuth
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container setup-shell">
        <div className="page-panel">
          <span className="panel-icon">
            <DatabaseZap size={22} />
          </span>
          <h2>Jalankan ini setelah PostgreSQL aktif</h2>
          <div className="setup-list">
            <span>npm run db:push</span>
            <span>npm run db:seed</span>
            <span>npm run dev</span>
          </div>
          <p>
            Pastikan <strong>DATABASE_URL</strong> tersedia di file env lokal
            dan mengarah ke database Prisma Postgres yang sudah dilink.
          </p>
        </div>
      </section>
    </main>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const category = getParam(params, "category");
  const query = getParam(params, "q");
  const tag = getParam(params, "tag");
  const rawType = getParam(params, "type");
  const activeType = rawType && postTypes.includes(rawType) ? rawType : undefined;

  const where: Prisma.PostWhereInput = {};

  if (category) {
    where.category = { slug: category };
  }

  if (activeType) {
    where.type = activeType as PostType;
  }

  if (tag) {
    where.postTags = {
      some: {
        tag: { slug: tag },
      },
    };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { body: { contains: query, mode: "insensitive" } },
      {
        postTags: {
          some: { tag: { name: { contains: query, mode: "insensitive" } } },
        },
      },
    ];
  }

  let categories;
  let posts;
  let threadCount;
  let memberCount;
  let commentCount;

  try {
    [categories, posts, threadCount, memberCount, commentCount] = await Promise.all([
      prisma.category.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { posts: true } } },
      }),
      prisma.post.findMany({
        where,
        orderBy: [{ pinned: "desc" }, { featured: "desc" }, { createdAt: "desc" }],
        take: 40,
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
      prisma.post.count(),
      prisma.user.count(),
      prisma.comment.count(),
    ]);
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return <DatabaseSetupState />;
    }

    throw error;
  }

  return (
    <main className="home-app-shell">
      <div className="container home-app-grid">
        <CategoryNav activeSlug={category} categories={categories} />

        <section className="feed-column home-command">
          <div className="command-hero">
            <div className="command-copy">
              <h1>
                Selamat Datang di <span>Komando</span>
              </h1>
              <p>
                Pusat diskusi taktis, panduan hero, dan pembaruan terbaru untuk
                para komandan Seven Knights Idle Adventure di Indonesia.
              </p>
            </div>
            <div className="command-stats" aria-label="Statistik forum">
              <span>
                <Users size={24} />
                <strong>{formatNumber(memberCount)}</strong>
                Komandan Aktif
              </span>
              <span>
                <MessageCircle size={24} />
                <strong>{formatNumber(threadCount)}</strong>
                Diskusi Taktik
              </span>
              <span>
                <MessageSquarePlus size={24} />
                <strong>{formatNumber(commentCount)}</strong>
                Komentar
              </span>
            </div>
          </div>

          <div className="feed-toolbar">
            <div className="quick-filters" aria-label="Filter cepat">
              <Link className="is-active" href="/">
                <Clock3 size={17} />
                Terbaru
              </Link>
              <Link href="/?type=GUIDE">
                <Flame size={17} />
                Sedang Tren
              </Link>
              <Link href="/?type=DISCUSSION">
                <Pin size={17} />
                Disematkan
              </Link>
            </div>
            <Link className="button button-primary desktop-compose" href="/compose">
              <MessageSquarePlus size={18} />
              Post Thread
            </Link>
          </div>

          <FilterBar
            activeType={activeType}
            category={category}
            query={query}
            tag={tag}
          />

          <div className="feed-heading">
            <div>
              <span className="eyebrow">Board aktif</span>
              <h2>Thread terbaru</h2>
            </div>
            <span className="feed-count">
              <Users size={16} />
              {formatNumber(posts.length)} tampil
            </span>
          </div>

          <div className="post-list">
            {posts.length ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post as ForumPost} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
