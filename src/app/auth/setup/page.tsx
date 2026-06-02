import Link from "next/link";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { CheckCircle, KeyRound, LogIn } from "lucide-react";

import { AuthControls } from "@/components/auth-controls";
import {
  authConfigStatus,
  authOptions,
  isGoogleAuthConfigured,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const host = forwardedHost ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    forwardedProto ?? (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`.replace(/\/+$/, "");
}

export default async function AuthSetupPage() {
  const [session, requestOrigin] = await Promise.all([
    getServerSession(authOptions),
    getRequestOrigin(),
  ]);
  const callbackUrl = `${requestOrigin}/api/auth/callback/google`;

  return (
    <main className="container narrow-page">
      <div className="page-panel">
        <span className="panel-icon">
          {isGoogleAuthConfigured ? <CheckCircle size={22} /> : <KeyRound size={22} />}
        </span>
        <h1>Google OAuth</h1>
        <p>
          Login Google sudah disiapkan lewat NextAuth. Isi kredensial Google di
          file env lokal untuk mengaktifkan tombol login.
        </p>

        <div className="setup-list">
          <span>
            {authConfigStatus.googleClientId ? "Siap" : "Belum"}:
            GOOGLE_CLIENT_ID
          </span>
          <span>
            {authConfigStatus.googleClientSecret ? "Siap" : "Belum"}:
            GOOGLE_CLIENT_SECRET
          </span>
          <span>
            {authConfigStatus.nextAuthSecret ? "Siap" : "Belum"}:
            NEXTAUTH_SECRET
          </span>
          <span>
            Production URL: isi NEXTAUTH_URL setelah domain Vercel tersedia
          </span>
          <span>Authorized JavaScript origin: {requestOrigin}</span>
          <span>Authorized redirect URI: {callbackUrl}</span>
        </div>

        <div className="setup-actions">
          <AuthControls
            canUseGoogle={isGoogleAuthConfigured}
            user={session?.user}
          />
          <Link className="button button-muted" href="/">
            Kembali ke Forum
          </Link>
        </div>
      </div>

      {!isGoogleAuthConfigured ? (
        <div className="alert-box">
          <LogIn size={18} />
          Tombol login aktif setelah GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
          dan NEXTAUTH_SECRET diisi.
        </div>
      ) : null}
    </main>
  );
}
