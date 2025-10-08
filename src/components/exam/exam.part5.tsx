'use client'

import { RefObject, useState } from "react";
import { Card, Radio, Typography } from "antd";

const { Title, Paragraph } = Typography;

interface IProps {
  part: IPart;
  answers?: Record<string, string>;
  onAnswerChange?: (questionId: string, value: string) => void;
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>;
  durationSec?: number;
}

const Part5Component = ({ part, answers = {}, onAnswerChange, questionRefs, durationSec }: IProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(answers);

  const handleSelect = (questionId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: value }));
    onAnswerChange?.(questionId, value);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Title level={3}>{part.name}</Title>
      <Paragraph type="secondary">{part.description}</Paragraph>

      {part.questions.map((q) => (
        <Card
          key={q._id}
          ref={(el) => {
            if (questionRefs?.current) questionRefs.current[q._id] = el;
          }}
          style={{
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #eee",
            boxShadow: "none",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Câu {q.numberQuestion}
          </Title>

          <Paragraph style={{ fontWeight: 500, marginBottom: 10 }}>
            {q.questionContent}
          </Paragraph>

          <Radio.Group
            onChange={(e) => handleSelect(q._id, e.target.value)}
            value={selectedOptions[q._id]}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {q.options.map((opt, i) => (
              <Radio key={i} value={String.fromCharCode(65 + i)}>
                {`${String.fromCharCode(65 + i)}. ${opt}`}
              </Radio>
            ))}
          </Radio.Group>
        </Card>
      ))}
    </div>
  );
};

export default Part5Component;
