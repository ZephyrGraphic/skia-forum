import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";

import { ComposeForm } from "@/components/compose-form";
import { isGoogleAuthConfigured } from "@/lib/auth";
import { loginPath, usernameSetupPath } from "@/lib/auth-routes";
import { prisma } from "@/lib/prisma";
import { getOptionalSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type ComposePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComposePage({ searchParams }: ComposePageProps) {
  const [session, categories, params] = await Promise.all([
    getOptionalSession(),
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
            href={isGoogleAuthConfigured ? loginPath("/compose") : "/auth/setup"}
          >
            Login Google
          </Link>
        </div>
      </main>
    );
  }

  if (session.user.bannedAt) {
    return (
      <main className="container narrow-page">
        <div className="page-panel">
          <span className="panel-icon">
            <LogIn size={22} />
          </span>
          <h1>Akun sedang dibatasi</h1>
          <p>
            Akunmu tidak bisa membuat thread baru selama status ban masih
            aktif.
          </p>
          <Link className="button button-muted" href="/">
            Kembali ke forum
          </Link>
        </div>
      </main>
    );
  }

  if (!session.user.username) {
    redirect(usernameSetupPath("/compose"));
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
