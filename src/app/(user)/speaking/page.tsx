import { auth } from "@/auth";
import TopicsVocabularyList from "@/components/speaking/topics.list";
import { sendRequest } from "@/utils/api";

export default async function SpeakingPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IModelPaginate<ITopicVocabulary>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topics-speaking`,
    method: "GET",
    queryParams: { current: 1, pageSize: 20 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-topics-speaking'] }
    }
  })

  const topics = res?.data?.result ?? [];


  return (
    <>
      <TopicsVocabularyList topics={topics} />
    </>
  )
}