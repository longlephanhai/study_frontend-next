'use client'

import { RefObject, useState } from 'react';
import { Card, Radio, Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

interface IProps {
  part: IPart;
  answers?: Record<string, string>;
  onAnswerChange?: (questionId: string, value: string) => void;
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>;
}

const Part7Component = ({ part, answers = {}, onAnswerChange, questionRefs }: IProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(answers);

  const handleSelect = (questionId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: value }));
    onAnswerChange?.(questionId, value);
  };

  // 🧩 Nhóm các câu theo cùng đoạn reading (thường là cùng URL)
  const grouped = part.questions.reduce<Record<string, any[]>>((acc, q) => {
    const key = q.reading?.[0] || 'no_reading';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>{part.name}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {part.description}
      </Paragraph>

      {Object.entries(grouped).map(([readingUrl, questions], idx) => (
        <div key={readingUrl} style={{ marginBottom: 48 }}>
          {/* 🖼️ Đoạn văn hoặc hình ảnh đọc hiểu */}
          {readingUrl !== 'no_reading' && (
            <Card
              style={{
                borderRadius: 12,
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                marginBottom: 24,
                padding: '20px 24px',
              }}
              bodyStyle={{ textAlign: 'center' }}
            >
              <img
                src={readingUrl}
                alt={`Reading passage ${idx + 1}`}
                style={{
                  maxWidth: '100%',
                  borderRadius: 8,
                  objectFit: 'contain',
                }}
              />
            </Card>
          )}

          {/* 📝 Câu hỏi liên quan */}
          {questions.map((q) => (
            <Card
              key={q._id}
              ref={(el) => {
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

              <Paragraph style={{ marginBottom: 12, fontSize: 15 }}>
                {q.questionContent}
              </Paragraph>

              <Radio.Group
                onChange={(e) => handleSelect(q._id, e.target.value)}
                value={selectedOptions[q._id]}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {/* @ts-ignore */}
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

          {idx < Object.entries(grouped).length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
};

export default Part7Component;
