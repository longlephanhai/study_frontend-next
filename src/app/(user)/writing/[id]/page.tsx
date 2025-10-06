import { auth } from "@/auth";
import WritingTextarea from "@/components/writing/writing.textarea";
import { sendRequest } from "@/utils/api";

export default async function WritingDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IWriting>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing/${params.id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-writing'] }
    }
  })

  return (
    <>
      <WritingTextarea writing={res?.data ?? null} />
    </>
  )
}