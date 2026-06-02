import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container narrow-page">
      <div className="page-panel">
        <h1>Thread tidak ditemukan</h1>
        <p>Topik ini mungkin sudah dipindahkan atau belum pernah dibuat.</p>
        <Link className="button button-primary" href="/">
          Kembali ke Forum
        </Link>
      </div>
    </main>
  );
}
