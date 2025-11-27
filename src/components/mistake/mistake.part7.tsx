'use client';

import React, { useState } from 'react';
import { Card, Typography, Select, Button, Radio, Space, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface IQuestion {
  _id: string;
  questionContent: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  reading: string[];
  category: string;
}

interface Passage {
  reading: string[];
  questions: IQuestion[];
}

const Part7Mistake = () => {
  const { data: session } = useSession();

  const [numPassages, setNumPassages] = useState<number>(2);
  const [started, setStarted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [passages, setPassages] = useState<Passage[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const fetchQuestions = async () => {
    try {
      const res = await sendRequest<IBackendRes<IQuestion[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/part5-mistakes/generate-part7-mistakes`,
        method: 'POST',
        body: { numQuestions: numPassages },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res?.data) {
        const map: Record<string, IQuestion[]> = {};
        res.data.forEach(q => {
          const key = q.reading.join('|');
          if (!map[key]) map[key] = [];
          map[key].push(q);
        });

        const grouped: Passage[] = Object.values(map).map(qs => ({
          reading: qs[0].reading,
          questions: qs,
        }));

        setPassages(grouped);
        setAnswers({});
        setSubmitted(false);
      }
    } catch (error) {
      console.error(error);
      message.error('Lấy câu hỏi thất bại. Vui lòng thử lại.');
    }
  };

  const handleStart = async () => {
    await fetchQuestions();
    setStarted(true);
    setSubmitted(false);
  };

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const allAnswered = passages.every(p => p.questions.every(q => answers[q._id]));
    if (!allAnswered) {
      message.warning('Vui lòng trả lời hết các câu hỏi trước khi nộp bài.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Ôn tập Part 7 - Reading Comprehension
        </Title>

        {!started ? (
          <>
            <Paragraph style={{ textAlign: 'center' }}>
              Chọn số lượng passage bạn muốn ôn tập.
            </Paragraph>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Select value={numPassages} onChange={setNumPassages} style={{ width: 160 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Option key={n} value={n}>{n} passage</Option>
                ))}
              </Select>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" size="large" onClick={handleStart} style={{ borderRadius: 6 }}>
                Bắt đầu ôn tập
              </Button>
            </div>
          </>
        ) : (
          <>
            {passages.map((p, pIndex) => (
              <Card key={pIndex} style={{ marginBottom: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  {p.reading.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`passage-${pIndex}-img-${i}`}
                      style={{
                        width: '100%',       
                        maxHeight: 350,     
                        objectFit: 'contain', 
                        borderRadius: 8,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </div>

                {p.questions.map((q, qIndex) => (
                  <div key={q._id} style={{ marginBottom: 20 }}>
                    <Text strong style={{ fontSize: 16 }}>{q.questionContent}</Text>
                    <Radio.Group
                      onChange={e => handleAnswer(q._id, e.target.value)}
                      value={answers[q._id]}
                      disabled={submitted}
                      style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
                    >
                      <Space direction="vertical">
                        {q.options.map((opt, i) => (
                          <Radio key={i} value={['A', 'B', 'C', 'D'][i]} style={{ fontSize: 15 }}>
                            {['A', 'B', 'C', 'D'][i]}. {opt}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>

                    {submitted && (
                      <div style={{ marginTop: 8 }}>
                        {answers[q._id] === q.correctAnswer ? (
                          <Text type="success">
                            <CheckCircleOutlined /> Chính xác!
                          </Text>
                        ) : (
                          <>
                            <Text type="danger">
                              <CloseCircleOutlined /> Sai! Đáp án đúng: {q.correctAnswer}
                            </Text>
                            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                              Giải thích: {q.explanation}
                            </Text>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            ))}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {!submitted ? (
                <Button type="primary" size="large" onClick={handleSubmit}>
                  Nộp bài
                </Button>
              ) : (
                <Button type="default" size="large" onClick={handleStart}>
                  Làm lại bộ passage khác
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Part7Mistake;
