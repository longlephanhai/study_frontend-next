'use client';

import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Popconfirm, message, Divider } from "antd";
import { BookOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import FlashCardModal from "./flashcard.modal";

const { Title, Paragraph, Text } = Typography;

interface IProps {
  flashcards: IFlashCard[];

}

const FlashcardComponent = ({ flashcards }: IProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleClick = (id: string) => {
    router.push(`/flashcard/${id}`);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {

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
              style={{
                borderRadius: 12,
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {/* Delete button */}
              <Popconfirm
                title="Bạn có chắc muốn xóa flashcard này?"
                onConfirm={() => handleDelete(card._id)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ position: "absolute", top: 8, right: 8 }}
                />
              </Popconfirm>

              <div
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              >
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
              <Divider />
              <Button type="primary" onClick={() => handleClick(card._id)} style={{
                marginTop: '8px',
                width: '100%',
              }}>
                Bắt đầu học
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <FlashCardModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default FlashcardComponent;
