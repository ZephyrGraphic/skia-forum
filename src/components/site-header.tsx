import Link from "next/link";
import { Bell, BookOpen, MessageSquare, Plus, Shield, UserRound } from "lucide-react";

import { AuthControls } from "@/components/auth-controls";
import { isAdminEmail } from "@/lib/admin-config";
import { isGoogleAuthConfigured } from "@/lib/auth";
import { getOptionalSession } from "@/lib/session";

export async function SiteHeader() {
  const session = await getOptionalSession();
  const isAdmin =
    session?.user?.role === "ADMIN" || isAdminEmail(session?.user?.email);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Shield size={19} />
          </span>
          <span>
            <strong>SKIA Hangout</strong>
            <small>Board komunitas</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Navigasi utama">
          <Link href="/?type=DISCUSSION">
            <MessageSquare size={17} />
            Forums
          </Link>
          <Link href="/?type=GUIDE">
            <BookOpen size={17} />
            Guides
          </Link>
          <Link href="/me">
            <UserRound size={17} />
            Members
          </Link>
          <Link href="/compose">
            <Plus size={17} />
            Post
          </Link>
          {isAdmin ? (
            <Link href="/admin">
              <Shield size={17} />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="header-tools" aria-hidden="true">
          <Bell size={21} />
        </div>

        <AuthControls
          canUseGoogle={isGoogleAuthConfigured}
          user={session?.user}
        />
      </div>
    </header>
  );
}
