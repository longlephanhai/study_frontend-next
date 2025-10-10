'use client';

import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Input, Button, Space, Skeleton, message } from "antd";
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
  const [showAnswer, setShowAnswer] = useState<{ [key: string]: boolean }>({});
  const [visibleCount, setVisibleCount] = useState(6);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await sendRequest<IBackendRes<AIItem[]>>(
        {
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topics-vocabularies/ai-review/${params.id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${session?.access_token}` },
          nextOption: { next: { tags: [`fetch-question-vocabulary-by-ai-${params.id}`] } }
        }
      );
      setData(res?.data ?? []);
      setLoading(false);
    }
    fetchData();
  }, [params.id, session]);

  const handleChange = (word: string, value: string) => {
    setAnswers(prev => ({ ...prev, [word]: value }));
  };

  const checkAnswer = (item: AIItem) => {
    const userAns = answers[item.word]?.trim().toLowerCase() || "";
    const correctAns = item.fillBlank.answer.trim().toLowerCase();
    if (userAns === correctAns) message.success("Correct! 🎉");
    else message.error("Wrong! ❌");
  };

  const toggleShowAnswer = (word: string) => {
    setShowAnswer(prev => ({ ...prev, [word]: !prev[word] }));
  };

  if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;

  if (!data.length) return <Text>No vocabulary in this topic.</Text>;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>AI Review - Fill in the Blank</Title>
      <Row gutter={[16, 16]}>
        {data.slice(0, visibleCount).map((item, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={idx}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                minHeight: 240,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s',
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <Text>{item.fillBlank.question}</Text>
              <Input
                placeholder="Type your answer"
                value={answers[item.word] || ""}
                onChange={e => handleChange(item.word, e.target.value)}
              />
              <Space wrap>
                <Button type="primary" onClick={() => checkAnswer(item)}>Check Answer</Button>
                <Button onClick={() => toggleShowAnswer(item.word)}>
                  {showAnswer[item.word] ? "Hide Answer" : "Show Answer"}
                </Button>
                <TextToSpeech text={item.word} />
              </Space>
              {showAnswer[item.word] && (
                <Text type="success" style={{ marginTop: 8 }}>
                  Answer: {item.fillBlank.answer}
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < data.length && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button onClick={() => setVisibleCount(prev => prev + 6)}>Load More</Button>
        </div>
      )}
    </div>
  );
};

export default AIReview;
