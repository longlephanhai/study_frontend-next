"use client"
import { Card, List, Tag, Typography } from "antd";
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;
interface IProps {
  writings: IWriting[];
}

const ListWriting = (props: IProps) => {
  const { writings: data } = props;
  const router = useRouter();
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>TOEIC Writing Practice</Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <Card title={item.title} bordered hoverable onClick={() => router.push(`/writing/${item._id}`)}>
              <Tag color="blue">{item.topic}</Tag>
              <Tag color={item.level === "Beginner" ? "green" : item.level === "Intermediate" ? "orange" : "red"}>
                {item.level}
              </Tag>
              <Paragraph style={{ marginTop: 10 }}>{item.description}</Paragraph>
              <Text type="secondary">
                Word limit: {item.minWords}–{item.maxWords}
              </Text>
              <Paragraph style={{ marginTop: 10 }}>
                <b>Suggestion:</b> {item.suggestion}
              </Paragraph>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

export default ListWriting