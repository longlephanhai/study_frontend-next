'use client'

import { useEffect, useState } from "react";
import { Card, Radio, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface IProps {
  part: IPart;
  answerUser: any;
}

const Part3Answer = ({ part, answerUser }: IProps) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    setAnswers(part.questions.map(q => q.correctAnswer));
    setUserAnswers(answerUser?.parts[2]?.answers.map((a: any) => a.answer) || []);
  }, [part, answerUser]);

  // Hàm style cho option
  const getOptionStyle = (letter: string, correctAnswer: string, userAnswer: string) => {
    if (letter === correctAnswer) return { backgroundColor: '#e6fffb', border: '1px solid #87e8de' };
    if (letter === userAnswer && letter !== correctAnswer) return { backgroundColor: '#fff1f0', border: '1px solid #ffa39e' };
    return { backgroundColor: 'transparent', border: '1px solid transparent' };
  };

  // Nhóm câu theo audio chung
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
      <Paragraph>{part.description}</Paragraph>

      {groupedQuestions.map((group, idx) => (
        <Card key={idx} style={{ borderRadius: 8, marginBottom: 24, border: '1px solid #eee', boxShadow: 'none', padding: 16 }}>

          {/* Audio chung */}
          {group[0].audioUrl && (
            <audio controls style={{ width: '100%', marginBottom: 16 }}>
              <source src={group[0].audioUrl.trim()} type="audio/mpeg" />
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
          )}

          {group[0].transcript && (
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Transcript</Title>
              <Paragraph>{group[0].transcript}</Paragraph>
            </div>
          )}

          {group.map((q, index) => {
            const correctAnswer = answers[part.questions.indexOf(q)];
            const userAnswer = userAnswers[part.questions.indexOf(q)];

            return (
              <div key={q._id} style={{ marginBottom: 20, borderBottom: '1px dashed #ddd', paddingBottom: 16 }}>

                {/* Image */}
                {q.imageUrl && (
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <img
                      src={q.imageUrl}
                      alt={`Question ${q.numberQuestion}`}
                      style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain', border: '1px solid #eee' }}
                    />
                  </div>
                )}

                {/* Câu hỏi */}
                <Title level={5} style={{ marginBottom: 4 }}>Câu {q.numberQuestion}</Title>
                {q.questionContent && <Paragraph strong>{q.questionContent}</Paragraph>}

                {/* Options */}
                <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }} value={correctAnswer}>
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

                {/* Explanation */}
                {q.explanation && (
                  <div style={{ marginTop: 16 }}>
                    <Title level={5}>Giải thích</Title>
                    <Paragraph>{q.explanation}</Paragraph>
                  </div>
                )}

              </div>
            )
          })}
        </Card>
      ))}
    </div>
  )
}

export default Part3Answer;
