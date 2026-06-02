import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      badge?: string | null;
      bannedAt?: Date | string | null;
    } & DefaultSession["user"];
  }
}
