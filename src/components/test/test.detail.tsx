'use client'
import { useState } from 'react'
import {
  Card,
  List,
  Space,
  Typography,
  Tag,
  Button,
  Divider,
  Flex,
  Checkbox,
  message,
} from 'antd'
import {
  SoundOutlined,
  BookOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

interface IProps {
  test: ITest
}

const TestDetailComponent = ({ test }: IProps) => {

  const router = useRouter()

  const [selectedParts, setSelectedParts] = useState<string[]>([])

  const handleSelectPart = (partId: string, checked: boolean) => {
    setSelectedParts((prev) =>
      checked ? [...prev, partId] : prev.filter((id) => id !== partId)
    )
  }

  const handleStartSelected = () => {
    if (selectedParts.length === 0) {
      message.warning('Vui lòng chọn ít nhất một phần thi.')
      return
    }
    message.success(`Bắt đầu làm ${selectedParts.length} phần đã chọn!`)
    router.push(`exam?parts=${selectedParts.join(',')}`)
  }

  const handleStartAll = () => {
    message.success('Bắt đầu làm toàn bộ bài thi!')
    router.push(`exam`)
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Flex justify="space-between" align="center">
            <Space align="center">
              <BookOutlined style={{ fontSize: 22, color: '#1677ff' }} />
              <Title level={3} style={{ margin: 0 }}>
                {test.title}
              </Title>
            </Space>
            {test.isPublic && (
              <Tag color="green" style={{ borderRadius: 6 }}>
                Public
              </Tag>
            )}
          </Flex>

          <Text>{test.description}</Text>
        </Space>
      </Card>

      {/* Danh sách Parts */}
      <List
        itemLayout="vertical"
        dataSource={test.parts}
        renderItem={(part, index) => (
          <List.Item key={part._id}>
            <Card
              hoverable
              style={{
                borderRadius: 10,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                transition: '0.3s',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Flex justify="space-between" align="center">
                  <Space align="center">
                    <Checkbox
                      checked={selectedParts.includes(part._id)}
                      onChange={(e) =>
                        handleSelectPart(part._id, e.target.checked)
                      }
                    />
                    <FileTextOutlined
                      style={{ color: '#52c41a', fontSize: 18 }}
                    />
                    <Title
                      level={4}
                      style={{
                        margin: 0,
                        color: '#1677ff',
                        fontWeight: 600,
                      }}
                    >
                      {part.name}
                    </Title>
                  </Space>

                  <Tag color="blue">
                    {part.questions?.length ?? 0} câu hỏi
                  </Tag>
                </Flex>

                <Text type="secondary">{part.description}</Text>

                <Divider style={{ margin: '10px 0' }} />

                <Button
                  type="primary"
                  ghost
                  shape="round"
                  onClick={() => {
                    message.info(`Bắt đầu làm phần "${part.name}"`)
                    router.push(`exam`)
                  }}
                >
                  Làm phần này
                </Button>
              </Space>
            </Card>
          </List.Item>
        )}
      />

      {/* Nút tổng */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginTop: 24, padding: '12px 4px' }}
      >
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleStartSelected}
          disabled={selectedParts.length === 0}
        >
          Làm {selectedParts.length > 0
            ? `${selectedParts.length} phần đã chọn`
            : 'phần đã chọn'}
        </Button>

        <Button type="primary" onClick={handleStartAll}>
          Làm toàn bộ bài thi
        </Button>
      </Flex>
    </div>
  )
}

export default TestDetailComponent
