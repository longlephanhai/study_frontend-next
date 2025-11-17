'use client';

import React, { useState } from "react";
import { Card, Typography, Collapse, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;


interface IProps {
  taskData: ITask;
}

const GrammarComponent = ({ taskData }: IProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const toggleCollapse = (key: string) => {
    setActiveKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
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
            header={grammar.title}
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
        >
          {activeKeys.length === taskData.content.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
        </Button>
      </div>
    </div>
  );
};

export default GrammarComponent;
