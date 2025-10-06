import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }
  return (
    <h1>Welcome to Next.js!</h1>
  )
}
