import { auth } from "@/auth";
import TestAnswerComponent from "@/components/test/test.answer";
import { sendRequest } from "@/utils/api";

export default async function AnswerDetailPage({ params, searchParams }: { params: { id: string }, searchParams: { parts?: string } }) {

  const partIds = searchParams.parts?.split(',') || [];

  const session = await auth();

  const res1 = await sendRequest<IBackendRes<IPart[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parts/start`,
    method: "POST",
    body: { partIds },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-parts'] }
    }
  })
  const partsData = res1.data ?? [];


  const res = await sendRequest({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-result/${params.id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: [`fetch-exam-result-${params.id}`] }
    }
  })

  //@ts-ignore
  const answerUser = res?.data ?? [];



  return (
    <>
      <TestAnswerComponent
        partsData={partsData}
        answerUser={answerUser}
      />
    </>
  )
}