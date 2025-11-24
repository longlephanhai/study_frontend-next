'use client';
import React, { useState } from "react";
import { Card, Button, List, Image, Typography, Space } from "antd";
import FlashCardVocabulariesModal from "./flashcard.vocabularies.modal";

const { Title, Text } = Typography;

interface IProps {
  vocabularies: IFlashCardVocabulary[];
  params?: { id: string };
}

const DisplayVocabularies = ({ vocabularies, params }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={showModal}>
          Tạo mới từ vựng
        </Button>
      </Space>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={vocabularies}
        renderItem={(item) => (
          <List.Item>
            <Card title={item?.vocabulary} bordered>
              <Space direction="vertical" size={8}>
                <Text><b>Nghĩa:</b> {item?.meaning}</Text>
                {item?.pronunciation && (
                  <Text><b>Phát âm:</b> {item?.pronunciation}</Text>
                )}
                {item?.example && (
                  <Text><b>Ví dụ:</b> {item?.example}</Text>
                )}
                {item?.image && (
                  <Image src={item?.image} alt={item?.vocabulary} width={120} />
                )}
              </Space>
            </Card>
          </List.Item>
        )}
      />

      <FlashCardVocabulariesModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        params={params}
      />
    </div>
  );
};

export default DisplayVocabularies;
