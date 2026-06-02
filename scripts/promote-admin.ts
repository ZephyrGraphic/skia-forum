import "dotenv/config";

import { PRIMARY_ADMIN_EMAIL } from "../src/lib/admin-config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? PRIMARY_ADMIN_EMAIL;
  const result = await prisma.user.updateMany({
    where: { email },
    data: { role: "ADMIN" },
  });

  if (result.count === 0) {
    console.log(`No user found for ${email}. Login once, then run again.`);
    return;
  }

  console.log(`Promoted ${email} to ADMIN.`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
