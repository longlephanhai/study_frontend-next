"use client";
import React from "react";
import { Card, Button, Typography, Space } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const NoLearningPath = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 480,
          textAlign: "center",
          borderRadius: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.9)",
          padding: "32px 20px",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div
            style={{
              fontSize: 60,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <RocketOutlined style={{ color: "linear-gradient(135deg, #4facfe, #0072ff)" }} />
          </div>

          <Title level={2} style={{ marginBottom: 0, fontWeight: 700 }}>
            Chưa có lộ trình học TOEIC
          </Title>

          <Paragraph style={{ fontSize: 17, color: "#555", lineHeight: 1.6 }}>
            Hãy bắt đầu hành trình chinh phục TOEIC của bạn với lộ trình học
            được cá nhân hóa theo năng lực và mục tiêu của bạn.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => console.log("Đăng ký lộ trình")}
            block
            style={{
              borderRadius: 10,
              height: 50,
              fontSize: 17,
              fontWeight: 600,
              background: "linear-gradient(135deg, #4facfe, #0072ff)",
              boxShadow: "0 6px 16px rgba(0, 114, 255, 0.3)",
            }}
          >
            Bắt đầu ngay
          </Button>
        </Space>
      </Card>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default NoLearningPath;
