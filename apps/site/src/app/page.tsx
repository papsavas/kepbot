import { getUser } from "~/auth";
import { DiscordSignIn } from "~/components/DiscordSignIn";
import { DiscordSignOut } from "~/components/DiscordSignOut";

export default async function HomePage() {
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {user ? <DiscordSignOut user={user} /> : <DiscordSignIn />}
    </main>
  );
}
