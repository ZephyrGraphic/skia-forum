"use client";

import { DatabaseZap, RefreshCw } from "lucide-react";

function isDatabaseError(error: Error) {
  return (
    error.name === "PrismaClientInitializationError" ||
    error.message.includes("Can't reach database server")
  );
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const databaseError = isDatabaseError(error);

  return (
    <main className="container narrow-page">
      <div className="page-panel">
        <span className="panel-icon">
          <DatabaseZap size={22} />
        </span>
        <h1>
          {databaseError ? "PostgreSQL belum tersambung" : "Terjadi masalah"}
        </h1>
        <p>
          {databaseError
            ? "Koneksi Prisma Postgres belum tersedia. Periksa DATABASE_URL, jalankan migrate dan seed, lalu refresh halaman."
            : "Halaman ini gagal dimuat. Coba refresh ulang."}
        </p>
        {databaseError ? (
          <div className="setup-list">
            <span>npm run db:push</span>
            <span>npm run db:seed</span>
          </div>
        ) : null}
        <button className="button button-primary" onClick={reset} type="button">
          <RefreshCw size={18} />
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
