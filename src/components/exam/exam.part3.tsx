'use client'

import { RefObject, useState } from 'react';
import { Card, Radio, Space, Typography } from 'antd';

const { Title } = Typography;

interface IProps {
  part: IPart;
  answers?: Record<string, string>;
  onAnswerChange?: (questionId: string, value: string) => void;
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>;
}

const Part3Component = ({ part, answers = {}, onAnswerChange, questionRefs }: IProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(answers);

  const handleSelect = (questionId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: value }));
    onAnswerChange?.(questionId, value);
  };

  // Gom nhóm câu hỏi theo audioUrl
  const groupedQuestions = Object.values(
    part.questions.reduce((acc: Record<string, IQuestion[]>, q) => {
      const key = q.audioUrl || 'no-audio';
      if (!acc[key]) acc[key] = [];
      acc[key].push(q);
      return acc;
    }, {})
  );

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>{part.name}</Title>
      <p style={{ fontSize: 16, color: '#555' }}>{part.description}</p>

      {groupedQuestions.map((group, idx) => (
        <Card
          key={idx}
          style={{
            borderRadius: 8,
            marginBottom: 24,
            border: '1px solid #eee',
            boxShadow: 'none',
            padding: 16
          }}
        >
          {/* Audio chung của nhóm */}
          {group[0].audioUrl && (
            <audio controls style={{ width: '100%', marginBottom: 16 }}>
              <source src={group[0].audioUrl.trim()} type="audio/mpeg" />
              Trình duyệt của bạn không hỗ trợ audio.
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
                marginBottom: 20,
                borderBottom: '1px dashed #ddd',
                paddingBottom: 16
              }}
            >
              {/* Hình ảnh (nếu có) */}
              {q.imageUrl && (
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <img
                    src={q.imageUrl}
                    alt={`Question ${q.numberQuestion}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 8,
                      objectFit: 'contain',
                      border: '1px solid #eee'
                    }}
                  />
                </div>
              )}

              {/* Nội dung câu hỏi */}
              <Title level={5} style={{ marginBottom: 4 }}>
                Câu {q.numberQuestion}
              </Title>
              {q.questionContent && (
                <p style={{ fontWeight: 500, color: '#333' }}>{q.questionContent}</p>
              )}

              {/* Danh sách đáp án */}
              <Radio.Group
                onChange={(e) => handleSelect(q._id, e.target.value)}
                value={selectedOptions[q._id]}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}
              >
                {q.options.map((opt, i) => (
                  <Radio key={i} value={String.fromCharCode(65 + i)}>
                    {`${String.fromCharCode(65 + i)}. ${opt}`}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default Part3Component;
