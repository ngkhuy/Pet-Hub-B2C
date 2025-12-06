"use server";

import { decrypt } from "@/lib/actions/session";

export async function decryptJwtToken(session: string | undefined = "") {
  return await decrypt(session);
}
