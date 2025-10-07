'use client'

import { useState, useRef } from "react";
import { Button, Space, Tag, message } from "antd";
import Part1Component from "@/components/exam/exam.part1";
import Part2Component from "@/components/exam/exam.part2";
import Part3Component from "./exam.part3";
import Part4Component from "./exam.part4";

interface IProps {
  partsData: IPart[]
}

export default function ExamPageClient({ partsData }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({}); // ref cho từng câu hỏi

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

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Space wrap style={{ marginBottom: 20 }}>
        {partsData.map((part, index) => (
          <Button
            key={part._id}
            type={index === currentIndex ? "primary" : "default"}
            onClick={() => setCurrentIndex(index)}
          >
            Part {part.partNo}
          </Button>
        ))}
      </Space>

      {/* Question Tracker */}
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

      {/* Part Component */}
      {currentPart.partNo === 1 && (
        <Part1Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
        />
      )}
      {currentPart.partNo === 2 && (
        <Part2Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
        />
      )}
      {currentPart.partNo === 3 && (
        <Part3Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
        />
      )}

      {currentPart.partNo === 4 && (
        <Part4Component
          part={currentPart}
          onAnswerChange={handleAnswerChange}
          answers={allAnswers}
          questionRefs={questionRefs}
        />
      )}

      {/* Navigation & Submit */}
      <div style={{ marginTop: 20 }}>
        <Button onClick={goPrev} disabled={currentIndex === 0}>Previous</Button>
        <Button onClick={goNext} disabled={currentIndex === partsData.length - 1} style={{ marginLeft: 10 }}>Next</Button>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={() => message.success('Đã nộp đáp án!')}
        >
          Nộp tất cả
        </Button>
      </div>

      <p style={{ marginTop: 10 }}>Phần {currentPart.partNo} / {partsData.length}</p>
    </div>
  )
}
