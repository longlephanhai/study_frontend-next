"use client";

import React, { useState } from "react";
import { Table, Modal, Tag, Typography, Descriptions, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Paragraph, Text, Title } = Typography;


interface IProps {
  writingHistories: IWritingHistory[];
}

const WritingHistoryPageComponent = ({ writingHistories }: IProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IWritingHistory | null>(null);

  const columns: ColumnsType<IWritingHistory> = [
    {
      title: "Topic",
      dataIndex: ["writingId", "topic"],
      key: "topic",
      render: (topic) => <Text>{topic}</Text>,
    },
    {
      title: "Title",
      dataIndex: ["writingId", "title"],
      key: "title",
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: "Overall Score",
      dataIndex: ["feedback", "score", "overall"],
      key: "score",
      render: (score: number) => (
        <Tag color={score >= 4.5 ? "green" : score >= 3.5 ? "blue" : "orange"}>
          {score.toFixed(1)} / 5
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() => {
            setSelected(record);
            setOpen(true);
          }}
        >
          View
        </a>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
        <Title level={3}>Writing History</Title>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={writingHistories}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal
        width={800}
        open={open}
        onCancel={() => setOpen(false)}
        title={`Feedback for: ${selected?.writingId.title}`}
        footer={null}
      >
        {selected && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Topic">
                {selected.writingId.topic}
              </Descriptions.Item>
              <Descriptions.Item label="Title">
                {selected.writingId.title}
              </Descriptions.Item>
              <Descriptions.Item label="Overall Feedback">
                {selected.feedback.overallFeedback}
              </Descriptions.Item>
              <Descriptions.Item label="Structure Feedback">
                {selected.feedback.structureFeedback}
              </Descriptions.Item>
              <Descriptions.Item label="Score">
                Grammar: {selected.feedback.score.grammar} | Vocabulary:{" "}
                {selected.feedback.score.vocabulary} | Coherence:{" "}
                {selected.feedback.score.coherence} | Task Response:{" "}
                {selected.feedback.score.taskResponse} |{" "}
                <b>Overall: {selected.feedback.score.overall}</b>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Grammar Errors</Title>
            {selected.feedback.grammarErrors.length > 0 ? (
              selected.feedback.grammarErrors.map((err, i) => (
                <Paragraph key={i}>
                  <Text type="danger">Original:</Text> {err.original}
                  <br />
                  <Text type="success">Correction:</Text> {err.correction}
                  <br />
                  <Text type="secondary">{err.explanation}</Text>
                </Paragraph>
              ))
            ) : (
              <Text>No grammar issues detected.</Text>
            )}

            <Divider />

            <Title level={5}>Vocabulary Suggestions</Title>
            {selected.feedback.vocabularySuggestions.length > 0 ? (
              selected.feedback.vocabularySuggestions.map((v, i) => (
                <Paragraph key={i}>
                  <Text type="danger">Word:</Text> {v.word} →{" "}
                  <Text type="success">{v.suggestion}</Text>
                  <br />
                  <Text type="secondary">{v.reason}</Text>
                </Paragraph>
              ))
            ) : (
              <Text>No vocabulary suggestions.</Text>
            )}

            <Divider />

            <Title level={5}>Improved Version</Title>
            <Paragraph style={{ whiteSpace: "pre-line" }}>
              {selected.feedback.improvedVersion}
            </Paragraph>
          </>
        )}
      </Modal>
    </>
  );
};

export default WritingHistoryPageComponent;
