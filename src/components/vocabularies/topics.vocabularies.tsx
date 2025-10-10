"use client";
import React from "react";
import { Card, Row, Col, Typography, Tag, Space, Tooltip, Empty, Button } from "antd";
import { BulbOutlined, RobotOutlined } from "@ant-design/icons";
import TextToSpeech from "../../utils/TextToSpeech";
import { useParams, useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

interface IProps {
  vocabularies: IVocabulary[];
}

const levelColorMap: Record<string, string> = {
  Beginner: "green",
  Intermediate: "blue",
  Advanced: "volcano",
};

const TopicsVocabularies = ({ vocabularies }: IProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      {vocabularies.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: "#8c8c8c", fontSize: 15 }}>
              Không có từ vựng trong chủ đề này.
            </span>
          }
        />
      ) : (
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Space
            align="center"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 24,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              📘 Danh sách từ vựng
            </Title>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={() => router.push(`/vocabularies/${params.id}/ai-review`)}
            >
              Ôn tập với AI
            </Button>
          </Space>

          <Row gutter={[16, 16]}>
            {vocabularies.map((vocab) => (
              <Col xs={24} sm={12} md={8} lg={6} key={vocab._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={vocab.vocab}
                      src={vocab.img}
                      style={{
                        height: 160,
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                  }
                  style={{ borderRadius: 12, height: "100%" }}
                >
                  <Space direction="vertical" size={6} style={{ width: "100%" }}>
                    <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
                      {vocab.vocab}
                    </Title>

                    <Space>
                      <Text italic type="secondary">
                        <TextToSpeech text={vocab?.vocab} />
                      </Text>
                      <Text italic type="secondary">{vocab.pronounce}</Text>
                    </Space>

                    <Text strong>{vocab.meaning}</Text>

                    <Paragraph
                      type="secondary"
                      style={{
                        fontSize: 13,
                        marginBottom: 0,
                      }}
                    >
                      <BulbOutlined /> {vocab.example}
                    </Paragraph>

                    <Tag color={levelColorMap[vocab.level] || "default"}>
                      {vocab.level}
                    </Tag>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default TopicsVocabularies;
