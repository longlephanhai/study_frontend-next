'use client'

import { Card, Typography, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Title, Paragraph } = Typography;

interface IProps {
  part: IPart;
  answerUser: any;
}

const Part1Answer = ({ part, answerUser }: IProps) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    const ans = part.questions.map((q) => q.correctAnswer);
    setAnswers(ans);
    const userAns = answerUser?.parts[0]?.answers.map(
      (uAns: { answer: any }) => uAns.answer
    );
    setUserAnswers(userAns);
  }, [part, answerUser]);

  const getOptionStyle = (letter: string, correctAnswer: string, userAnswer: string) => {
    if (letter === correctAnswer) {
      return { backgroundColor: '#e6fffb', border: '1px solid #87e8de' }; 
    }
    if (letter === userAnswer && letter !== correctAnswer) {
      return { backgroundColor: '#fff1f0', border: '1px solid #ffa39e' }; 
    }
    return { backgroundColor: 'transparent', border: '1px solid transparent' }; 
  };


  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
 
      <Title level={3}>{part.name}</Title>
      <Paragraph>{part.description}</Paragraph>

      {part.questions.map((q, index) => {
        const correctAnswer = answers[index];
        const userAnswer = userAnswers[index];

        return (
          <Card
            key={q._id}
            style={{
              borderRadius: 10,
              marginBottom: 24,
              border: '1px solid #e5e5e5',
              padding: 20,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                Câu {q.numberQuestion}
              </Title>

              {q.audioUrl && (
                <audio controls style={{ width: '100%', margin: '10px 0' }}>
                  <source src={q.audioUrl.trim()} type="audio/mpeg" />
                </audio>
              )}

              {q.imageUrl && (
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                  <img
                    src={q.imageUrl}
                    alt={`Question ${q.numberQuestion}`}
                    style={{ maxWidth: '100%', borderRadius: 8 }}
                  />
                </div>
              )}

              <Radio.Group
                value={correctAnswer}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 10,
                }}
              >
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <div key={i} style={{ padding: 8, borderRadius: 6, ...getOptionStyle(letter, correctAnswer, userAnswer) }}>
                      <Radio value={letter} disabled>{`${letter}. ${opt}`}</Radio>
                    </div>
                  )
                })}
              </Radio.Group>

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

              {q.transcript && (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Transcript</Title>
                  <Paragraph>{q.transcript}</Paragraph>
                </div>
              )}

              {q.explanation && (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Giải thích</Title>
                  <Paragraph>{q.explanation}</Paragraph>
                </div>
              )}
            </Space>
          </Card>
        );
      })}
    </div>
  );
};

export default Part1Answer;
