import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterAuth from "@/components/auth/register.auth";

export default async function Register() {

  const session = await auth();
  if (session) {
    redirect('/')
  }

  return (
    <RegisterAuth />
  );
}
