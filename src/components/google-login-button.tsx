"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Settings } from "lucide-react";
import { signIn } from "next-auth/react";

type GoogleLoginButtonProps = {
  callbackUrl: string;
  canUseGoogle: boolean;
};

export function GoogleLoginButton({
  callbackUrl,
  canUseGoogle,
}: GoogleLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);

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
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        void signIn("google", { callbackUrl });
      }}
      type="button"
    >
      <LogIn size={18} />
      {isPending ? "Menghubungkan..." : "Login Google"}
    </button>
  );
}
