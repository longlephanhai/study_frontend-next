"use client";
import React, { useState, useMemo } from "react";
import { Card, Input, Row, Col, Pagination, Typography, Space, Tag, Button } from "antd";
import { BookOutlined, SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Meta } = Card;


interface IProps {
  topics: ITopicVocabulary[];
}

const TopicsList = (props: IProps) => {
  const { topics } = props;
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;


  const filteredTopics = useMemo(() => {
    return topics.filter((item) =>
      item.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, topics]);


  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTopics.slice(start, start + pageSize);
  }, [filteredTopics, currentPage]);

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={3} style={{ margin: 0 }}>
          📚 Danh sách chủ đề từ vựng
        </Title>

        <Input
          placeholder="Tìm kiếm chủ đề..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ maxWidth: 400 }}
        />


        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {paginatedTopics.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <Card
                hoverable
                style={{ height: "100%", borderRadius: 10 }}
                cover={
                  <div
                    style={{
                      background: "#f5f5f5",
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      color: "#1677ff",
                    }}
                  >
                    <BookOutlined />
                  </div>
                }
                actions={[
                  <Button
                    type="link"
                    icon={<InfoCircleOutlined />}
                    key="detail"
                    onClick={() => router.push(`/vocabularies/${item._id}`)}
                  >
                    Xem chi tiết
                  </Button>,
                ]}
              >
                <Meta
                  title={item.topic}
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">{item.description}</Text>
                      <Space wrap>
                        <Tag color="blue">{item?.vocabularies?.length} từ</Tag>
                        <Tag color="green">
                          {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
                        </Tag>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Phân trang */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredTopics.length}
          onChange={setCurrentPage}
          showSizeChanger={false}
          style={{ textAlign: "center", marginTop: 16 }}
        />
      </Space>
    </div>
  );
};

export default TopicsList;
