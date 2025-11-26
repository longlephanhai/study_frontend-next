'use client'

import { useEffect, useMemo, useState } from "react";
import { Card, Divider, Radio, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface IProps {
  part: IPart;
  answerUser: any;
}

const Part6Answer = ({ part, answerUser }: IProps) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    setAnswers(part.questions.map(q => q.correctAnswer));
    setUserAnswers(answerUser?.parts[5]?.answers.map((a: any) => a.answer) || []);
  }, [part, answerUser]);

  const getOptionStyle = (letter: string, correctAnswer: string, userAnswer: string) => {
    if (letter === correctAnswer) return { backgroundColor: '#e6fffb', border: '1px solid #87e8de' };
    if (letter === userAnswer && letter !== correctAnswer) return { backgroundColor: '#fff1f0', border: '1px solid #ffa39e' };
    return { backgroundColor: 'transparent', border: '1px solid transparent' };
  };

  const highlightBlanks = (text: string) => {
    return text.replace(/_{3,}|\(\d+\)/g, match => `<b style="color:#1677ff">${match}</b>`);
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
        const transcript = group[0]?.transcript || '';

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
              {transcript && (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Transcript</Title>
                  <Paragraph>{transcript}</Paragraph>
                </div>
              )}
            </Card>

            {/* Render các câu hỏi trong đoạn */}
            {group.map((q, idx) => {
              const correctAnswer = answers[part.questions.indexOf(q)];
              const userAnswer = userAnswers[part.questions.indexOf(q)];

              return (
                <Card
                  key={q._id}
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

                  <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {q.options.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i);
                      return (
                        <div
                          key={i}
                          style={{ padding: 8, borderRadius: 6, ...getOptionStyle(letter, correctAnswer, userAnswer) }}
                        >
                          <Radio value={letter} disabled>
                            <Text strong style={{ marginRight: 6 }}>{letter}.</Text>
                            {opt}
                          </Radio>
                        </div>
                      );
                    })}
                  </Radio.Group>

                  {/* Your Answer */}
                  {userAnswer && (
                    <div style={{ marginTop: 8 }}>
                      <strong>Your answer:</strong>{' '}
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          backgroundColor: userAnswer === correctAnswer ? '#e6fffb' : '#fff1f0',
                          color: userAnswer === correctAnswer ? '#08979c' : '#cf1322',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        {userAnswer}
                        {userAnswer === correctAnswer ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      </span>
                    </div>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div style={{ marginTop: 12 }}>
                      <Title level={5}>Giải thích</Title>
                      <Paragraph>{q.explanation}</Paragraph>
                    </div>
                  )}

                </Card>
              );
            })}

            <Divider />
          </div>
        );
      })}
    </div>
  );
};

export default Part6Answer;
