import { auth } from "@/auth";
import GrammarList from "@/components/grammar/grammar.list";
import { sendRequest } from "@/utils/api";

export default async function GrammarPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IModelPaginate<IGrammar>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grammars`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-grammars'] }
    }
  })

  const grammars = res?.data?.result ?? [];
  return (
    <GrammarList grammars={grammars} />
  )
}