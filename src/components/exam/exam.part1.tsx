'use client'

import { RefObject, useState } from 'react';
import { Card, Typography, Radio, Space, Statistic } from 'antd';

const { Title } = Typography;
const { Timer } = Statistic;

interface IProps {
  part: IPart,
  answers?: Record<string, string>,
  onAnswerChange?: (questionId: string, value: string) => void,
  questionRefs?: RefObject<Record<string, HTMLDivElement | null>>,
  durationSec?: number
}

const Part1Component = ({ part, answers = {}, onAnswerChange, questionRefs, durationSec }: IProps) => {
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(answers);
  const deadline = Date.now() + (durationSec ? durationSec * 1000 : 0);
  const handleChange = (questionId: string, value: string) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }));
    onAnswerChange?.(questionId, value);
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>{part.name}</h2>
      <p>{part.description}</p>
      {/* {durationSec && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 16
        }}>
          <div style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 'bold',
            minWidth: 80,
            textAlign: 'center'
          }}>
            <Timer type="countdown" value={deadline} />
          </div>
        </div>
      )} */}

      {part.questions.map((q) => (
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
            boxShadow: 'none',
          }}
        >

          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>
              Câu {q.numberQuestion}
            </Title>

            {/* Audio */}
            {q.audioUrl && (
              <audio controls style={{ width: '100%', margin: '10px 0' }}>
                <source src={q.audioUrl.trim()} type="audio/mpeg" />
                Trình duyệt của bạn không hỗ trợ audio.
              </audio>
            )}

            {/* Image */}
            {q.imageUrl && (
              <div style={{ margin: '10px 0', textAlign: 'center' }}>
                <img src={q.imageUrl} alt={`Question ${q.numberQuestion}`} style={{ maxWidth: '100%', borderRadius: 8 }} />
              </div>
            )}

            {/* Options */}
            <Radio.Group
              onChange={e => handleChange(q._id, e.target.value)}
              value={localAnswers[q._id]}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}
            >
              {q.options.map((opt, i) => (
                <Radio key={i} value={String.fromCharCode(65 + i)} >
                  {String.fromCharCode(65 + i)}
                </Radio>
              ))}
            </Radio.Group>

          </Space>
        </Card>
      ))}
    </div>
  )
}

export default Part1Component;
