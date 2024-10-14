import Link from "next/link";
import { Button } from "./ui/button";

const url =
  "https://discord.com/oauth2/authorize?client_id=1202764348012101744&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify";
export async function DiscordSignIn() {
  return (
    <Button>
      <Link href={url}></Link>
    </Button>
  );
}
