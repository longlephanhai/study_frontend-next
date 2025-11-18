'use client';

import React from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { BookOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

interface IProps {
  flashcards: IFlashCard[];
}

const FlashcardComponent = ({ flashcards }: IProps) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/flashcard/${id}`);
  };

  const handleCreate = () => {
    // router.push("/flashcard/create");
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh sách Flashcard của bạn
        </Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo Flashcard mới
        </Button>
      </div>

      <Paragraph>Chọn một bộ flashcard để bắt đầu học.</Paragraph>

      <Row gutter={[16, 16]}>
        {flashcards.map((card) => (
          <Col xs={24} sm={12} md={8} key={card._id}>
            <Card
              hoverable
              onClick={() => handleClick(card._id)}
              style={{
                borderRadius: 12,
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <BookOutlined style={{ fontSize: 28, color: "#1677ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  {card.title}
                </Title>
              </div>

              {card.description && (
                <Paragraph style={{ marginTop: 8, color: "#555" }}>
                  {card.description}
                </Paragraph>
              )}

              <Text type="secondary">
                {card.vocabulariesFlashCardId.length} từ vựng
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FlashcardComponent;
