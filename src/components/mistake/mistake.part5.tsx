'use client';
import React, { useEffect, useState } from 'react';
import { Card, Typography, Select, Button, List, Radio, Space, Divider } from 'antd';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
}


const Part5Mistake = () => {
  const { data: session } = useSession();
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [started, setStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [questionsData, setQuestionsData] = useState<Question[]>([]);

  const selectedQuestions = questionsData.slice(0, numQuestions);

  const fetchQuestions = async () => {
    const res = await sendRequest<IBackendRes<Question[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/part5-mistakes/generate-part5-mistakes`,
      method: "POST",
      body: {
        numQuestions: numQuestions
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-all-mistakes'] }
      }
    })
    if (res?.data) {
      setQuestionsData(res.data);
    }
  }

  const handleStart = async () => {
    await fetchQuestions();
    setStarted(true);
  }
  const handleAnswer = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Card
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          🧩 Ôn tập Part 5 - Grammar Practice
        </Title>

        {!started ? (
          <>
            <Paragraph style={{ textAlign: 'center' }}>
              Chọn số lượng câu hỏi bạn muốn ôn tập (tối đa 10 câu).
            </Paragraph>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Select
                value={numQuestions}
                onChange={setNumQuestions}
                style={{ width: 160 }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <Option key={n} value={n} >
                    {n} câu hỏi
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleStart}
                style={{ borderRadius: 6 }}
              >
                Bắt đầu ôn tập
              </Button>
            </div>
          </>
        ) : (
          <>
            <List
              dataSource={selectedQuestions}
              renderItem={(q, index) => (
                <Card
                  key={index}
                  style={{ marginBottom: 20, borderRadius: 10 }}
                  title={
                    <Text strong>
                      Câu {index + 1}: {q.question}
                    </Text>
                  }
                >
                  <Radio.Group
                    onChange={(e) => handleAnswer(index, e.target.value)}
                    value={answers[index]}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {q.options.map((opt, i) => (
                        <Radio key={i} value={String.fromCharCode(65 + i)}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>

                  {answers[index] && (
                    <>
                      <Divider />
                      {answers[index] === q.correctAnswer ? (
                        <Text type="success">✅ Chính xác!</Text>
                      ) : (
                        <>
                          <Text type="danger">❌ Sai rồi!</Text>
                          <br />
                          <Text type="secondary">
                            Giải thích: {q.explanation}
                          </Text>
                        </>
                      )}
                    </>
                  )}
                </Card>
              )}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default Part5Mistake;
