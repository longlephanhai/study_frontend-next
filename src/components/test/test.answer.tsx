'use client'

import { useState } from "react";
import { Button } from "antd";
import Part1Answer from "../answer/part1.answer";
import Part2Answer from "../answer/part2.answer";
import Part3Answer from "../answer/part3.answer";
import Part4Answer from "../answer/part4.answer";
import Part5Answer from "../answer/part5.answer";
import Part6Answer from "../answer/part6.answer";
import Part7Answer from "../answer/part7.answer";

interface IProps {
  partsData: IPart[];
  answerUser: any;
}

export default function TestAnswerComponent({ partsData, answerUser }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPart = partsData[currentIndex];
  const goNext = () => {
    if (currentIndex < partsData.length - 1) setCurrentIndex(currentIndex + 1);
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }
  return (
    <>
      {
        currentPart?.partNo === 1 && (
          <Part1Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart?.partNo === 2 && (
          <Part2Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart.partNo === 3 && (
          <Part3Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart?.partNo === 4 && (
          <Part4Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart?.partNo === 5 && (
          <Part5Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart?.partNo === 6 && (
          <Part6Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart?.partNo === 7 && (
          <Part7Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      <div style={{ marginTop: 20 }}>
        <Button onClick={goPrev} disabled={currentIndex === 0}>Previous</Button>
        <Button onClick={goNext} disabled={currentIndex === partsData.length - 1} style={{ marginLeft: 10 }}>Next</Button>

      </div>
      <p style={{ marginTop: 10 }}>Phần {currentPart.partNo} / {partsData.length}</p>
    </>
  )
}