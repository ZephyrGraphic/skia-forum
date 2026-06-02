import Link from "next/link";
import { MessageSquare, Plus, Search, Shield } from "lucide-react";

import { AuthControls } from "@/components/auth-controls";
import { isGoogleAuthConfigured } from "@/lib/auth";
import { getOptionalSession } from "@/lib/session";

export async function SiteHeader() {
  const session = await getOptionalSession();

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
            Diskusi
          </Link>
          <Link href="/?type=GUIDE">
            <Search size={17} />
            Guide
          </Link>
          <Link href="/compose">
            <Plus size={17} />
            Buat
          </Link>
        </nav>

        <AuthControls
          canUseGoogle={isGoogleAuthConfigured}
          user={session?.user}
        />
      </div>
    </header>
  );
}
