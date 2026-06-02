import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="empty-state">
      <MessageSquarePlus size={36} />
      <h2>Belum ada thread yang cocok.</h2>
      <p>Mulai topik baru atau longgarkan filter pencarian.</p>
      <Link className="button button-primary" href="/compose">
        Buat Thread
      </Link>
    </div>
  );
}
