'use client';

import React, { useState } from "react";
import { Card, Typography, List, Button, Radio, Image, message, Collapse } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface IContentItem {
  _id: string;
  type: string;
  imageUrl?: string;
  audioUrl?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  transcript?: string;
  category?: string;
}

interface ITask {
  _id: string;
  title: string;
  description: string;
  type: string;
  content: IContentItem[];
  isLocked: boolean;
  relatedStep: number;
}

interface IProps {
  taskData: ITask;
}

const Part1Component = ({ taskData }: IProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSelectAnswer = (contentId: string, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [contentId]: value }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    taskData.content.forEach(c => {
      if (selectedAnswers[c._id] === c.correctAnswer) correctCount++;
    });
    message.success(`Bạn trả lời đúng ${correctCount} / ${taskData.content.length} câu.`);
    setShowAnswers(true);
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5" }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>{taskData.title}</Title>
        <Paragraph>{taskData.description}</Paragraph>
      </Card>

      <List
        dataSource={taskData.content}
        renderItem={(item, index) => {
          const userAnswer = selectedAnswers[item._id];
          const isCorrect = userAnswer === item.correctAnswer;

          return (
            <Card
              key={item._id}
              style={{ marginBottom: 16 }}
              type="inner"
              title={`Câu ${index + 1} - ${item.category || "Part1"}`}
            >
              {/* Audio */}
              {item.audioUrl && (
                <div style={{ marginBottom: 12 }}>
                  <audio controls src={item.audioUrl} style={{ width: "100%" }} />
                </div>
              )}

              {/* Image */}
              {item.imageUrl && (
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <Image src={item.imageUrl} alt={`Image ${index + 1}`} style={{ maxHeight: 200 }} />
                </div>
              )}

              {/* Options */}
              {item.options && (
                <Radio.Group
                  onChange={(e) => handleSelectAnswer(item._id, e.target.value)}
                  value={selectedAnswers[item._id]}
                  style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}
                  disabled={showAnswers}
                >
                  {item.options.map((opt, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    return (
                      <Radio key={idx} value={String.fromCharCode(65 + idx)} >
                        {String.fromCharCode(65 + idx)}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              )}

              {/* Hiển thị transcript, đáp án và giải thích */}
              {showAnswers && (
                <Collapse>
                  {item.transcript && (
                    <Panel header="Transcript" key="transcript">
                      <Text>{item.transcript}</Text>
                    </Panel>
                  )}
                  <Panel header="Kết quả & Giải thích" key="answer">
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
                  </Panel>
                </Collapse>
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

export default Part1Component;
