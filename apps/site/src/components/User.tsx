import { Button } from "./ui/button";

export async function User() {
  return <Button>TODO</Button>;
  // return session?.user ? (
  //   <form
  //     action={async () => {
  //       "use server";
  //       await signOut();
  //     }}
  //   >
  //     <Button type="submit">Sign Out</Button>
  //     <pre>{JSON.stringify(session, null, 2)}</pre>
  //   </form>
  // ) : (
  //   <form
  //     action={async () => {
  //       "use server";
  //       await signIn("discord", { redirectTo: "/" });
  //     }}
  //   >
  //     <Button type="submit">Sign in</Button>
  //   </form>
  // );
}
