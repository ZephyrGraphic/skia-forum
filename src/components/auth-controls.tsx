"use client";

import Link from "next/link";
import { LogIn, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar } from "@/components/avatar";
import { usernameSetupPath } from "@/lib/auth-routes";

type AuthControlsProps = {
  user?: {
    name?: string | null;
    username?: string | null;
    image?: string | null;
    email?: string | null;
  };
  canUseGoogle: boolean;
};

export function AuthControls({ user, canUseGoogle }: AuthControlsProps) {
  if (user) {
    const displayName = user.username ?? user.name;
    const profileHref = displayName ? "/me" : usernameSetupPath("/me");

    return (
      <div className="auth-cluster">
        <Link className="user-chip" href={profileHref}>
          <Avatar image={user.image} name={displayName} size="sm" />
          <span>{displayName ?? "Lengkapi profil"}</span>
        </Link>
        <button
          className="icon-button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          title="Keluar"
          type="button"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  if (!canUseGoogle) {
    return (
      <Link className="button button-muted" href="/auth/setup">
        <Settings size={18} />
        Setup OAuth
      </Link>
    );
  }

  return (
    <Link
      className="button button-primary"
      href="/auth/login?callbackUrl=%2F"
    >
      <LogIn size={18} />
      Login Google
    </Link>
  );
}
