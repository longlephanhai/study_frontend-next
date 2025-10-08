import { auth } from "@/auth";
import ExamPageClient from "@/components/exam/exam.client";
import { sendRequest } from "@/utils/api";

interface IProps {
  searchParams: { parts?: string }
}

export default async function ExamPage(props: IProps) {
  const session = await auth();

  const { searchParams } = props;
  const { parts } = searchParams;
  const partIds = parts?.split(',') || [];

  const res = await sendRequest<IBackendRes<IPart[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parts/start`,
    method: "POST",
    body: { partIds },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-parts'] }
    }
  })

  const partsData = res.data ?? [];

  return (
    <ExamPageClient partsData={partsData} />
  )
}