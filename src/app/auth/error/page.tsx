import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { loginPath, safeReturnPath } from "@/lib/auth-routes";

export const dynamic = "force-dynamic";

type AuthErrorPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const authErrorMessages: Record<string, string> = {
  AccessDenied:
    "Login dibatalkan atau akses Google tidak diberikan. Kamu bisa coba lagi kapan saja.",
  Banned:
    "Akun ini sedang dibatasi oleh admin, jadi belum bisa membuat thread, komentar, reaction, atau bookmark.",
  Callback:
    "Google mengembalikan respons yang tidak lengkap. Coba login ulang.",
  OAuthAccountNotLinked:
    "Email ini sudah pernah dipakai dengan metode login lain.",
  OAuthCallback:
    "Callback Google gagal diproses. Pastikan OAuth redirect URI sudah benar.",
  OAuthSignin:
    "Permintaan login Google gagal dibuat. Coba login ulang.",
  OAuthCallbackError:
    "Google membatalkan atau gagal menyelesaikan login.",
  Configuration:
    "Konfigurasi OAuth belum lengkap di server.",
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const params = (await searchParams) ?? {};
  const errorCode = getParam(params, "error") ?? "AccessDenied";
  const callbackUrl = safeReturnPath(getParam(params, "callbackUrl"));
  const message =
    authErrorMessages[errorCode] ??
    "Login tidak selesai. Bisa karena halaman Google ditutup, tombol back ditekan, atau sesi login kedaluwarsa.";

  return (
    <main className="container narrow-page">
      <div className="page-panel auth-panel">
        <span className="panel-icon">
          <AlertCircle size={22} />
        </span>
        <span className="eyebrow">Login belum selesai</span>
        <h1>Tidak apa-apa, kamu belum masuk.</h1>
        <p>{message}</p>

        <div className="setup-actions">
          <Link className="button button-primary" href={loginPath(callbackUrl)}>
            Coba login lagi
          </Link>
          <Link className="button button-muted" href={callbackUrl}>
            Kembali
          </Link>
        </div>
      </div>
    </main>
  );
}
