'use client';

import React, { useState } from 'react';
import { Card, Typography, Select, Button, Radio, Space, Divider, message } from 'antd';
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
  category: string;
}

interface IBackendRes<T> {
  data: T;
}

interface Passage {
  questionContent: string;
  questions: IQuestion[];
}

const Part6Mistake = () => {
  const { data: session } = useSession();

  const [numQuestions, setNumQuestions] = useState<number>(2); // passage count
  const [started, setStarted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [passages, setPassages] = useState<Passage[]>([]);

  const fetchQuestions = async () => {
    try {
      const res = await sendRequest<IBackendRes<IQuestion[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/part5-mistakes/generate-part6-mistakes`,
        method: 'POST',
        body: { numQuestions },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res?.data) {
        // group by questionContent
        const map: Record<string, IQuestion[]> = {};
        res.data.forEach(q => {
          if (!map[q.questionContent]) map[q.questionContent] = [];
          map[q.questionContent].push(q);
        });

        const grouped: Passage[] = Object.keys(map).map(k => ({
          questionContent: k,
          questions: map[k],
        }));

        setPassages(grouped);
      }
    } catch (error) {
      message.error('Lấy câu hỏi thất bại. Vui lòng thử lại.');
    }
  };

  const handleStart = async () => {
    await fetchQuestions();
    setStarted(true);
    setSubmitted(false);
    setAnswers({});
  };

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const allAnswered = passages.every(p => p.questions.every(q => answers[q._id]));
    if (!allAnswered) {
      message.warning('Vui lòng trả lời hết các chỗ trống trước khi nộp bài.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Ôn tập Part 6 - Text Completion
        </Title>

        {!started ? (
          <>
            <Paragraph style={{ textAlign: 'center' }}>
              Chọn số lượng passage bạn muốn ôn tập.
            </Paragraph>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Select value={numQuestions} onChange={setNumQuestions} style={{ width: 160 }}>
                {[1,2,3,4,5].map(n => <Option key={n} value={n}>{n} passage</Option>)}
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
              <Card key={pIndex} style={{ marginBottom: 24, borderRadius: 10 }}>
                <Paragraph style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 600 }}>
                  {p.questionContent}
                </Paragraph>

                {p.questions.map((q, qIndex) => (
                  <div key={q._id} style={{ marginTop: 12 }}>
                    <Paragraph type="secondary">
                      Chỗ trống {qIndex + 1} ({q.category})
                    </Paragraph>
                    <Radio.Group
                      onChange={(e) => handleAnswer(q._id, e.target.value)}
                      value={answers[q._id]}
                      disabled={submitted}
                    >
                      <Space direction="vertical">
                        {q.options.map((opt, i) => (
                          <Radio key={i} value={String.fromCharCode(65 + i)}>
                            {String.fromCharCode(65 + i)}. {opt}
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
                            <Paragraph type="secondary" style={{ marginTop: 4 }}>
                              Giải thích: {q.explanation}
                            </Paragraph>
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

export default Part6Mistake;
