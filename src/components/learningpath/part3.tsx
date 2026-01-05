'use client';

import React, { useState, useMemo } from "react";
import { Card, Typography, List, Radio, Button, message, Collapse, Space, Tag } from "antd";
import { CheckOutlined, CloseOutlined, AudioOutlined, BookOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface IQuestion {
  _id: string;
  type: string;
  audioUrl: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  transcript: string;
  questionContent: string;
  imageUrl?: string;
}

interface ITask {
  _id: string;
  title: string;
  description?: string;
  content: IQuestion[];
  isLocked: boolean;
}

interface IProps {
  taskData: ITask;
}

const Part3Component = ({ taskData }: IProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const groupedQuestions = useMemo(() => {
    const groups: { [key: string]: IQuestion[] } = {};
    taskData.content.forEach((q) => {
      if (!groups[q.audioUrl]) groups[q.audioUrl] = [];
      groups[q.audioUrl].push(q);
    });
    return Object.values(groups);
  }, [taskData.content]);

  const handleSelectAnswer = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    taskData.content.forEach(q => {
      if (selectedAnswers[q._id] === q.correctAnswer) correctCount++;
    });

    message.success(`Bạn trả lời đúng ${correctCount} / ${taskData.content.length} câu.`);
    setShowAnswers(true);

    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-task/${taskData._id}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      router.refresh();
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến độ:", error);
    }
  };

  return (
    // Tăng maxWidth từ 800 lên 1000px để giao diện rộng rãi hơn
    <div style={{ padding: "40px 20px", maxWidth: 1000, margin: "0 auto", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      
      <Card style={{ marginBottom: 32, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Title level={2} style={{ marginBottom: 16 }}>{taskData.title}</Title>
        <Paragraph style={{ fontSize: 16, color: "#595959" }}>{taskData.description}</Paragraph>
      </Card>

      {groupedQuestions.map((group, groupIdx) => (
        <Card 
          key={groupIdx} 
          style={{ marginBottom: 32, borderRadius: 12, border: "1px solid #e8e8e8" }}
          title={
            <Space size="middle" style={{ fontSize: 18 }}>
              <AudioOutlined style={{ color: "#1890ff" }} />
              <span>Đoạn hội thoại {groupIdx + 1}</span>
              <Tag color="blue">{group[0].category}</Tag>
            </Space>
          }
        >
          {/* Audio Player to hơn */}
          <div style={{ marginBottom: 24, background: "#f0f5ff", padding: "24px", borderRadius: 12 }}>
            <audio controls src={group[0].audioUrl} style={{ width: "100%", height: "54px" }} />
          </div>

          {showAnswers && (
            <Collapse ghost style={{ marginBottom: 24 }}>
              <Panel 
                header={<Space><BookOutlined /><Text strong style={{ fontSize: 16 }}>Xem Transcript & Dịch nghĩa</Text></Space>} 
                key="1"
                style={{ background: "#fffbe6", borderRadius: 8, marginBottom: 16 }}
              >
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: "1.8", padding: "10px" }}>
                  {group[0].transcript}
                </div>
              </Panel>
            </Collapse>
          )}

          {group.map((q, qIdx) => {
            const userAnswer = selectedAnswers[q._id];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={q._id} style={{ marginBottom: 40, padding: "0 10px" }}>
                {/* Câu hỏi to hơn */}
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 18, display: "block" }}>
                    {qIdx + 1}. {q.questionContent}
                  </Text>
                </div>

                <Radio.Group
                  onChange={(e) => handleSelectAnswer(q._id, e.target.value)}
                  value={userAnswer}
                  disabled={showAnswers}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {q.options.map((opt, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    let bgColor = "transparent";
                    let borderColor = "#d9d9d9";

                    if (showAnswers) {
                      if (label === q.correctAnswer) {
                        bgColor = "#f6ffed";
                        borderColor = "#52c41a";
                      } else if (userAnswer === label && !isCorrect) {
                        bgColor = "#fff1f0";
                        borderColor = "#ff4d4f";
                      }
                    }

                    return (
                      <Radio 
                        key={idx} 
                        value={label}
                        className="custom-radio-large"
                        style={{ 
                          padding: "12px 20px",
                          borderRadius: "8px",
                          border: `1px solid ${borderColor}`,
                          backgroundColor: bgColor,
                          fontSize: 16, // Chữ của option to hơn
                          transition: "all 0.3s"
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>
                          <span style={{ fontWeight: "bold", marginRight: 8 }}>{label}.</span> {opt}
                        </Text>
                      </Radio>
                    );
                  })}
                </Radio.Group>

                {showAnswers && (
                  <div style={{ marginTop: 20, padding: "20px", background: "#f9f9f9", borderRadius: 8, borderLeft: "4px solid #1890ff" }}>
                    <Text strong style={{ fontSize: 16, color: "#1890ff" }}>Giải thích đáp án:</Text>
                    <div style={{ whiteSpace: 'pre-wrap', marginTop: 10, fontSize: 15, color: "#434343" }}>
                      {q.explanation}
                    </div>
                  </div>
                )}
                {qIdx < group.length - 1 && <div style={{ height: 1, background: "#f0f0f0", margin: "40px 0" }} />}
              </div>
            );
          })}
        </Card>
      ))}

      <div style={{ textAlign: "center", marginTop: 40, paddingBottom: 60 }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleSubmit} 
          disabled={showAnswers}
          style={{ 
            height: "56px", 
            padding: "0 60px", 
            fontSize: "18px", 
            borderRadius: "28px",
            boxShadow: "0 4px 14px rgba(24, 144, 255, 0.4)" 
          }}
        >
          Nộp bài hoàn tất
        </Button>
      </div>
    </div>
  );
};

export default Part3Component;