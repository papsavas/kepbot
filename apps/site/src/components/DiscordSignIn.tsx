import Link from "next/link";
import { Button } from "./ui/button";

const url = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.BASE_URL}/api/auth/callback/discord&scope=identify`;

export async function DiscordSignIn() {
  return (
    <Button>
      <Link href={url}>Login with Discord</Link>
    </Button>
  );
}
