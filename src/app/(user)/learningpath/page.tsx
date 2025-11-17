import { sendRequest } from "@/utils/api";
import { auth } from "@/auth";
import Part1Component from "@/components/learningpath/part1";
import GrammarComponent from "@/components/learningpath/grammar";
import Part2Component from "@/components/learningpath/part2";
import Part3Component from "@/components/learningpath/part3";
import Part4Component from "@/components/learningpath/part4";
import Part5Component from "@/components/learningpath/part5";
import Part6Component from "@/components/learningpath/part6";
import Part7Component from "@/components/learningpath/part7";


interface IProps {
  searchParams: { task?: string }
}

export default async function LearningPathPage(props: IProps) {
  const session = await auth();
  const { searchParams } = props;
  const { task: taskId } = searchParams;
  console.log(taskId);
  const res = await sendRequest<IBackendRes<ITask>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-task/${taskId}`,
    method: "GET",
    queryParams: { taskId },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ['fetch-learning-task'] }
    }
  })
  const taskData = res?.data;

  return (
    <>
      {
        taskData?.type === 'Part1' && <Part1Component taskData={taskData} /> ||
        taskData?.type === 'Part2' && <Part2Component taskData={taskData} /> ||
        taskData?.type === 'Part3' && <Part3Component taskData={taskData} /> ||
        taskData?.type === 'Part4' && <Part4Component taskData={taskData} /> ||
        taskData?.type === 'Part5' && <Part5Component taskData={taskData} /> ||
        taskData?.type === 'Part6' && <Part6Component taskData={taskData} /> ||
        taskData?.type === 'Part7' && <Part7Component taskData={taskData} /> ||
        taskData?.type === 'Grammar' && <GrammarComponent taskData={taskData} />
      }
    </>
  )
}
