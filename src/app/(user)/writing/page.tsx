import { auth } from "@/auth";
import ListWriting from "@/components/writing/writing.list";
import { sendRequest } from "@/utils/api"

export default async function WritingPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IModelPaginate<IWriting>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing`,
    method: "GET",
    queryParams: { current: 1, pageSize: 20 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-writing'] }
    }
  })

  const writings = res?.data?.result ?? [];


  return (
    <>
      <ListWriting writings={writings} />
    </>
  )
}