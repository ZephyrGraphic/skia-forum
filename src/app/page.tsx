import Link from "next/link";
import { DatabaseZap, MessageSquarePlus, Star, Users } from "lucide-react";

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

  const featuredPost = posts.find((post) => post.featured) ?? posts[0];

  return (
    <main>
      <section className="hero-band">
        <HeroBackdrop priority />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Komunitas Indonesia</span>
            <h1>Seven Knights Idle Adventure Forum</h1>
            <p>
              Tempat ngobrol soal build, progress idle, guild, boss stage,
              patch note, dan keputusan resource yang bikin akun lebih rapi.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/compose">
                <MessageSquarePlus size={18} />
                Buat Thread
              </Link>
              <Link className="button button-ghost" href="/?type=GUIDE">
                Baca Guide
              </Link>
            </div>
          </div>

          <div className="hero-stats" aria-label="Statistik forum">
            <span>
              <strong>{formatNumber(threadCount)}</strong>
              Thread
            </span>
            <span>
              <strong>{formatNumber(memberCount)}</strong>
              Member
            </span>
            <span>
              <strong>{formatNumber(commentCount)}</strong>
              Komentar
            </span>
          </div>
        </div>
      </section>

      <section className="container forum-shell">
        <CategoryNav activeSlug={category} categories={categories} />

        <div className="feed-column">
          {featuredPost ? (
            <Link className="spotlight-thread" href={`/p/${featuredPost.slug}`}>
              <Star size={19} />
              <span>
                <strong>{featuredPost.title}</strong>
                <small>
                  Highlight dari {featuredPost.category.name} oleh{" "}
                  {featuredPost.author.name ?? "Member"}
                </small>
              </span>
            </Link>
          ) : null}

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
        </div>
      </section>
    </main>
  );
}
