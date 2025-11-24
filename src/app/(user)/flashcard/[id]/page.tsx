import { auth } from "@/auth";
import DisplayVocabularies from "@/components/flashcard/flashcard.vocabularies.displat";
import { sendRequest } from "@/utils/api";


export default async function FlashCardDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IFlashCard>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flash-card/${params.id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: [`fetch-flashcard-${params.id}`] }
    }
  })
  const flashcards = res?.data?.vocabulariesFlashCardId ?? [];
  return (
    <>
     {
      <DisplayVocabularies vocabularies={flashcards} params={params}/>
     }
    </>
  )
}
