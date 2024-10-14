import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

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

    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    return NextResponse.json(await res.json());
  }
  // cookies().set({
  //   name: "discord-access-token",
  //   value: code,
  //   secure: process.env.NODE_ENV === "production",
  //   expires: new Date(Date.now() + 60 * 60 * 1000),
  // });

  return NextResponse.json({ name: "Discord callback", code });
}
