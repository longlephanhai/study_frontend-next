import { auth } from "@/auth";
import StudyMain from "@/components/home/toeic.home";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }
  return (
    <StudyMain/>
  )
}
