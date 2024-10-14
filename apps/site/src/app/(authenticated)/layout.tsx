import { getUser } from "~/auth";
import { DiscordSignIn } from "~/components/DiscordSignIn";
import { AuthProvider } from "~/context/AuthProvider";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  if (!user)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p>Not authenticated</p>
        <DiscordSignIn />
      </div>
    );
  return <AuthProvider user={user}>{children}</AuthProvider>;
}
