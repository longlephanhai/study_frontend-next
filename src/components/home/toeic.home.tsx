'use client';

import React, { useState } from "react";
import { Card, List, Progress, Typography, Button, Row, Col, Space, Tag, Divider, message, Tooltip } from "antd";
import { SoundOutlined, FileTextOutlined, BookOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

interface ITask {
  _id: string;
  title: string;
  description: string;
  type: string;
  isLocked: boolean;
}

interface ILearningStep {
  _id: string;
  order: number;
  title: string;
  description: string;
  tasks: ITask[];
}

interface ILearningPath {
  _id: string;
  title: string;
  currentDay: number;
  steps: ILearningStep[];
}

interface IProps {
  learningPaths: ILearningPath[];
}

export default function StudyMain({ learningPaths }: IProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const router = useRouter();
  if (!learningPaths || learningPaths.length === 0) {
    return <div>Chưa có lộ trình nào.</div>;
  }

  const learningPath = learningPaths[0];

  const [selectedStep, setSelectedStep] = useState<ILearningStep | null>(
    learningPath.steps.find(s => s.order === learningPath.currentDay) || null
  );

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "Part1":
      case "Part2":
      case "Part3":
      case "Part4":
        return <SoundOutlined />;
      case "Part5":
      case "Part6":
      case "Part7":
        return <FileTextOutlined />;
      case "Grammar":
        return <BookOutlined />;
      default:
        return null;
    }
  };

  const onComplete = () => {
    if (!selectedStep) return;
    if (!completedSteps.includes(selectedStep._id)) {
      setCompletedSteps([...completedSteps, selectedStep._id]);
      message.success(`Hoàn thành ngày học ${selectedStep.order}`);
    }
  };

  const completed = selectedStep ? completedSteps.includes(selectedStep._id) : false;

  const handleOnClickTask = (task: ITask) => {
    console.log("Click task: ", task.type);
    router.push(`/learningpath?task=${task._id}`);
  }

  return (
    <div style={{ padding: "24px", background: "#fff", minHeight: "calc(100vh - 200px)" }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>{learningPath.title}</Title>
      </Card>

      <Card title="Chọn ngày học" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {learningPath.steps.map(step => {
            const isLocked = step.order > learningPath.currentDay;
            const isCompleted = completedSteps.includes(step._id);

            const buttonContent = isCompleted ? `Ngày ${step.order} ` : `Ngày ${step.order}`;

            return (
              <Col key={step._id} xs={8} sm={6} md={4} lg={3}>
                <Tooltip title={isLocked ? "Ngày chưa tới, không thể học" : ""}>
                  <Button
                    type={selectedStep?._id === step._id ? "primary" : "default"}
                    style={{ width: "100%" }}
                    disabled={isLocked}
                    onClick={() => setSelectedStep(step)}
                  >
                    {buttonContent}
                  </Button>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Thông tin ngày học hiện tại */}
      {selectedStep && (
        <>
          <Card style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4}>
                  {selectedStep.title}
                </Title>
                <Paragraph type="secondary">{selectedStep.description}</Paragraph>
              </Col>
              <Col>
                <Progress
                  type="circle"
                  percent={completed ? 100 : 0}
                  width={80}
                  strokeColor="#1677ff"
                />
              </Col>
            </Row>
          </Card>

          {/* Nhiệm vụ hôm nay */}
          <Card title="Nhiệm vụ hôm nay" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={selectedStep.tasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" disabled={task.isLocked} onClick={() => handleOnClickTask(task)}>
                      {task.isLocked ? "Khóa" : "Học ngay"}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<span style={{ fontSize: 20 }}>{getTaskIcon(task.type)}</span>}
                    title={
                      <Space>
                        {task.title}
                        <Tag color="blue">{task.type}</Tag>
                      </Space>
                    }
                    description={task.description}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Hoàn thành ngày học */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={onComplete}
              disabled={completed}
            >
              {completed ? "Đã hoàn thành ngày học" : "Hoàn thành ngày học"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
