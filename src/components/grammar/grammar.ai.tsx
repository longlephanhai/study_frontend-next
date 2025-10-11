'use client';

import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  Radio,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Skeleton,
  Progress,
  message
} from "antd";

const { Title, Text } = Typography;

interface Question {
  type: "multiple_choice" | "fill_in_blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface IProps {
  params: { id: string };
}

const GrammarQuestionAIComponent = (props: IProps) => {
  const { params } = props;
  const { data: session } = useSession();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grammars/questions-ai/${params.id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
          next: { tags: [`fetch-grammars-by-ai-${params.id}`] },
        },
      });

      setQuestions(res?.data?.questions ?? []);
    } catch (err) {
      console.error("Error fetching questions:", err);
      message.error("Không thể tải câu hỏi từ AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.access_token && params.id) {
      fetchData();
    }
  }, [session?.access_token, params.id]);

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < questions.length) {
      message.warning("Vui lòng trả lời hết tất cả câu hỏi trước khi nộp!");
      return;
    }
    setShowResults(true);
  };

  const handleRestart = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;

  if (!questions || questions.length === 0)
    return <Text>Không có câu hỏi nào được tạo bởi AI.</Text>;

  // ✅ Tính số câu đúng
  const correctCount = questions.filter(
    (q, i) =>
      userAnswers[i]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
  ).length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        💬 Ôn luyện ngữ pháp với AI
      </Title>

      {/* ✅ Hiển thị kết quả tổng khi nộp bài */}
      {showResults && (
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Text strong style={{ fontSize: 18 }}>
            Kết quả: {correctCount}/{questions.length} câu đúng
          </Text>
          <Progress
            percent={Math.round((correctCount / questions.length) * 100)}
            status={correctCount === questions.length ? "success" : "active"}
            style={{ width: 300, marginTop: 10 }}
          />
        </div>
      )}

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <Card
              key={index}
              title={`Câu ${index + 1}`}
              style={{
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: showResults
                  ? isCorrect
                    ? "2px solid #52c41a"
                    : "2px solid #ff4d4f"
                  : "none",
              }}
            >
              <Text strong>{q.question}</Text>

              <div style={{ marginTop: 16 }}>
                {q.type === "multiple_choice" && q.options && (
                  <Radio.Group
                    onChange={(e) =>
                      setUserAnswers({
                        ...userAnswers,
                        [index]: e.target.value,
                      })
                    }
                    value={userAnswer}
                    disabled={showResults}
                  >
                    <Space direction="vertical">
                      {q.options.map((opt, i) => (
                        <Radio key={i} value={opt}>
                          {opt}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                )}

                {q.type === "fill_in_blank" && (
                  <Input
                    placeholder="Nhập câu trả lời của bạn"
                    value={userAnswer || ""}
                    onChange={(e) =>
                      setUserAnswers({
                        ...userAnswers,
                        [index]: e.target.value,
                      })
                    }
                    disabled={showResults}
                    style={{ width: "60%", marginTop: 8 }}
                  />
                )}
              </div>

              {/* Hiển thị kết quả khi người dùng nhấn Nộp bài */}
              {showResults && (
                <div style={{ marginTop: 16 }}>
                  {isCorrect ? (
                    <Alert message="✅ Chính xác!" type="success" showIcon />
                  ) : (
                    <Alert
                      message={`❌ Sai rồi. Đáp án đúng là: ${q.correctAnswer}`}
                      type="error"
                      showIcon
                    />
                  )}
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 8 }}
                  >
                    💡 Giải thích: {q.explanation}
                  </Text>
                </div>
              )}
            </Card>
          );
        })}

        {/* Nút hành động */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          {!showResults ? (
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < questions.length}
            >
              Nộp bài
            </Button>
          ) : (
            <Button size="large" onClick={handleRestart}>
              Làm lại
            </Button>
          )}
        </div>
      </Space>
    </div>
  );
};

export default GrammarQuestionAIComponent;
