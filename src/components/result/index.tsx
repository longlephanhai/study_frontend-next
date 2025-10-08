'use client'

import { Card, Typography, Divider, Row, Col, Tag, Space } from 'antd'

const { Title, Text } = Typography

interface IProps {
  result: any
}

const groupByCategory = (answers: any[]) => {
  const grouped: { [key: string]: number[] } = {}
  answers.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item.numberQuestion)
  })
  return grouped
}

const CategoryCard = ({
  title,
  groupedAnswers,
  color,
}: {
  title: string
  groupedAnswers: { [key: string]: number[] }
  color: string
}) => {
  return (
    <Card size="small" title={title} bordered={false} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {Object.keys(groupedAnswers).map((category) => (
          <Col key={category} xs={24} sm={12} md={8} lg={6}>
            <Card type="inner" title={category} size="small">
              <Space wrap>
                {groupedAnswers[category].map((num) => (
                  <Tag color={color} key={num}>
                    {num}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

const ExamResultDetail = ({ result }: IProps) => {
  const correctGrouped = groupByCategory(result?.correctAnswer || [])
  const wrongGrouped = groupByCategory(result?.wrongAnswer || [])
  const noAnswerGrouped = groupByCategory(result?.noAnswer || [])

  return (
    <Card title="Chi tiết kết quả thi" bordered={false} style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>

        <Card size="small" bordered={false}>
          <Text strong>Tổng số câu đúng: </Text>
          <Text>{result?.totalCorrect}</Text> |{' '}
          <Text strong>Tổng số câu nghe đúng: </Text>
          <Text>{result?.totalListeningCorrect}</Text> |{' '}
          <Text strong>Tổng số câu đọc đúng: </Text>
          <Text>{result?.totalReadingCorrect}</Text> |{' '}
          <Text strong>Tổng điểm phần đọc: </Text>
          <Text>{result?.totalReadingScore}</Text> |{' '}
          <Text strong>Tổng điểm phần nghe: </Text>
          <Text>{result?.totalListeningScore}</Text> |{' '}
          <Text strong>Tổng điểm: </Text>
          <Text>{result?.totalScore}</Text>
        </Card>

        <Divider />

        <CategoryCard title="Các câu làm đúng" groupedAnswers={correctGrouped} color="green" />

        <CategoryCard title="Các câu làm sai" groupedAnswers={wrongGrouped} color="red" />

        <CategoryCard title="Các câu chưa làm" groupedAnswers={noAnswerGrouped} color="orange" />
      </Space>
    </Card>
  )
}

export default ExamResultDetail
