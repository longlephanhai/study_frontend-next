'use client'

import { useState, useRef, useEffect } from "react";
import { Button, Space, Tag, message, Statistic } from "antd";
import Part1Component from "@/components/exam/exam.part1";
import Part2Component from "@/components/exam/exam.part2";
import Part3Component from "./exam.part3";
import Part4Component from "./exam.part4";
import Part5Component from "./exam.part5";
import Part6Component from "./exam.part6";
import Part7Component from "./exam.part7";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";


const { Timer } = Statistic;
interface IProps {
  partsData: IPart[]
}

export default function ExamPageClient({ partsData }: IProps) {
  const params = useParams();
  const testId = params.id;

  const { data: session } = useSession();

  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [listCorrectAnswers, setListCorrectAnswers] = useState<Record<string, string>>({});
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [durationSec, setDurationSec] = useState(0);
  const [deadline, setDeadline] = useState(Date.now() + durationSec * 1000);


  useEffect(() => {
    const corrects: Record<string, string> = {};
    partsData.forEach(part => {
      part.questions.forEach(q => {
        corrects[q._id] = q.correctAnswer;
      })
    })
    setListCorrectAnswers(corrects);
  }, []);


  if (partsData.length === 0) return <p>Không có dữ liệu phần nào.</p>;

  const currentPart = partsData[currentIndex];

  const goNext = () => {
    if (currentIndex < partsData.length - 1) setCurrentIndex(currentIndex + 1);
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAllAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  const scrollToQuestion = (questionId: string) => {
    const el = questionRefs.current[questionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.focus?.();
    }
  }

  const handleSubmitAll = async () => {
    let wrongAnswer: string[] = [];
    let correctAnswer: string[] = [];
    let noAnswer: string[] = [];
    let totalReadingCorrect = 0;
    let totalListeningCorrect = 0;
    partsData.forEach(part => {
      part.questions.forEach(q => {
        const userAns = allAnswers[q._id];
        if (!userAns) {
          noAnswer.push(q._id);
        }
        else if (userAns === listCorrectAnswers[q._id]) {
          correctAnswer.push(q._id);
          if (part.partNo >= 1 && part.partNo <= 4) {
            totalListeningCorrect++;
          } else {
            totalReadingCorrect++;
          }
        }
        else {
          wrongAnswer.push(q._id);
        }
      })
    })
    const totalCorrect = totalListeningCorrect + totalReadingCorrect;
    const parts = partsData.map(part => ({
      partId: part._id,
      partNo: part.partNo,
      answers: part.questions.map(q => ({
        questionId: q._id,
        answer: allAnswers[q._id] || null
      }))
    }));

    const data = {
      testId,
      totalCorrect,
      totalListeningCorrect,
      totalReadingCorrect,
      parts,
      correctAnswer,
      wrongAnswer,
      noAnswer
    }

    const res = await sendRequest<IBackendRes<IExamResult>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-result`,
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-exam-result'] }
      }
    })
    if (res && res.data) {
      message.success('Nộp bài thành công!');
      router.push(`/test/${testId}/exam/result/${res.data._id}`);
    }
  }

  useEffect(() => {
    const totalDuration = partsData.reduce((sum, part) => sum + part.durationSec, 0);
    setDurationSec(totalDuration);
    setDeadline(Date.now() + totalDuration * 1000);
  }, []);


  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Space wrap style={{
        marginBottom: 20,
      }}>
        {partsData.map((part, index) => (
          <Button
            key={part._id}
            type={index === currentIndex ? "primary" : "default"}
            onClick={() => setCurrentIndex(index)}
          >
            Part {part.partNo}
          </Button>
        ))}
        <Tag style={{ fontSize: 16, height: 'auto' }}>
          <Timer
            value={deadline}
            type="countdown"
            onFinish={() => {
              message.warning('Hết giờ làm bài!');
              handleSubmitAll();
            }}
          />
        </Tag>
      </Space>

      <div style={{ marginBottom: 20 }}>
        <Space wrap>
          {currentPart.questions.map(q => (
            <Tag
              color={allAnswers[q._id] ? "green" : "default"}
              key={q._id}
              style={{ cursor: 'pointer' }}
              onClick={() => scrollToQuestion(q._id)}
            >
              {q.numberQuestion}
            </Tag>
          ))}
        </Space>
      </div>

      {currentPart.partNo === 1 && (
        <Part1Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}
      {currentPart.partNo === 2 && (
        <Part2Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}
      {currentPart.partNo === 3 && (
        <Part3Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}

      {currentPart.partNo === 4 && (
        <Part4Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}
      {currentPart.partNo === 5 && (
        <Part5Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}
      {currentPart.partNo === 6 && (
        <Part6Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}
      {currentPart.partNo === 7 && (
        <Part7Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
          durationSec={currentPart.durationSec}
        />
      )}


      <div style={{ marginTop: 20 }}>
        <Button onClick={goPrev} disabled={currentIndex === 0}>Previous</Button>
        <Button onClick={goNext} disabled={currentIndex === partsData.length - 1} style={{ marginLeft: 10 }}>Next</Button>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={handleSubmitAll}
        >
          Nộp tất cả
        </Button>
      </div>

      <p style={{ marginTop: 10 }}>Phần {currentPart.partNo} / {partsData.length}</p>
    </div>
  )
}
