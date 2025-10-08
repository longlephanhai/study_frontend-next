import { auth } from "@/auth";
import ExamResultDetail from "@/components/result";
import { sendRequest } from "@/utils/api";

export default async function ResultPage({ params }: { params: { id: string, resultId: string } }) {
  // console.log(params.resultId);
  const session = await auth();

  const res = await sendRequest({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-result/${params.resultId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: [`fetch-exam-result-${params.resultId}`] }
    }
  })

  //@ts-ignore
  const result = res?.data ?? [];
  return (
    <>
      <ExamResultDetail result={result} />
    </>
  )
}