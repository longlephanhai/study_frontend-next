import { auth } from "@/auth";
import AIReview from "@/components/vocabularies/vocabularies.ai-review";
import { sendRequest } from "@/utils/api";

export default async function AIReviewPage({ params }: { params: { id: string } }) {
  // const session = await auth();

  // const res = await sendRequest<IBackendRes<any>>({
  //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topics-vocabularies/ai-review/${params.id}`,
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${session?.access_token}`,
  //   },
  //   nextOption: {
  //     next: { tags: [`fetch-question-vocabulary-by-ai-${params.id}`] }
  //   }
  // })

  // const data = res?.data ?? []
  // console.log('AI Review Data:', data);
  return (
    <>
      <AIReview params={params} />
    </>
  )
}