'use client'

import React from 'react'
import { Card, Typography, Row, Col, Tag } from 'antd'
import {
  FileTextOutlined,
  GlobalOutlined,
  EditOutlined,
  BookOutlined,
  CompassOutlined,
  ShoppingOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  LaptopOutlined,
  CarOutlined,
  CloudOutlined,
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

interface IProps {
  topics: ITopicVocabulary[]
}

const iconMap: Record<string, React.ReactNode> = {
  "Daily Routine": <FileTextOutlined style={{ color: '#52c41a' }} />,
  "Work Schedule": <FileTextOutlined style={{ color: '#52c41a' }} />,
  "Travel Plans": <CompassOutlined style={{ color: '#faad14' }} />,
  "Shopping": <ShoppingOutlined style={{ color: '#f5222d' }} />,
  "Food & Dining": <HeartOutlined style={{ color: '#fa541c' }} />,
  "Directions": <CompassOutlined style={{ color: '#faad14' }} />,
  "Health & Fitness": <MedicineBoxOutlined style={{ color: '#13c2c2' }} />,
  "Hobbies & Leisure": <HeartOutlined style={{ color: '#eb2f96' }} />,
  "Education": <BookOutlined style={{ color: '#722ed1' }} />,
  "Technology": <LaptopOutlined style={{ color: '#1890ff' }} />,
  "Transportation": <CarOutlined style={{ color: '#fa8c16' }} />,
  "Weather": <CloudOutlined style={{ color: '#2f54eb' }} />,
  "Shopping Online": <ShoppingOutlined style={{ color: '#f5222d' }} />,
  "Accommodations": <HomeOutlined style={{ color: '#fa8c16' }} />,
  "Social Events": <TeamOutlined style={{ color: '#722ed1' }} />,
  "Money & Banking": <DollarOutlined style={{ color: '#52c41a' }} />,
  "Transportation Problems": <CarOutlined style={{ color: '#fa541c' }} />,
  "Environment": <GlobalOutlined style={{ color: '#13c2c2' }} />,
  "Cultural Experiences": <GlobalOutlined style={{ color: '#722ed1' }} />,
  "Customer Service": <EditOutlined style={{ color: '#eb2f96' }} />,
};

const TopicsVocabularyList = ({ topics }: IProps) => {
  const router = useRouter();
  return (
    <div
      style={{
        padding: '32px 24px',
        maxWidth: 1000,
        margin: '0 auto',
        borderRadius: 16,
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: 'center',
          marginBottom: 40,
          background: 'linear-gradient(to right, #1677ff, #722ed1)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Writing Topics
      </Title>

      <Row gutter={[20, 20]}>
        {topics.map((item) => (
          <Col xs={24} sm={12} md={8} key={item._id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                height: '100%',
              }}
              bodyStyle={{ padding: '20px 24px' }}
              className="hover:shadow-lg hover:-translate-y-1 transition-all"
              onClick={() => {
                router.push(`/speaking/${item._id}?topic=${encodeURIComponent(item.topic)}`);
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {iconMap[item.topic] || <EditOutlined style={{ color: '#595959' }} />}
                <Title level={5} style={{ margin: 0 }}>
                  {item.topic}
                </Title>
              </div>
              <Text type="secondary">{item.description}</Text>

            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default TopicsVocabularyList
