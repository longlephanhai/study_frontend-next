import { auth } from "@/auth";
import ExamResultsHistory from "@/components/test/test.history";
import { sendRequest } from "@/utils/api";

export default async function TestHistoryPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IExamResult[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-result/user/history`,
    method: "GET",
    queryParams: { current: 1, pageSize: 20 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-exam-result-history'] }
    }
  })

  const examResultHistories = res.data ?? [];
  return (
    <><ExamResultsHistory examResultHistories={examResultHistories} /></>
  );
}
