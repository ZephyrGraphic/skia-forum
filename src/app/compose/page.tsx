import Link from "next/link";
import { getServerSession } from "next-auth";
import { AlertCircle, LogIn } from "lucide-react";

import { ComposeForm } from "@/components/compose-form";
import { authOptions, isGoogleAuthConfigured } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ComposePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComposePage({ searchParams }: ComposePageProps) {
  const [session, categories, params] = await Promise.all([
    getServerSession(authOptions),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    searchParams,
  ]);
  const error = params
    ? Array.isArray(params.error)
      ? params.error[0]
      : params.error
    : undefined;

  if (!session?.user) {
    return (
      <main className="container narrow-page">
        <div className="page-panel">
          <span className="panel-icon">
            <LogIn size={22} />
          </span>
          <h1>Login Google diperlukan</h1>
          <p>
            Thread baru hanya bisa dibuat oleh member yang sudah login agar
            diskusi tetap jelas asalnya.
          </p>
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

  return (
    <main className="container narrow-page">
      <div className="compose-head">
        <span className="eyebrow">Thread baru</span>
        <h1>Mulai diskusi SKIA</h1>
        <p>
          Bagikan guide, pertanyaan, update, atau rekrutmen guild yang berguna
          buat komunitas.
        </p>
      </div>

      {error ? (
        <div className="alert-box">
          <AlertCircle size={18} />
          {error}
        </div>
      ) : null}

      <ComposeForm categories={categories} />
    </main>
  );
}
