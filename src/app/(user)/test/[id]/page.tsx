import { auth } from "@/auth";
import TestDetailComponent from "@/components/test/test.detail";
import { sendRequest } from "@/utils/api";

export default async function TestPageDetail({ params }: { params: { id: string } }) {
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/${params.id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-test'] }
    }
  })
  const test = res?.data ?? [];
  return (
    <>
      {
        <TestDetailComponent test={test} />
      }
    </>
  )
}