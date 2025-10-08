import { auth } from "@/auth";
import TestList from "@/components/test/test.list";
import { sendRequest } from "@/utils/api";

export default async function TestPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IModelPaginate<ITest>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-test'] }
    }
  })

  const tests = res?.data?.result ?? [];


  return (
    <>
      <TestList tests={tests} />
    </>
  )
}