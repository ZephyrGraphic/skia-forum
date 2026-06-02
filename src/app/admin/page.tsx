import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

import { Avatar } from "@/components/avatar";
import { UserLabels } from "@/components/user-labels";
import {
  banUserAction,
  deleteUserAction,
  unbanUserAction,
  updateUserRoleAction,
} from "@/lib/admin-actions";
import { requireAdminUser } from "@/lib/admin";
import { allowedRoles, isProtectedAdminEmail } from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";
import { formatNumber, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = (await searchParams) ?? {};
  const [admin, users, totals] = await Promise.all([
    requireAdminUser(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
      include: {
        _count: {
          select: {
            bookmarks: true,
            comments: true,
            posts: true,
            reactions: true,
          },
        },
      },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { bannedAt: { not: null } } }),
      prisma.post.count(),
      prisma.comment.count(),
    ]),
  ]);
  const [userCount, bannedCount, postCount, commentCount] = totals;
  const notice = getParam(params, "notice");
  const error = getParam(params, "error");
  const sortedUsers = users
    .map((user) => ({
      ...user,
      activity:
        user._count.posts * 4 +
        user._count.comments * 2 +
        user._count.reactions +
        user._count.bookmarks,
    }))
    .sort((a, b) => b.activity - a.activity);

  return (
    <main className="container admin-page">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">Admin board</span>
          <h1>Moderasi SKIA Hangout</h1>
          <p>
            Login sebagai {admin.email}. Kelola role, tag kontributor, ban,
            dan hapus akun spam.
          </p>
        </div>
        <Link className="button button-muted" href="/">
          Kembali ke forum
        </Link>
      </section>

      {notice ? (
        <div className="notice-box">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="alert-box">
          <Ban size={18} />
          {error}
        </div>
      ) : null}

      <section className="admin-stats" aria-label="Statistik admin">
        <span>
          <strong>{formatNumber(userCount)}</strong>
          User
        </span>
        <span>
          <strong>{formatNumber(bannedCount)}</strong>
          Banned
        </span>
        <span>
          <strong>{formatNumber(postCount)}</strong>
          Thread
        </span>
        <span>
          <strong>{formatNumber(commentCount)}</strong>
          Komentar
        </span>
      </section>

      <section className="admin-user-list">
        <div className="feed-heading">
          <div>
            <span className="eyebrow">User paling aktif</span>
            <h2>
              <Users size={20} />
              Member & Moderasi
            </h2>
          </div>
        </div>

        {sortedUsers.map((user) => {
          const isSelf = user.id === admin.id;
          const isProtected = isProtectedAdminEmail(user.email);

          return (
            <article className="admin-user-card" key={user.id}>
              <div className="admin-user-main">
                <Avatar image={user.image} name={user.name} />
                <div>
                  <div className="admin-user-title">
                    <strong>{user.name ?? "Member"}</strong>
                    <UserLabels badge={user.badge} role={user.role} />
                  </div>
                  <p>{user.email ?? "Email tidak tersedia"}</p>
                  <div className="admin-user-metrics">
                    <span>{formatNumber(user._count.posts)} thread</span>
                    <span>{formatNumber(user._count.comments)} komentar</span>
                    <span>{formatNumber(user._count.reactions)} reaction</span>
                    <span>Aktivitas {formatNumber(user.activity)}</span>
                    {user.bannedAt ? (
                      <span className="is-danger">
                        Banned {timeAgo(user.bannedAt)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <form className="admin-role-form" action={updateUserRoleAction}>
                <input name="userId" type="hidden" value={user.id} />
                <label>
                  <span>Role</span>
                  <select
                    defaultValue={isProtected ? "ADMIN" : user.role}
                    disabled={isProtected}
                    name="role"
                  >
                    {allowedRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {isProtected ? (
                    <input name="role" type="hidden" value="ADMIN" />
                  ) : null}
                </label>
                <label>
                  <span>Tag</span>
                  <input
                    defaultValue={user.badge ?? ""}
                    maxLength={32}
                    name="badge"
                    placeholder="Top contributor"
                  />
                </label>
                <button className="button button-muted" type="submit">
                  <ShieldCheck size={17} />
                  Simpan
                </button>
              </form>

              <div className="admin-danger-zone">
                {user.bannedAt ? (
                  <form action={unbanUserAction}>
                    <input name="userId" type="hidden" value={user.id} />
                    <button className="button button-muted" type="submit">
                      Cabut ban
                    </button>
                  </form>
                ) : (
                  <form action={banUserAction}>
                    <input name="userId" type="hidden" value={user.id} />
                    <input
                      disabled={isSelf || isProtected}
                      maxLength={240}
                      name="reason"
                      placeholder="Alasan ban"
                    />
                    <button
                      className="button button-muted"
                      disabled={isSelf || isProtected}
                      type="submit"
                    >
                      <Ban size={17} />
                      Ban
                    </button>
                  </form>
                )}

                <form action={deleteUserAction}>
                  <input name="userId" type="hidden" value={user.id} />
                  <input
                    disabled={isSelf || isProtected}
                    name="confirm"
                    placeholder="Ketik DELETE"
                  />
                  <button
                    className="button button-danger"
                    disabled={isSelf || isProtected}
                    type="submit"
                  >
                    <Trash2 size={17} />
                    Hapus
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
