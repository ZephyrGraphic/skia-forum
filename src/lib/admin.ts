import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-config";
import { loginPath } from "@/lib/auth-routes";
import { prisma } from "@/lib/prisma";

export async function requireAdminUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(loginPath("/admin"));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      bannedAt: true,
    },
  });

  const isAdmin = isAdminEmail(user?.email) || user?.role === "ADMIN";

  if (!user || user.bannedAt || !isAdmin) {
    redirect("/");
  }

  if (isAdminEmail(user.email) && user.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });

    user.role = "ADMIN";
  }

  return user;
}
