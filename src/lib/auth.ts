import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
  session: {
    strategy: "database",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};
