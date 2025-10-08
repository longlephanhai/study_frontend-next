'use client'

import { RefObject } from "react";
import { Radio } from "antd";

interface IProps {
  part: IPart;
  answers?: Record<string, string>;
  onAnswerChange?: (questionId: string, value: string) => void;
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>;
  durationSec?: number;
}

const Part4Component = ({ part, answers = {}, onAnswerChange, questionRefs, durationSec }: IProps) => {
  // Nhóm các câu hỏi theo audioUrl
  const groupedQuestions = Object.values(
    part.questions.reduce((acc: Record<string, IQuestion[]>, q) => {
      const key = q.audioUrl || "no-audio";
      if (!acc[key]) acc[key] = [];
      acc[key].push(q);
      return acc;
    }, {})
  );

  return (
    <div>
      <h2>{part.name}</h2>
      <p>{part.description}</p>

      {groupedQuestions.map((group, idx) => (
        <div key={idx} style={{ marginBottom: 25 }}>
          {/* Audio chung cho nhóm */}
          {group[0].audioUrl && (
            <audio controls style={{ width: "100%", marginBottom: 15 }}>
              <source src={group[0].audioUrl.trim()} type="audio/mpeg" />
              Trình duyệt của bạn không hỗ trợ thẻ audio.
            </audio>
          )}

          {/* Các câu hỏi trong nhóm */}
          {group.map((q) => (
            <div
              key={q._id}
              ref={(el) => {
                if (questionRefs?.current) {
                  questionRefs.current[q._id] = el;
                }
              }}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              {/* Hình ảnh (nếu có) */}
              {q.imageUrl && (
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <img
                    src={q.imageUrl}
                    alt={`Question ${q.numberQuestion}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 8,
                      objectFit: "contain",
                      border: "1px solid #eee",
                    }}
                  />
                </div>
              )}

              <h4>Câu {q.numberQuestion}</h4>
              {q.questionContent && (
                <p style={{ fontWeight: 500 }}>{q.questionContent}</p>
              )}

              <Radio.Group
                onChange={(e) => onAnswerChange?.(q._id, e.target.value)}
                value={answers[q._id]}
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                {q.options.map((opt, i) => (
                  <Radio key={i} value={String.fromCharCode(65 + i)}>
                    {`${String.fromCharCode(65 + i)}. ${opt}`}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Part4Component;
