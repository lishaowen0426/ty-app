import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { auth } from "@/lib/auth";

export default async function SigninButton() {
  const session = await auth();

  return <Button onClick={() => signIn()}>登陆</Button>;
}
