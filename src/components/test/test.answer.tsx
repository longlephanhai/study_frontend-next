'use client'

import { useState } from "react";
import Part1Answer from "../answer/part1.answer";
import Part2Answer from "../answer/part2.answer";
import { Button } from "antd";

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
        currentPart.partNo === 1 && (
          <Part1Answer
            part={currentPart}
            answerUser={answerUser}
          />
        )
      }
      {
        currentPart.partNo === 2 && (
          <Part2Answer
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