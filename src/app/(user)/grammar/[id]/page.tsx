import GrammarQuestionAIComponent from "@/components/grammar/grammar.ai";


export default async function GrammarQuestionAI({ params }: { params: { id: string } }) {
  // const session = await auth();

  // const res = await sendRequest<IBackendRes<any>>({
  //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grammars/questions-ai/${params.id}`,
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${session?.access_token}`,
  //   },
  //   nextOption: {
  //     next: { tags: [`fetch-grammars-by-ai-${params.id}`] }
  //   }
  // })

  // const questionsAI = res?.data?.result ?? [];
  // console.log('questionsAI', questionsAI);
  return (
    <>
      <GrammarQuestionAIComponent params={params} />
    </>
  )
}