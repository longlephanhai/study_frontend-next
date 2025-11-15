"use client";

import React from "react";
import { Card, List, Progress, Typography, Button, Row, Col, Space, Tag, Divider, message } from "antd";
import { SoundOutlined, ReadOutlined, FileTextOutlined, BookOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function StudyMain() {
  const [completed, setCompleted] = React.useState(false);

  const tasks = [
    { id: 1, title: "Ngữ pháp - Thì hiện tại đơn", type: "Grammar", icon: <BookOutlined />, desc: "Làm 10 câu trắc nghiệm kiểm tra thì hiện tại đơn" },
    { id: 2, title: "Từ vựng - Workplace", type: "Vocabulary", icon: <ReadOutlined />, desc: "Học 10 từ vựng chủ đề văn phòng" },
    { id: 3, title: "Listening - Part 2", type: "Listening", icon: <SoundOutlined />, desc: "Nghe và chọn đáp án đúng cho 10 câu hỏi" },
    { id: 4, title: "Reading - Part 5", type: "Reading", icon: <FileTextOutlined />, desc: "Hoàn thành 10 câu trắc nghiệm phần đọc hiểu" },
  ];

  const onComplete = () => {
    setCompleted(true);
    message.success("Chúc mừng! Bạn đã hoàn thành ngày học hôm nay 🎉");
  };

  return (
    <div style={{ padding: "24px", background: "#fff", minHeight: "calc(100vh - 200px)" }}>
      {/* Tiến độ tổng */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4}>Lộ trình TOEIC - Tuần 1 Ngày 1</Title>
            <Paragraph type="secondary">Mục tiêu: Listening + Vocabulary</Paragraph>
          </Col>
          <Col>
            <Progress
              type="circle"
              percent={completed ? 100 : 60}
              width={80}
              strokeColor="#1677ff"
            />
          </Col>
        </Row>
      </Card>

      {/* Lời khuyên Mentor */}
      <Card
        style={{
          borderLeft: "5px solid #1677ff",
          marginBottom: 24,
          background: "#f8faff",
        }}
      >
        <Title level={5}>Lời khuyên từ Mentor</Title>
        <Paragraph>
          Hôm nay hãy bắt đầu bằng <strong>Listening Part 2</strong> trước để khởi động kỹ năng nghe.
          Sau đó, bạn nên ôn lại <strong>từ vựng</strong> đã học hôm qua để tăng khả năng nhớ lâu hơn.
        </Paragraph>
      </Card>

      {/* Danh sách bài học hôm nay */}
      <Card title="Nhiệm vụ hôm nay" bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button type="primary" size="small">
                  Học ngay
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: 20 }}>{task.icon}</span>}
                title={
                  <Space>
                    {task.title}
                    <Tag color="blue">{task.type}</Tag>
                  </Space>
                }
                description={task.desc}
              />
            </List.Item>
          )}
        />
      </Card>

      <Divider />

      {/* Nút hoàn thành ngày */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Button
          type="primary"
          size="large"
          onClick={onComplete}
          disabled={completed}
        >
          {completed ? "Đã hoàn thành ngày học 🎉" : "Hoàn thành ngày học"}
        </Button>
      </div>
    </div>
  );
}
