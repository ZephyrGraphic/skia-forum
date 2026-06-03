import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { Avatar } from "@/components/avatar";
import { ProfileForm } from "@/components/profile-form";
import { loginPath, safeReturnPath } from "@/lib/auth-routes";
import { prisma } from "@/lib/prisma";
import { getOptionalSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type UsernamePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}

export default async function UsernamePage({
  searchParams,
}: UsernamePageProps) {
  const params = (await searchParams) ?? {};
  const callbackUrl = safeReturnPath(getParam(params, "callbackUrl"));
  const editMode = getParam(params, "edit") === "1";
  const error = getParam(params, "error");
  const session = await getOptionalSession();

  if (!session?.user?.id) {
    redirect(loginPath(callbackUrl));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      bio: true,
      image: true,
      username: true,
    },
  });

  if (!user) {
    redirect(loginPath(callbackUrl));
  }

  if (user.username && !editMode && !error) {
    redirect(callbackUrl);
  }

  return (
    <main className="container narrow-page">
      <section className="profile-editor">
        <div className="profile-editor-copy">
          <span className="panel-icon">
            <UserRound size={22} />
          </span>
          <span className="eyebrow">
            {user.username ? "Edit profil" : "Langkah pertama"}
          </span>
          <h1>
            {user.username
              ? "Perbarui username forum."
              : "Pilih username forum dulu."}
          </h1>
          <p>
            Username ini yang tampil di thread, komentar, dan profil publik.
          </p>
          <Avatar image={user.image} name={user.username} size="lg" />
        </div>

        <div>
          {error ? (
            <div className="alert-box">
              <UserRound size={18} />
              {error}
            </div>
          ) : null}
          <ProfileForm
            bio={user.bio}
            callbackUrl={callbackUrl}
            submitLabel={user.username ? "Simpan Perubahan" : "Mulai Forum"}
            username={user.username}
          />
          {user.username ? (
            <Link className="button button-muted profile-back-link" href={callbackUrl}>
              Batal
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
