import { auth } from "@/auth";
import FlashcardComponent from "@/components/flashcard/flashcard.display";
import { sendRequest } from "@/utils/api";

export default async function FlashcardPage() {
  const session = await auth();

  const res = await sendRequest<IBackendRes<IFlashCard[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flash-card`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-flashcard'] }
    }
  })

  const flashcards = res?.data ?? [];
  // console.log(flashcards);
  return (
    <>
      <FlashcardComponent flashcards={flashcards} />
    </>
  )
}

