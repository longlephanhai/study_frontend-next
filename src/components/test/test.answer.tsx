'use client'

import { useState } from "react";
import Part1Answer from "../answer/part1.answer";

interface IProps {
  partsData: IPart[];
  answerUser: any;
}

export default function TestAnswerComponent({ partsData, answerUser }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPart = partsData[currentIndex];
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
    </>
  )
}