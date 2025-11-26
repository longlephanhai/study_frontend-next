'use client'
import { Button, Card, Col, Row, Space, Tag } from "antd"
import { FileSearchOutlined } from "@ant-design/icons"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
interface IProps {
  result: IExamResult,
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

const TestHistoryDetail = (props: IProps) => {
  const { result: data } = props;

  const params = useParams();

  const router = useRouter();

  const [partIds, setPartIds] = useState<string | undefined>();

  // @ts-ignore
  const correctGrouped = groupByCategory(data?.correctAnswer || [])
  // @ts-ignore
  const wrongGrouped = groupByCategory(data?.wrongAnswer || [])
  // @ts-ignore
  const noAnswerGrouped = groupByCategory(data?.noAnswer || [])
  useEffect(() => {
    // @ts-ignore
    const parts = data?.parts?.map((part) => part.partId).join(',');
    setPartIds(parts);
  }, [])
  console.log('partIds', partIds);
  return (
    <>
      <Button
        type="primary"
        icon={<FileSearchOutlined />}
        style={{
          marginBottom: 16,
          borderRadius: 8,
          padding: "6px 14px",
          fontWeight: 500,
        }}
        onClick={() => router.push(`answer/${params.id}?parts=${partIds}`)}
      >
        Xem chi tiết đáp án
      </Button>
      <CategoryCard title="Các câu làm đúng" groupedAnswers={correctGrouped} color="green" />
      <CategoryCard title="Các câu làm sai" groupedAnswers={wrongGrouped} color="red" />
      <CategoryCard title="Các câu chưa làm" groupedAnswers={noAnswerGrouped} color="orange" />
    </>
  );
}

export default TestHistoryDetail;