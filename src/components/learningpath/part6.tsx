'use client';

import React, { useState } from "react";
import { Card, Typography, List, Radio, Button, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

interface IPartSix {
  _id: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  transcript?: string;
  questionContent: string;
}

interface ITask {
  _id: string;
  title: string;
  description?: string;
  type: string;
  content: IPartSix[];
  isLocked: boolean;
  relatedStep: number;
}

interface IProps {
  taskData: ITask;
}

const Part6Component = ({ taskData }: IProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

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

    await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-task/${taskData._id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-learning-path'] }
      }
    });
    router.refresh();
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5" }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>{taskData.title}</Title>
        {taskData.description && <Paragraph>{taskData.description}</Paragraph>}
      </Card>

      <List
        dataSource={taskData.content}
        renderItem={(item, index) => {
          const userAnswer = selectedAnswers[item._id];
          const isCorrect = userAnswer === item.correctAnswer;

          return (
            <Card
              key={item._id}
              type="inner"
              title={`Câu ${index + 1} - ${item.category}`}
              style={{ marginBottom: 16 }}
            >
              <Paragraph>{item.questionContent}</Paragraph>
              {item.transcript && (
                <Paragraph type="secondary"><i>Transcript / Context: {item.transcript}</i></Paragraph>
              )}

              <Radio.Group
                onChange={(e) => handleSelectAnswer(item._id, e.target.value)}
                value={selectedAnswers[item._id]}
                style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}
                disabled={showAnswers}
              >
                {item.options.map((opt, idx) => {
                  const label = String.fromCharCode(65 + idx);
                  return (
                    <Radio key={idx} value={label}>
                      {label}
                    </Radio>
                  );
                })}
              </Radio.Group>

              {showAnswers && (
                <div>
                  <Text strong>Đáp án: {item.correctAnswer}</Text>
                  {item.explanation && (
                    <>
                      <br />
                      <Text>{item.explanation}</Text>
                    </>
                  )}
                  {userAnswer && (
                    <>
                      <br />
                      <Text type={isCorrect ? "success" : "danger"}>
                        Bạn chọn: {userAnswer} {isCorrect ? <CheckOutlined /> : <CloseOutlined />}
                      </Text>
                    </>
                  )}
                </div>
              )}
            </Card>
          );
        }}
      />

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" size="large" onClick={handleSubmit} disabled={showAnswers}>
          Nộp bài
        </Button>
      </div>
    </div>
  );
};

export default Part6Component;
