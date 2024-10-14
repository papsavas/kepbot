import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createJWT, validateJWT } from "oslo/jwt";
import { z } from "zod";

import "server-only";
import { TimeSpan } from "oslo";

const payloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
});

export const AuthJWTName = "auth";
export const AuthJWTAlgo = "HS256";

export async function createAuthJWT({
  payload,
  expiresInSeconds,
}: {
  payload: z.infer<typeof payloadSchema>;
  expiresInSeconds?: number;
}) {
  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET is not set");

  const secret = new TextEncoder().encode(AUTH_SECRET);

  const JWT = await createJWT(AuthJWTAlgo, secret, payload, {
    expiresIn: expiresInSeconds
      ? new TimeSpan(expiresInSeconds, "s")
      : undefined,
  });

  return {
    value: JWT,
    name: AuthJWTName,
    algorithm: AuthJWTAlgo,
  } as const;
}

export async function getUser() {
  const auth = cookies().get("auth");
  if (!auth) return null;

  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET is not set");

  try {
    const JWT = await validateJWT(
      "HS256",
      new TextEncoder().encode(AUTH_SECRET),
      auth.value,
    );

    if (JWT.expiresAt && JWT.expiresAt < new Date())
      throw new Error("JWT expired");

    return payloadSchema.parse(JWT.payload);
  } catch (error) {
    cookies().delete("auth");
    redirect("/");
  }
}

export async function getAuthenticatedUser() {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
