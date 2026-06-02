# SKIA Forum

Forum diskusi Seven Knights Idle Adventure berbasis Next.js, NextAuth Google OAuth, Prisma Postgres, dan Prisma ORM.

## Menjalankan Lokal

1. Pastikan `.env` berisi `DATABASE_URL` dari Prisma Postgres, lalu isi kredensial Google OAuth jika ingin login Google aktif.
2. Sinkronkan schema dan seed data:
   ```bash
   npm run prisma:migrate
   npm run db:seed
   ```
3. Verifikasi koneksi:
   ```bash
   npm run verify:prisma
   ```
4. Jalankan website:
   ```bash
   npm run dev
   ```

Callback Google OAuth lokal:

```text
http://localhost:3000/api/auth/callback/google
```

## Deploy ke Vercel

Sebelum push, jalankan:

```bash
npm run deploy:check
```

Untuk smoke test halaman lokal, jalankan dev server lalu:

```bash
npm run smoke
```

Smoke test mengecek forum utama, halaman login, halaman gagal login,
halaman yang butuh login, endpoint NextAuth, robots, dan sitemap.

Environment variables yang perlu diisi di Vercel:

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_SITE_URL
AUTH_TRUST_HOST
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Setelah project berhasil deploy, isi `NEXTAUTH_URL` dan `NEXT_PUBLIC_SITE_URL`
dengan domain Vercel, misalnya `https://nama-project.vercel.app`.

Callback URL Google OAuth production:

```text
https://nama-project.vercel.app/api/auth/callback/google
```

Kalau muncul `redirect_uri_mismatch`, buka `/auth/setup` di domain Vercel.
Salin nilai `Authorized JavaScript origin` dan `Authorized redirect URI`
yang tampil di halaman itu ke OAuth Client ID Google Cloud.

Kalau schema berubah setelah deploy, jalankan migrasi production dari terminal
lokal:

```bash
npm run db:migrate:deploy
```
