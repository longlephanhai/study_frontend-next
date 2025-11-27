'use client';

import React, { useState } from 'react';
import { Card, Typography, Select, Button, List, Radio, Space, Divider, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;



const Part4Mistake = () => {
  const { data: session } = useSession();

  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [started, setStarted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionsData, setQuestionsData] = useState<IQuestion[]>([]);

  const selectedQuestions = questionsData.slice(0, numQuestions);

  const fetchQuestions = async () => {
    try {
      const res = await sendRequest<IBackendRes<IQuestion[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/part5-mistakes/generate-part4-mistakes`,
        method: 'POST',
        body: { numQuestions },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res?.data) setQuestionsData(res.data);
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

  const handleAnswer = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    const allAnswered = selectedQuestions.every((_, idx) => answers[idx]);
    if (!allAnswered) {
      message.warning('Vui lòng trả lời hết các câu hỏi trước khi nộp bài.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Ôn tập Part 4 - Talks
        </Title>

        {!started ? (
          <>
            <Paragraph style={{ textAlign: 'center' }}>
              Chọn số lượng câu hỏi bạn muốn ôn tập (tối đa 10 câu).
            </Paragraph>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Select value={numQuestions} onChange={setNumQuestions} style={{ width: 160 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <Option key={n} value={n}>{n} câu hỏi</Option>
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
            <List
              dataSource={selectedQuestions}
              renderItem={(q, index) => (
                <Card key={index} style={{ marginBottom: 20, borderRadius: 10 }}>
                  {q.audioUrl && (
                    <div style={{ marginBottom: 12 }}>
                      <audio controls src={q.audioUrl} style={{ width: '100%' }} />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 600 }}>
                      Câu {index + 1}: {q.questionContent}
                    </Text>
                  </div>

                  <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                    Chủ đề: {q.category}
                  </Paragraph>

                  <Radio.Group
                    onChange={(e) => handleAnswer(index, e.target.value)}
                    value={answers[index]}
                    disabled={submitted}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {q.options.map((opt, i) => (
                        <Radio key={i} value={String.fromCharCode(65 + i)}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>

                  {submitted && (
                    <>
                      <Divider />
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {answers[index] === q.correctAnswer ? (
                          <Text type="success">
                            <CheckCircleOutlined style={{ marginRight: 8 }} />
                            Chính xác!
                          </Text>
                        ) : (
                          <Text type="danger">
                            <CloseCircleOutlined style={{ marginRight: 8 }} />
                            Sai rồi! Đáp án đúng: {q.correctAnswer}
                          </Text>
                        )}

                        {/* Explanation */}
                        <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 4 }}>
                          Giải thích: {q.explanation}
                        </Paragraph>

                        {/* Transcript */}
                        <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 4 }}>
                          Transcript: {q.transcript}
                        </Paragraph>
                      </Space>
                    </>
                  )}
                </Card>
              )}
            />


            {!submitted ? (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button type="primary" size="large" onClick={handleSubmit}>
                  Nộp bài
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button type="default" size="large" onClick={handleStart}>
                  Làm lại bộ câu khác
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Part4Mistake;
