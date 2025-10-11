'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Modal, Empty, Pagination } from 'antd';


const { Title, Text } = Typography;

interface IProps {
  grammars: IGrammar[];
}

const PAGE_SIZE = 9; // số bài trên mỗi trang

const GrammarList: React.FC<IProps> = ({ grammars }) => {
  const [selectedGrammar, setSelectedGrammar] = useState<IGrammar | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!grammars || grammars.length === 0) {
    return <Empty description="Không có ngữ pháp nào" style={{ marginTop: 50 }} />;
  }

  // tính toán phân trang
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = grammars.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        📘 Danh sách ngữ pháp
      </Title>

      <Row gutter={[24, 24]}>
        {currentData.map((grammar) => (
          <Col xs={24} sm={24} md={12} lg={8} key={grammar._id}>
            <Card
              bordered
              hoverable
              style={{
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 8,
              }}
            >
              <Title level={4} style={{ marginBottom: 16 }}>
                {grammar.title}
              </Title>

              <Button
                type="primary"
                onClick={() => setSelectedGrammar(grammar)}
                style={{ width: '100%' }}
              >
                Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={grammars.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      {/* Modal xem chi tiết */}
      <Modal
        open={!!selectedGrammar}
        onCancel={() => setSelectedGrammar(null)}
        title={selectedGrammar?.title}
        footer={null}
        width={800}
        maskClosable={false}
      >
        {selectedGrammar && (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: selectedGrammar.content }}
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: '#444',
                marginTop: 8,
              }}
            />

            {/* Nút Ôn luyện với AI */}
            <div
              style={{
                marginTop: 32,
                textAlign: 'center',
                borderTop: '1px solid #f0f0f0',
                paddingTop: 24,
              }}
            >
              <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                Sẵn sàng áp dụng kiến thức này?
              </Typography.Text>

              <Button
                type="primary"
                size="large"
                onClick={() => {
                  // 👉 Tùy bạn: có thể navigate đến trang luyện tập AI
                  // Ví dụ nếu dùng Next.js router:
                  // router.push(`/ai/grammar/${selectedGrammar._id}`);
                  console.log('Bắt đầu ôn luyện với AI cho:', selectedGrammar.title);
                }}
              >
                💬 Ôn luyện với AI
              </Button>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
};

export default GrammarList;
