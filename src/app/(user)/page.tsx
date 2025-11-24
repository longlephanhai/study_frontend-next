import { auth } from "@/auth";
import StudyMain from "@/components/home/toeic.home";
import NoLearningPath from "@/components/home/toeic.noLearningPath";
import { sendRequest } from "@/utils/api";

export default async function HomePage() {
  const session = await auth();

  if(!session){
    return (
      <div>Please login to continue.</div>
    )
  }

  if (session?.user.learningPaths === false) {
    return (
      <NoLearningPath />
    )
  }

  const res = await sendRequest<IBackendRes<ILearningPath[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-path/by-user`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-learning-path'] }
    }
  })

  const learningPath = res?.data ?? [];


  return (
    <StudyMain learningPaths={learningPath} />
  )
}
