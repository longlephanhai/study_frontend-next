"use client";
import React, { useState } from "react";
import {
  Table,
  Tag,
  Card,
  Typography,
  Button,
  Space,
  message,
  Modal,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import dayjs from "dayjs";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import {
  BulbOutlined,
  SoundOutlined,
  ReadOutlined,
  EditOutlined,
  AimOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface IProps {
  examResultHistories: IExamResult[];
}

interface IAdvice {
  aspect: string;
  analysis: string;
  advice: string;
  example: string;
}

interface IPredictionRes {
  predictedScores: number;
  advice: IAdvice[];
}

const ExamResultsHistory = ({ examResultHistories }: IProps) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionData, setPredictionData] = useState<IPredictionRes | null>(
    null
  );

  const handlePredict = async () => {
    message.loading("🔮 Đang dự đoán điểm thi thật...");
    const res = await sendRequest<IBackendRes<IPredictionRes>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-result/user/predict`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res && res.data) {
      message.success("✅ Dự đoán thành công!");
      setPredictionData(res.data);
      setIsModalOpen(true);
    } else {
      message.error("Không thể dự đoán. Vui lòng thử lại sau!");
    }
  };

  const getIconForAspect = (aspect: string) => {
    if (aspect.toLowerCase().includes("listening")) return <SoundOutlined />;
    if (aspect.toLowerCase().includes("reading")) return <ReadOutlined />;
    if (aspect.toLowerCase().includes("ngữ pháp")) return <EditOutlined />;
    if (aspect.toLowerCase().includes("tổng quan")) return <AimOutlined />;
    return <BulbOutlined />;
  };

  const columns: ColumnsType<IExamResult> = [
    {
      title: "Mã bài test",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Link href={`/test/${id}`}>{id}</Link>,
    },
    {
      title: "Tổng điểm",
      dataIndex: "totalScore",
      key: "totalScore",
      render: (score) => (
        <Tag color={score >= 800 ? "green" : score >= 600 ? "blue" : "volcano"}>
          {score}
        </Tag>
      ),
    },
    {
      title: "Listening",
      dataIndex: "listeningScore",
      key: "listeningScore",
    },
    {
      title: "Reading",
      dataIndex: "readingScore",
      key: "readingScore",
    },
    {
      title: "Ngày làm bài",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text type="secondary">{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              📘 Lịch sử làm bài TOEIC
            </Title>
            <Button type="primary" onClick={handlePredict}>
              🔮 Dự đoán kết quả thi thật
            </Button>
          </Space>
        }
        bordered={false}
        style={{ width: "100%", background: "#fff" }}
      >
        <Table
          columns={columns}
          dataSource={examResultHistories.map((item) => ({
            ...item,
            key: item._id,
          }))}
          pagination={false}
        />
      </Card>

      {/* Modal hiển thị kết quả dự đoán */}
      <Modal
        title="🔮 Kết quả dự đoán điểm TOEIC thật"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {predictionData && (
          <>
            <Card
              style={{
                marginBottom: 16,
                background: "#f6ffed",
                borderColor: "#b7eb8f",
              }}
            >
              <Title level={3} style={{ color: "#52c41a", margin: 0 }}>
                Điểm dự đoán: {predictionData.predictedScores.toFixed(1)} 🎯
              </Title>
              <Text type="secondary">
                (Dựa trên lịch sử các bài thi gần nhất)
              </Text>
            </Card>

            <Divider />

            <Title level={4}>💡 Lời khuyên cải thiện</Title>
            {predictionData.advice.map((item, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: 12,
                  background: "#fafafa",
                  borderLeft: "5px solid #1890ff",
                }}
              >
                <Space align="start">
                  <div style={{ fontSize: 20 }}>{getIconForAspect(item.aspect)}</div>
                  <div>
                    <Title level={5} style={{ marginBottom: 4 }}>
                      {item.aspect}
                    </Title>
                    <Paragraph>
                      <b>Phân tích:</b> {item.analysis}
                    </Paragraph>
                    <Paragraph>
                      <b>Lời khuyên:</b> {item.advice}
                    </Paragraph>
                    <Paragraph type="danger">
                      <b>Ví dụ:</b> {item.example}
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            ))}
          </>
        )}
      </Modal>
    </>
  );
};

export default ExamResultsHistory;
