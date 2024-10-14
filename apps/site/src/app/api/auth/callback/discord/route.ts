import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createJWT } from "oslo/jwt";
import { createAuthJWT, AuthJWTName } from "~/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code) {
    const body = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/api/auth/callback/discord",
    }).toString();

    const tokenres = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const token = (await tokenres.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    };

    console.log({ token });

    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });

    const user = (await res.json()) as {
      id: string;
      email: string;
      username: string;
    };

    const { value, name } = await createAuthJWT({
      payload: {
        userId: user.id,
        username: user.username,
      },
      expiresInSeconds: token.expires_in,
    });

    cookies().set({
      name,
      value,
      secure: process.env.NODE_ENV === "production",
      //* will expire JWT instead
      // expires: new Date(Date.now() + token.expires_in),
    });

    redirect("/");
  }
}
