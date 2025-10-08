'use client';

import { RefObject, useMemo, useState } from 'react';
import { Card, Radio, Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

interface IProps {
  part: IPart;
  answers?: Record<string, string>;
  onAnswerChange?: (questionId: string, value: string) => void;
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>;
  durationSec?: number;
}

const highlightBlanks = (text: string) => {
  return text.replace(/_{3,}|\(\d+\)/g, match => `<b style="color:#1677ff">${match}</b>`);
};

const Part6Component = ({ part, answers = {}, onAnswerChange, questionRefs, durationSec }: IProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(answers);

  const handleSelect = (questionId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: value }));
    onAnswerChange?.(questionId, value);
  };

  const groupedQuestions = useMemo(() => {
    const groups = [];
    for (let i = 0; i < part.questions.length; i += 4) {
      const group = part.questions.slice(i, i + 4);
      groups.push(group);
    }
    return groups;
  }, [part.questions]);

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>{part.name}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {part.description}
      </Paragraph>

      {groupedQuestions.map((group, groupIdx) => {
        const sharedContent = group[0]?.questionContent || '';
        return (
          <div key={groupIdx} style={{ marginBottom: 48 }}>
            {/* Đoạn văn chung */}
            <Card
              style={{
                borderRadius: 12,
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                marginBottom: 24,
                padding: '20px 24px',
              }}
            >
              {sharedContent ? (
                <div
                  style={{
                    whiteSpace: 'pre-line',
                    textAlign: 'justify',
                    fontSize: 16,
                    lineHeight: 1.8,
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightBlanks(sharedContent) }}
                />
              ) : (
                <Paragraph type="secondary" italic>
                  (Không có đoạn văn)
                </Paragraph>
              )}
            </Card>


            {/* Render 4 câu hỏi trong đoạn */}
            {group.map((q, idx) => (
              <Card
                key={q._id}
                ref={el => {
                  if (questionRefs?.current) questionRefs.current[q._id] = el;
                }}
                style={{
                  borderRadius: 10,
                  marginBottom: 20,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <Title level={5} style={{ marginBottom: 12 }}>
                  Câu {q.numberQuestion}
                </Title>

                <Radio.Group
                  onChange={e => handleSelect(q._id, e.target.value)}
                  value={selectedOptions[q._id]}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {q.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <Radio
                        key={i}
                        value={label}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: 6,
                          padding: '8px 12px',
                          transition: 'all 0.2s',
                        }}
                        className="hover:bg-blue-50"
                      >
                        <Text strong style={{ marginRight: 6 }}>{label}.</Text>
                        {opt}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Card>
            ))}
            <Divider />
          </div>
        );
      })}
    </div>
  );
};

export default Part6Component;
