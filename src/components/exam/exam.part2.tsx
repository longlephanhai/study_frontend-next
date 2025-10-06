'use client'

import { RefObject, useState } from 'react';
import { Card, Radio, Space, Collapse, Typography } from 'antd';

const { Title } = Typography;
const { Panel } = Collapse;

interface IProps {
  part: IPart,
  answers?: Record<string, string>,
  onAnswerChange?: (questionId: string, value: string) => void,
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>
}

const Part2Component = ({ part, answers = {}, onAnswerChange, questionRefs }: IProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(answers);

  const handleSelect = (questionId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: value }));
    onAnswerChange?.(questionId, value);
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>{part.name}</h2>
      <p>{part.description}</p>

      {part.questions.map(q => (
        <Card
          key={q._id}
          ref={el => {
            if (questionRefs && questionRefs.current) {
              questionRefs.current[q._id] = el;
            }
          }}
          style={{
            borderRadius: 8,
            marginBottom: 20,
            border: '1px solid #eee',
            boxShadow: 'none'
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>Câu {q.numberQuestion}</Title>

            {/* Audio */}
            {q.audioUrl && (
              <audio controls style={{ width: '100%', margin: '10px 0' }}>
                <source src={q.audioUrl.trim()} type="audio/mpeg" />
                Trình duyệt của bạn không hỗ trợ audio.
              </audio>
            )}

            {/* Options */}
            <Radio.Group
              onChange={e => handleSelect(q._id, e.target.value)}
              value={selectedOptions[q._id]}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}
            >
              {q.options.map((opt, i) => (
                <Radio key={i} value={opt}>{opt}</Radio>
              ))}
            </Radio.Group>

          </Space>
        </Card>
      ))}
    </div>
  )
}

export default Part2Component;
