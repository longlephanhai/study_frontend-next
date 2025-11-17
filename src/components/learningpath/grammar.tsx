'use client';

import React, { useState } from "react";
import { Card, Typography, Collapse, Button, message } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface IGrammar {
  _id: string;
  title: string;
  content: string; // HTML
  completed?: boolean; // trạng thái hoàn thành từ DB
}

interface ITask {
  _id: string;
  title: string;
  description?: string;
  content: IGrammar[];
  completed?: boolean; // trạng thái task hoàn thành
}

interface IProps {
  taskData: ITask;
}

const GrammarComponent = ({ taskData }: IProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean>(taskData.completed || false);
  const { data: session } = useSession();
  const router = useRouter();
  const toggleCollapse = (key: string) => {
    setActiveKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleCompleteTask = async () => {
    setCompleted(true);
    message.success("Bạn đã hoàn thành Grammar này!");
    await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-task/${taskData._id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-learning-path'] }
      }
    });
    router.refresh();
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5" }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>{taskData.title}</Title>
        {taskData.description && <Paragraph>{taskData.description}</Paragraph>}
      </Card>

      <Collapse
        activeKey={activeKeys}
        expandIconPosition="end"
        bordered={false}
        style={{ background: "#fff" }}
      >
        {taskData.content.map((grammar) => (
          <Panel
            header={`${grammar.title} ${grammar.completed ? "✓" : ""}`}
            key={grammar._id}
            extra={activeKeys.includes(grammar._id) ? <UpOutlined /> : <DownOutlined />}
          >
            <div
              dangerouslySetInnerHTML={{ __html: grammar.content }}
              style={{ lineHeight: 1.6 }}
            />
          </Panel>
        ))}
      </Collapse>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button
          type="primary"
          onClick={() =>
            setActiveKeys(
              activeKeys.length === taskData.content.length
                ? []
                : taskData.content.map(g => g._id)
            )
          }
          style={{ marginRight: 12 }}
        >
          {activeKeys.length === taskData.content.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
        </Button>

        <Button
          type="primary"
          onClick={handleCompleteTask}
          disabled={completed}
        >
          {completed ? "Đã hoàn thành" : "Hoàn thành Grammar"}
        </Button>
      </div>
    </div>
  );
};

export default GrammarComponent;
