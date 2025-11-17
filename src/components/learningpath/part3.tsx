'use client';

import React, { useState } from "react";
import { Card, Typography, List, Radio, Button, message, Collapse } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface IQuestion {
  _id: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  questionContent: string;
}

interface IPartThree {
  _id: string;
  imageUrl?: string;
  audioUrl: string;
  category: string;
  transcript: string;
  questions: IQuestion[];
}

interface ITask {
  _id: string;
  title: string;
  description?: string;
  type: string;
  content: IPartThree[];
  isLocked: boolean;
  relatedStep: number;
}

interface IProps {
  taskData: ITask;
}

const Part3Component = ({ taskData }: IProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSelectAnswer = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    taskData.content.forEach(item => {
      item.questions.forEach(q => {
        if (selectedAnswers[q._id] === q.correctAnswer) correctCount++;
      });
    });
    const totalQuestions = taskData.content.reduce((acc, item) => acc + item.questions.length, 0);
    message.success(`Bạn trả lời đúng ${correctCount} / ${totalQuestions} câu.`);
    setShowAnswers(true);
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5" }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>{taskData.title}</Title>
        {taskData.description && <Paragraph>{taskData.description}</Paragraph>}
      </Card>

      <List
        dataSource={taskData.content}
        renderItem={(item, index) => (
          <Card
            key={item._id}
            style={{ marginBottom: 16 }}
            type="inner"
            title={`Đoạn ${index + 1} - ${item.category}`}
          >
            {/* Image */}
            {item.imageUrl && (
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <img src={item.imageUrl} alt={`Image ${index + 1}`} style={{ maxHeight: 200 }} />
              </div>
            )}

            {/* Audio */}
            <div style={{ marginBottom: 12 }}>
              <audio controls src={item.audioUrl} style={{ width: "100%" }} />
            </div>

            {/* Transcript */}
            {showAnswers && (
              <Collapse style={{ marginBottom: 12 }}>
                <Panel header="Transcript" key="transcript">
                  <Text>{item.transcript}</Text>
                </Panel>
              </Collapse>
            )}

            {/* Questions */}
            {item.questions.map((q, qIndex) => {
              const userAnswer = selectedAnswers[q._id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <Card
                  key={q._id}
                  type="inner"
                  title={`Câu hỏi ${qIndex + 1}`}
                  style={{ marginBottom: 12 }}
                >
                  <Paragraph>{q.questionContent}</Paragraph>

                  <Radio.Group
                    onChange={(e) => handleSelectAnswer(q._id, e.target.value)}
                    value={selectedAnswers[q._id]}
                    style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}
                    disabled={showAnswers}
                  >
                    {q.options.map((opt, idx) => {
                      const label = String.fromCharCode(65 + idx);
                      return (
                        <Radio key={idx} value={label}>
                          {label}
                        </Radio>
                      );
                    })}
                  </Radio.Group>

                  {/* Explanation & Correct Answer */}
                  {showAnswers && (
                    <div>
                      <Text strong>Đáp án: {q.correctAnswer}</Text>
                      {q.explanation && (
                        <>
                          <br />
                          <Text>{q.explanation}</Text>
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
            })}
          </Card>
        )}
      />

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" size="large" onClick={handleSubmit} disabled={showAnswers}>
          Nộp bài
        </Button>
      </div>
    </div>
  );
};

export default Part3Component;
