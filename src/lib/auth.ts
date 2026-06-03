import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { isAdminEmail } from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";

function hasUsableEnv(name: string) {
  const value = process.env[name]?.trim().toLowerCase();

  return Boolean(
    value &&
      !value.includes("replace-with") &&
      !value.includes("your-") &&
      !value.includes("not-set"),
  );
}

export const authConfigStatus = {
  googleClientId: hasUsableEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret: hasUsableEnv("GOOGLE_CLIENT_SECRET"),
  nextAuthSecret: hasUsableEnv("NEXTAUTH_SECRET"),
  nextAuthUrl: hasUsableEnv("NEXTAUTH_URL") || hasUsableEnv("VERCEL_URL"),
};

export const isGoogleAuthConfigured =
  authConfigStatus.googleClientId &&
  authConfigStatus.googleClientSecret &&
  authConfigStatus.nextAuthSecret;

const authAdapterClient = prisma as unknown as Parameters<typeof PrismaAdapter>[0];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(authAdapterClient),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { bannedAt: true, role: true },
      });

      if (existingUser?.bannedAt) {
        return "/auth/error?error=Banned";
      }

      if (isAdminEmail(user.email) && existingUser?.role !== "ADMIN") {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { role: "ADMIN" },
        });
      }

      return true;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsedUrl = new URL(url);

        if (parsedUrl.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
    session({ session, user }) {
      if (session.user) {
        const appUser = user as typeof user & {
          badge?: string | null;
          bannedAt?: Date | null;
          bio?: string | null;
          role?: string | null;
          username?: string | null;
        };

        session.user.id = user.id;
        session.user.name = appUser.username ?? null;
        session.user.username = appUser.username ?? null;
        session.user.bio = appUser.bio ?? null;
        session.user.role = isAdminEmail(user.email)
          ? "ADMIN"
          : appUser.role ?? "MEMBER";
        session.user.badge = appUser.badge ?? null;
        session.user.bannedAt = appUser.bannedAt ?? null;
      }

      return session;
    },
  },
};
