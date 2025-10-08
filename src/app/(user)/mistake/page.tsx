import { auth } from "@/auth";
import MistakeList from "@/components/mistake/mistake.list";
import { sendRequest } from "@/utils/api";

export default async function MistakePage() {
  const session = await auth();

  const res = await sendRequest<any>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/part5-mistakes`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-all-mistakes'] }
    }
  })

  const mistakes = res?.data ?? [];
  return (
    <>
      <MistakeList mistakes={mistakes} />
    </>
  );
}
