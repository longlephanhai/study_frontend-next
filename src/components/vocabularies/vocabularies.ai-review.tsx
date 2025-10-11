'use client';

import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Input, Button, Space, Skeleton, message, Progress } from "antd";
import TextToSpeech from '@/utils/TextToSpeech';

const { Title, Text } = Typography;

interface AIItem {
  word: string;
  fillBlank: {
    question: string;
    answer: string;
  };
}

const AIReview = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<AIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated" || !session?.access_token) return;

      setLoading(true);
      const res = await sendRequest<IBackendRes<AIItem[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topics-vocabularies/ai-review/${params.id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${session.access_token}` },
        nextOption: { next: { tags: [`fetch-question-vocabulary-by-ai-${params.id}`] } }
      });
      setData(res?.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, [params.id, session?.access_token, status]);

  const handleChange = (word: string, value: string) => {
    if (submitted) return; // sau khi nộp rồi thì không được sửa
    setAnswers(prev => ({ ...prev, [word]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < data.length) {
      message.warning("Vui lòng điền hết tất cả câu hỏi trước khi nộp!");
      return;
    }
    setSubmitted(true);
    message.success("Bài làm đã được nộp!");
  };

  if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;
  if (!data.length) return <Text>Không có câu hỏi nào trong chủ đề này.</Text>;

  // Tính số câu đúng
  const correctCount = data.filter(
    item => answers[item.word]?.trim().toLowerCase() === item.fillBlank.answer.trim().toLowerCase()
  ).length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>AI Review - Fill in the Blank</Title>

      {submitted && (
        <div style={{ marginBottom: 24 }}>
          <Text strong>
            Kết quả: {correctCount}/{data.length} câu đúng
          </Text>
          <Progress
            percent={Math.round((correctCount / data.length) * 100)}
            status={correctCount === data.length ? "success" : "active"}
          />
        </div>
      )}

      <Row gutter={[16, 16]}>
        {data.map((item, idx) => {
          const userAns = answers[item.word]?.trim().toLowerCase() || "";
          const correctAns = item.fillBlank.answer.trim().toLowerCase();
          const isCorrect = userAns === correctAns;

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={idx}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  minHeight: 240,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: submitted
                    ? isCorrect
                      ? '2px solid #52c41a'
                      : '2px solid #ff4d4f'
                    : 'none',
                  transition: 'all 0.2s ease',
                }}
                bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <Text>{item.fillBlank.question}</Text>
                <Input
                  placeholder="Type your answer"
                  value={answers[item.word] || ""}
                  onChange={e => handleChange(item.word, e.target.value)}
                  disabled={submitted}
                />

                <Space wrap>
                  <TextToSpeech text={item.word} />
                </Space>

                {submitted && (
                  <Text
                    type={isCorrect ? "success" : "danger"}
                    style={{ marginTop: 8, fontWeight: 500 }}
                  >
                    {isCorrect ? "✅ Correct" : `❌ Sai - Đáp án: ${item.fillBlank.answer}`}
                  </Text>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {!submitted && (
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={data.length === 0}
          >
            Nộp bài
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIReview;
