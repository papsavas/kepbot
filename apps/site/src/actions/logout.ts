"use server";
import "server-only";

import { cookies } from "next/headers";
import { AuthJWTName } from "~/auth";

export async function logout() {
  cookies().delete(AuthJWTName);
}
