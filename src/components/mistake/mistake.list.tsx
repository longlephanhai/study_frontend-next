'use client';
import React from 'react';
import { Card, Button, Typography, Row, Col, Tag, Divider } from 'antd';
import { useRouter } from 'next/navigation';


const { Title, Text } = Typography;

interface IMistake {
  [key: string]: {
    [category: string]: number;
  };
}

interface IProps {
  mistakes: IMistake[];
  onPractice?: (partKey: string) => void;
}

const MistakeList: React.FC<IProps> = ({ mistakes, onPractice }) => {
  const router = useRouter();
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
        Tổng hợp lỗi sai theo từng Part
      </Title>

      {mistakes.map((partObj, index) => {
        const partKey = Object.keys(partObj)[0];
        const categories = partObj[partKey];
        const hasMistake = Object.keys(categories).length > 0;

        return (
          <Card
            key={partKey}
            style={{
              marginBottom: 20,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ padding: 20 }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 16, textTransform: 'capitalize' }}>
                  {partKey}
                </Text>
                {hasMistake && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      if (onPractice) {
                        onPractice(partKey);
                      } else {
                        router.push(`/mistake/${partKey}`);
                      }
                    }}
                  >
                    Ôn tập lỗi sai
                  </Button>
                )}
              </div>
            }
          >
            {!hasMistake ? (
              <Text type="secondary">Không có lỗi sai trong phần này 🎉</Text>
            ) : (
              <>
                <Row gutter={[16, 12]}>
                  {Object.entries(categories).map(([category, count]) => (
                    <Col xs={24} sm={12} key={category}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '6px 10px',
                          background: '#fafafa',
                          borderRadius: 6,
                        }}
                      >
                        <Text>{category}</Text>
                        <Tag color={count >= 5 ? 'volcano' : count >= 3 ? 'orange' : 'blue'}>
                          {count}
                        </Tag>
                      </div>
                    </Col>
                  ))}
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Text type="secondary">
                  Tổng số lỗi: <Text strong>{Object.values(categories).reduce((a, b) => a + b, 0)}</Text>
                </Text>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default MistakeList;
