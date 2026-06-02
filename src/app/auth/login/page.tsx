import Link from "next/link";
import { LogIn } from "lucide-react";

import { GoogleLoginButton } from "@/components/google-login-button";
import { isGoogleAuthConfigured } from "@/lib/auth";
import { safeReturnPath } from "@/lib/auth-routes";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const callbackUrl = safeReturnPath(params.callbackUrl);

  return (
    <main className="container narrow-page">
      <div className="page-panel auth-panel">
        <span className="panel-icon">
          <LogIn size={22} />
        </span>
        <span className="eyebrow">Masuk member</span>
        <h1>Login untuk ikut ngobrol.</h1>
        <p>
          Pakai akun Google supaya thread, komentar, reaction, dan bookmark
          tersimpan di profilmu.
        </p>

        <div className="setup-actions">
          <GoogleLoginButton
            callbackUrl={callbackUrl}
            canUseGoogle={isGoogleAuthConfigured}
          />
          <Link className="button button-muted" href="/">
            Kembali ke forum
          </Link>
        </div>
      </div>
    </main>
  );
}
