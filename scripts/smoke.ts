const baseUrl =
  process.env.SMOKE_BASE_URL?.replace(/\/+$/, "") ?? "http://127.0.0.1:3000";

type Check = {
  path: string;
  text?: string;
  status?: number;
};

const checks: Check[] = [
  { path: "/", text: "SKIA Hangout" },
  { path: "/auth/login?callbackUrl=%2F", text: "Login untuk ikut ngobrol" },
  { path: "/auth/error?error=AccessDenied", text: "Login belum selesai" },
  { path: "/compose", text: "Login Google diperlukan" },
  { path: "/me", text: "Profil member" },
  { path: "/api/auth/providers", text: "google" },
  { path: "/robots.txt", text: "sitemap" },
  { path: "/sitemap.xml", text: "<urlset" },
];

async function runCheck({ path, status = 200, text }: Check) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "follow",
  });
  const body = await response.text();

  if (response.status !== status) {
    throw new Error(`${path} returned ${response.status}, expected ${status}`);
  }

  if (text && !body.includes(text)) {
    throw new Error(`${path} did not include expected text: ${text}`);
  }

  console.log(`OK ${path}`);
}

async function main() {
  for (const check of checks) {
    await runCheck(check);
  }

  console.log("Smoke checks passed.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
