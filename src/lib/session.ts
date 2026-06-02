import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function getOptionalSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}
