'use client'
import { Card, List, Tag, Space, Typography, Button, Divider } from "antd"
import {
  ClockCircleOutlined,
  QuestionCircleOutlined,
  SoundOutlined,
  BookOutlined,
} from "@ant-design/icons"
import { useRouter } from "next/navigation"

const { Title, Text } = Typography


interface IProps {
  tests: ITest[]
}

const TestList = ({ tests }: IProps) => {

  const router = useRouter();

  const tagColors = [
    "blue",
    "green",
    "volcano",
    "purple",
    "geekblue",
    "orange",
    "magenta",
  ]

  return (
    <div style={{ padding: "24px" }}>
      <List
        grid={{ gutter: 24, column: 2 }}
        dataSource={tests}
        renderItem={(test) => (
          <List.Item key={test._id}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
              title={
                <Space align="center">
                  <BookOutlined style={{ color: "#1677ff" }} />
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: "#1677ff",
                      fontWeight: 600,
                      fontSize: "18px",
                    }}
                  >
                    {test.title}
                  </Title>
                  {test.isPublic && (
                    <Tag color="blue" style={{ borderRadius: 6 }}>
                      Public
                    </Tag>
                  )}
                </Space>
              }
            >
              <Text type="secondary">{test.description}</Text>

              <Divider style={{ margin: "12px 0" }} />

              <Space
                size="large"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  rowGap: 8,
                }}
              >
                <Space>
                  <ClockCircleOutlined style={{ color: "#52c41a" }} />
                  <Text>{Math.floor(test.durationSec / 60)} phút</Text>
                </Space>
                <Space>
                  <QuestionCircleOutlined style={{ color: "#faad14" }} />
                  <Text>{test.totalQuestions} câu</Text>
                </Space>
                {test.audioUrl && (
                  <Space>
                    <SoundOutlined style={{ color: "#eb2f96" }} />
                    <a
                      href={test.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#eb2f96" }}
                    >
                      Nghe audio
                    </a>
                  </Space>
                )}
              </Space>

              {test.parts.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text strong>Các phần thi:</Text>
                  <div style={{ marginTop: 8 }}>
                    {test.parts.map((part, index) => (
                      <Tag
                        key={part._id}
                        color={tagColors[index % tagColors.length]}
                        style={{
                          marginBottom: 6,
                          fontSize: 13,
                          borderRadius: 6,
                          padding: "3px 8px",
                        }}
                      >
                        {part.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: "right" }}>
                <Button
                  type="primary"
                  shape="round"
                  size="middle"
                  style={{ padding: "0 28px", fontWeight: 500 }}
                  onClick={() => router.push(`/test/${test._id}`)}
                >
                  Xem
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

export default TestList
