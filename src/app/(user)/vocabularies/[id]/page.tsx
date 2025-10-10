import { auth } from "@/auth";
import TopicsVocabularies from "@/components/vocabularies/topics.vocabularies";
import { sendRequest } from "@/utils/api";

export default async function VocabularyDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  const res = await sendRequest<IBackendRes<ITopicVocabulary>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topics-vocabularies/${params.id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: [`fetch-topics-vocabulary-by-${params.id}`] }
    }
  })

  const vocabularies = res?.data?.vocabularies ?? [];
  return (
    <>
      <TopicsVocabularies vocabularies={vocabularies} />
    </>
  )
}