"use client";

import Link from "next/link";
import { LogIn, LogOut, Settings } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

import { Avatar } from "@/components/avatar";

type AuthControlsProps = {
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  };
  canUseGoogle: boolean;
};

export function AuthControls({ user, canUseGoogle }: AuthControlsProps) {
  if (user) {
    return (
      <div className="auth-cluster">
        <Link className="user-chip" href="/me">
          <Avatar image={user.image} name={user.name} size="sm" />
          <span>{user.name ?? "Member"}</span>
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
    <button
      className="button button-primary"
      onClick={() => void signIn("google", { callbackUrl: "/" })}
      type="button"
    >
      <LogIn size={18} />
      Login Google
    </button>
  );
}
