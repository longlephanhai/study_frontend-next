import { auth } from "@/auth";
import WritingHistoryPageComponent from "@/components/writing/writing.history";
import { sendRequest } from "@/utils/api";


export default async function WritingHistoryPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IWritingHistory[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing-history/by-user`,
    method: "GET",
    queryParams: { current: 1, pageSize: 20 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-writing-history'] }
    }
  })

  const writingHistories = res.data ?? [];
  return (
    <WritingHistoryPageComponent writingHistories={writingHistories} />
  );
}
