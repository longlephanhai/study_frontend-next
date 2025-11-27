'use client';
import React, { useEffect, useState } from "react";
import { Modal, Spin, Card, Typography, Collapse, Tag } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function AIHelper() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: session } = useSession();

  const explain = async (sentence: string) => {
    setOpen(true);
    setLoading(true);

    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai-assistant/explain-sentence`,
      method: "POST",
      body: { sentence },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    setResult(res?.data || null);
    setLoading(false);
  };

  useEffect(() => {
    const handler = (e: any) => explain(e.detail);
    window.addEventListener("explain_sentence", handler);
    return () => window.removeEventListener("explain_sentence", handler);
  }, []);

  return (
    <>
      {/* Floating Icon */}
      <div
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 9999,
          background: "#1677ff",
          padding: 14,
          borderRadius: "50%",
          cursor: "pointer",
          color: "#fff",
        }}
        onClick={() => setOpen(true)}
      >
        <RobotOutlined style={{ fontSize: 22 }} />
      </div>

      {/* Popup */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        title="AI English Assistant"
        width={800}
      >
        {loading ? (
          <Spin />
        ) : result && result.length > 0 ? (
          result.map((item: any, index: number) => (
            <Card
              key={index}
              style={{ marginBottom: 20 }}
              bordered
            >
              <Title level={5}>Câu gốc:</Title>
              <Paragraph>{item.original}</Paragraph>

              <Title level={5}>Giải thích:</Title>
              <Paragraph>{item.explanation}</Paragraph>

              {item.grammar_notes && item.grammar_notes.length > 0 && (
                <>
                  <Title level={5}>Ghi chú ngữ pháp:</Title>
                  <ul>
                    {item.grammar_notes.map((note: string, idx: number) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </>
              )}

              {item.vocabulary && item.vocabulary.length > 0 && (
                <>
                  <Title level={5}>Từ vựng:</Title>
                  {item.vocabulary.map((v: any, idx: number) => (
                    <Card
                      type="inner"
                      key={idx}
                      style={{ marginBottom: 8 }}
                    >
                      <Text strong>{v.word}</Text> - {v.meaning}
                      <br />
                      <Text type="secondary">Ví dụ: {v.example}</Text>
                    </Card>
                  ))}
                </>
              )}

              {item.answer_analysis && item.answer_analysis.length > 0 && (
                <>
                  <Title level={5}>Phân tích đáp án:</Title>
                  <Collapse>
                    {item.answer_analysis.map((a: any, idx: number) => (
                      <Panel header={`Option ${a.option}`} key={idx}>
                        {a.reason}
                      </Panel>
                    ))}
                  </Collapse>
                </>
              )}
            </Card>
          ))
        ) : (
          "Chạm vào icon AI trên từng câu để giải thích."
        )}
      </Modal>
    </>
  );
}
