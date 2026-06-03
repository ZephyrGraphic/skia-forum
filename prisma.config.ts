import "dotenv/config";
import { defineConfig, env } from "prisma/config";

import { normalizeDatabaseUrl } from "./src/lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: normalizeDatabaseUrl(env("DATABASE_URL")),
  },
});
