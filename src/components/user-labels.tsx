import { ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  GUIDE_WRITER: "Guide",
  MODERATOR: "Mod",
  TOP_MEMBER: "Aktif",
};

type UserLabelsProps = {
  badge?: string | null;
  role?: string | null;
};

export function UserLabels({ badge, role }: UserLabelsProps) {
  const roleLabel = role ? roleLabels[role] : undefined;

  if (!roleLabel && !badge) {
    return null;
  }

  return (
    <span className="user-labels">
      {roleLabel ? (
        <span className={cn("user-label", role === "ADMIN" && "is-admin")}>
          <ShieldCheck size={12} />
          {roleLabel}
        </span>
      ) : null}
      {badge ? (
        <span className="user-label">
          <Sparkles size={12} />
          {badge}
        </span>
      ) : null}
    </span>
  );
}
