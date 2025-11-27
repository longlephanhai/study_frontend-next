'use client'

import { useEffect, useState } from "react";
import { Card, Divider, Radio, Typography, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ExplainableBlock from "../aihelper/ExplainBlock";

const { Title, Paragraph, Text } = Typography;

interface IProps {
  part: IPart;
  answerUser: any; // đáp án người dùng
}

const Part7Answer = ({ part, answerUser }: IProps) => {
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  useEffect(() => {
    setCorrectAnswers(part.questions.map(q => q.correctAnswer));
    setUserAnswers(answerUser?.parts[6]?.answers || []); // giữ nguyên dạng [{questionId, answer}]
  }, [part, answerUser]);

  const getOptionStyle = (letter: string, correct: string, user: string | null) => {
    if (letter === correct) return { backgroundColor: '#e6fffb', border: '1px solid #87e8de' };
    if (user && letter === user && letter !== correct) return { backgroundColor: '#fff1f0', border: '1px solid #ffa39e' };
    return { backgroundColor: 'transparent', border: '1px solid transparent' };
  };

  // Nhóm các câu theo reading (mảng ảnh)
  const grouped = part.questions.reduce<Record<string, any[]>>((acc, q) => {
    const key = q.reading?.join('-') || 'no_reading';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>{part.name}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>{part.description}</Paragraph>

      {Object.entries(grouped).map(([readingKey, questions], idx) => (
        <ExplainableBlock>
          <div key={readingKey} style={{ marginBottom: 48 }}>

            {/* Reading images */}
            {questions[0].reading?.length > 0 && (
              <Card
                style={{
                  borderRadius: 12,
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  marginBottom: 24,
                  padding: '20px 24px',
                }}
              >
                {questions[0].reading.map((img: string, rIdx: number) => (
                  <div
                    key={rIdx}
                    style={{ textAlign: 'center', marginBottom: rIdx < questions[0].reading.length - 1 ? 16 : 0 }}
                  >
                    <img
                      src={img}
                      alt={`Reading ${idx + 1}-${rIdx + 1}`}
                      style={{ maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </Card>
            )}

            {/* Transcript images */}
            {questions[0].transcript && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Transcript</Title>
                <Card
                  style={{
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    padding: '20px 24px',
                  }}
                >
                  {questions[0].transcript.split("|").map((img: string, tIdx: number) => (
                    <div
                      key={tIdx}
                      style={{
                        textAlign: 'center',
                        marginBottom: tIdx < questions[0].transcript.split("|").length - 1 ? 16 : 0
                      }}
                    >
                      <img
                        src={img}
                        alt={`Transcript ${idx + 1}-${tIdx + 1}`}
                        style={{ maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* Danh sách câu hỏi */}
            {questions.map((q) => {
              const correct = q.correctAnswer;
              const user = userAnswers.find(a => a.questionId === q._id)?.answer || null;

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
                  <Title level={5} style={{ marginBottom: 12 }}>Câu {q.numberQuestion}</Title>

                  {q.questionContent && (
                    <Paragraph style={{ marginBottom: 12, fontSize: 15 }}>{q.questionContent}</Paragraph>
                  )}

                  {/* Options */}
                  <Radio.Group
                    value={user}
                    disabled
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                  >
                    {/* @ts-ignore */}
                    {q.options.map((opt, i) => {
                      const label = String.fromCharCode(65 + i);
                      return (
                        <Radio
                          key={i}
                          value={label}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            ...getOptionStyle(label, correct, user),
                          }}
                        >
                          <Text strong style={{ marginRight: 6 }}>{label}.</Text>
                          {opt}
                        </Radio>
                      );
                    })}
                  </Radio.Group>

                  {/* Your Answer */}
                  <div style={{ marginTop: 8 }}>
                    <strong>Your answer:</strong>{' '}
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        backgroundColor: user === correct ? '#e6fffb' : '#fff1f0',
                        color: user === correct ? '#08979c' : '#cf1322',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {user}
                      {user === correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </span>
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>Giải thích</Title>
                      <Paragraph>{q.explanation}</Paragraph>
                    </div>
                  )}

                </Card>
              );
            })}

            {idx < Object.entries(grouped).length - 1 && <Divider />}
          </div>
        </ExplainableBlock>
      ))}

    </div>
  )
}

export default Part7Answer;
