'use client';

import React, { useState } from "react";
import { Card, List, Progress, Typography, Button, Row, Col, Space, Tag, Divider, message, Tooltip } from "antd";
import { SoundOutlined, FileTextOutlined, BookOutlined, LockOutlined, CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

const { Title, Paragraph } = Typography;

interface ITask {
  _id: string;
  title: string;
  description: string;
  type: string;
  isLocked: boolean;
  completed?: boolean;
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
  learningPaths: ILearningPath[]
}

export default function StudyMain({ learningPaths }: IProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const router = useRouter();

  const { data: session } = useSession();

  const learningPath = learningPaths[0];
  const [selectedStep, setSelectedStep] = useState<ILearningStep | null>(
    learningPath?.steps.find(s => s.order === learningPath.currentDay) || null
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

  const onComplete = async () => {
    if (!selectedStep) return;
    if (!completedSteps.includes(selectedStep._id) && selectedStep.tasks.every(t => t.isLocked) === true) {
      setCompletedSteps([...completedSteps, selectedStep._id]);
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/learning-path/${learningPath._id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
          next: { tags: ['fetch-learning-path'] }
        }
      });
      router.refresh();
    } else {
      message.warning("Vui lòng hoàn thành tất cả nhiệm vụ trước khi hoàn thành ngày học.");
    }
  };

  const completed = selectedStep ? completedSteps.includes(selectedStep._id) : false;

  const handleOnClickTask = (task: ITask) => {
    if (task.isLocked) return;
    router.push(`/learningpath?task=${task._id}`);
  };

  const taskProgress = selectedStep
    ? Math.round(
      (selectedStep.tasks.filter(t => t.completed || t.isLocked).length /
        selectedStep.tasks.length) *
      100
    )
    : 0;

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

            return (
              <Col key={step._id} xs={8} sm={6} md={4} lg={3}>
                <Tooltip title={isLocked ? "Ngày chưa tới, không thể học" : ""}>
                  <Button
                    type={selectedStep?._id === step._id ? "primary" : "default"}
                    style={{ width: "100%" }}
                    disabled={isLocked}
                    onClick={() => setSelectedStep(step)}
                  >
                    {`Ngày ${step.order}`} {learningPath.currentDay > step.order && <CheckOutlined style={{ color: "green" }} />}
                  </Button>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </Card>

      {selectedStep && (
        <>
          <Card style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4}>{selectedStep.title}</Title>
                <Paragraph type="secondary">{selectedStep.description}</Paragraph>
              </Col>
              <Col>
                <Progress
                  type="circle"
                  percent={taskProgress}
                  width={80}
                  strokeColor="#1677ff"
                  format={(percent) => `${percent}%`}
                />
              </Col>
            </Row>
          </Card>

          <Card title="Nhiệm vụ hôm nay" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={selectedStep.tasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleOnClickTask(task)}
                      disabled={task.isLocked}
                    >
                      {task.isLocked ? <LockOutlined /> : "Học ngay"}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<span style={{ fontSize: 20 }}>{getTaskIcon(task.type)}</span>}
                    title={
                      <Space>
                        {task.title}
                        <Tag color={task.isLocked ? "gray" : "blue"}>{task.type}</Tag>
                        {task.completed && <Tag color="green">✓</Tag>}
                      </Space>
                    }
                    description={task.description}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={onComplete}
              disabled={learningPath.currentDay !== selectedStep?.order}
            >
              {learningPath.currentDay !== selectedStep?.order ? "Đã hoàn thành ngày học" : "Hoàn thành ngày học"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
