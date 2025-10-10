import { auth } from "@/auth";
import TopicsList from "@/components/vocabularies/topics.list";
import { sendRequest } from "@/utils/api";

export default async function VocabularyPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IModelPaginate<ITopicVocabulary>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topics-vocabularies`,
    method: "GET",
    queryParams: { current: 1, pageSize: 20 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-topics-vocabulary'] }
    }
  })

  const topics = res?.data?.result ?? [];
  return (
    <>
      <TopicsList topics={topics} />
    </>
  );
}
