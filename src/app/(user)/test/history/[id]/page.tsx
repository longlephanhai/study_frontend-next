import { auth } from "@/auth";
import TestHistoryDetail from "@/components/test/test.history.detail";
import { sendRequest } from "@/utils/api";

export default async function ExamResultsHistoryDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

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
  const result = res?.data ?? [];
  return (
    <>
      <TestHistoryDetail result={result} />
    </>
  )
}