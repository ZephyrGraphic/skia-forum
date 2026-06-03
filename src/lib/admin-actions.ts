"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminUser } from "@/lib/admin";
import {
  allowedRoles,
  isProtectedAdminEmail,
  normalizeRole,
} from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

const roleSchema = z.object({
  badge: z.string().trim().max(32).optional(),
  role: z.enum(allowedRoles),
  userId: z.string().trim().min(1),
});

const banSchema = z.object({
  reason: z.string().trim().max(240).optional(),
  userId: z.string().trim().min(1),
});

const deleteSchema = z.object({
  confirm: z.string().trim(),
  userId: z.string().trim().min(1),
});

function adminRedirect(
  type: "notice" | "error",
  message: string,
): never {
  redirect(`/admin?${type}=${encodeURIComponent(message)}`);
}

async function getTargetUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

async function enforceAdminActionRateLimit(adminId: string, scope: string) {
  try {
    await enforceRateLimit({
      identity: adminId,
      limit: 30,
      scope,
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      adminRedirect("error", error.message);
    }

    throw error;
  }
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdminUser();
  await enforceAdminActionRateLimit(admin.id, "admin:role");
  const result = roleSchema.safeParse({
    badge: formData.get("badge") ?? "",
    role: formData.get("role"),
    userId: formData.get("userId"),
  });

  if (!result.success) {
    adminRedirect("error", "Input role atau badge tidak valid.");
  }

  const target = await getTargetUser(result.data.userId);

  if (!target) {
    adminRedirect("error", "User tidak ditemukan.");
  }

  const role = isProtectedAdminEmail(target.email)
    ? "ADMIN"
    : normalizeRole(result.data.role);

  await prisma.user.update({
    where: { id: target.id },
    data: {
      badge: result.data.badge || null,
      role,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  adminRedirect("notice", "Role dan tag user diperbarui.");
}

export async function banUserAction(formData: FormData) {
  const admin = await requireAdminUser();
  await enforceAdminActionRateLimit(admin.id, "admin:ban");
  const result = banSchema.safeParse({
    reason: formData.get("reason") ?? "",
    userId: formData.get("userId"),
  });

  if (!result.success) {
    adminRedirect("error", "Input ban tidak valid.");
  }

  const target = await getTargetUser(result.data.userId);

  if (!target) {
    adminRedirect("error", "User tidak ditemukan.");
  }

  if (target.id === admin.id || isProtectedAdminEmail(target.email)) {
    adminRedirect("error", "Admin utama tidak bisa diban.");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: target.id },
      data: {
        bannedAt: new Date(),
        bannedReason: result.data.reason || "Dibatasi oleh admin.",
      },
    }),
    prisma.session.deleteMany({ where: { userId: target.id } }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/");
  adminRedirect("notice", "User berhasil diban.");
}

export async function unbanUserAction(formData: FormData) {
  const admin = await requireAdminUser();
  await enforceAdminActionRateLimit(admin.id, "admin:unban");
  const userId = String(formData.get("userId") ?? "");

  if (!userId) {
    adminRedirect("error", "User tidak ditemukan.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      bannedAt: null,
      bannedReason: null,
    },
  });

  revalidatePath("/admin");
  adminRedirect("notice", "Ban user sudah dicabut.");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdminUser();
  await enforceAdminActionRateLimit(admin.id, "admin:delete");
  const result = deleteSchema.safeParse({
    confirm: formData.get("confirm"),
    userId: formData.get("userId"),
  });

  if (!result.success || result.data.confirm !== "DELETE") {
    adminRedirect("error", "Ketik DELETE untuk menghapus user.");
  }

  const target = await getTargetUser(result.data.userId);

  if (!target) {
    adminRedirect("error", "User tidak ditemukan.");
  }

  if (target.id === admin.id || isProtectedAdminEmail(target.email)) {
    adminRedirect("error", "Admin utama tidak bisa dihapus.");
  }

  await prisma.user.delete({ where: { id: target.id } });

  revalidatePath("/admin");
  revalidatePath("/");
  adminRedirect("notice", "User dan kontennya sudah dihapus.");
}
