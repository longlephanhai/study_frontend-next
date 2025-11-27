'use client'

import { useEffect, useState } from "react";
import { Card, Radio, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ExplainableBlock from "../aihelper/ExplainBlock";

const { Title, Paragraph } = Typography;

interface IProps {
  part: IPart;
  answerUser: any;
}

const Part5Answer = ({ part, answerUser }: IProps) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    setAnswers(part.questions.map(q => q.correctAnswer));
    setUserAnswers(answerUser?.parts[4]?.answers.map((a: any) => a.answer) || []);
  }, [part, answerUser]);

  const getOptionStyle = (letter: string, correctAnswer: string, userAnswer: string) => {
    if (letter === correctAnswer) return { backgroundColor: '#e6fffb', border: '1px solid #87e8de' };
    if (letter === userAnswer && letter !== correctAnswer) return { backgroundColor: '#fff1f0', border: '1px solid #ffa39e' };
    return { backgroundColor: 'transparent', border: '1px solid transparent' };
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Title level={3}>{part.name}</Title>
      <Paragraph type="secondary">{part.description}</Paragraph>

      {part.questions.map((q) => {
        const correctAnswer = answers[part.questions.indexOf(q)];
        const userAnswer = userAnswers[part.questions.indexOf(q)];

        return (
          <ExplainableBlock>
            <Card
              key={q._id}
              style={{ borderRadius: 8, marginBottom: 20, border: "1px solid #eee", boxShadow: "none", padding: 16 }}
            >
              <Title level={5} style={{ margin: 0 }}>Câu {q.numberQuestion}</Title>
              <Paragraph style={{ fontWeight: 500, marginBottom: 10 }}>{q.questionContent}</Paragraph>

              {/* Options */}
              <Radio.Group style={{ display: "flex", flexDirection: "column", gap: 8 }} value={correctAnswer}>
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <div key={i} style={{ padding: 6, borderRadius: 6, ...getOptionStyle(letter, correctAnswer, userAnswer) }}>
                      <Radio value={letter} disabled>{`${letter}. ${opt}`}</Radio>
                    </div>
                  )
                })}
              </Radio.Group>

              {/* Your Answer */}
              {userAnswer && (
                <div style={{ marginBottom: 8 }}>
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
          </ExplainableBlock>
        )
      })}
    </div>
  )
}

export default Part5Answer;
