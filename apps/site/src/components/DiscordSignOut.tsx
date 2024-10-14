"use client";

import { logout } from "~/actions/logout";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { type getAuthenticatedUser } from "~/auth";

export function DiscordSignOut({
  user,
}: {
  user: Awaited<ReturnType<typeof getAuthenticatedUser>>;
}) {
  const router = useRouter();
  return (
    <div>
      <p>Logged in as {JSON.stringify(user)}</p>
      <Button
        onClick={async () => {
          await logout();
          router.push("/");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
