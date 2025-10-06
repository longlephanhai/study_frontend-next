"use client"
import { useState } from "react"
import {
  Button,
  Spin,
  Alert,
  Card,
  Typography,
  Input,
  Upload,
  Collapse,
  List,
  Tag,
  Progress,
  message,
} from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { sendRequest } from "@/utils/api"
import { useSession } from "next-auth/react"

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Panel } = Collapse

interface IProps {
  writing: IWriting | null
}

export default function WritingTextarea({ writing }: IProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [loadingText, setLoadingText] = useState(false)
  const [feedbackText, setFeedbackText] = useState<WritingFeedback | null>(null)

  const [fileList, setFileList] = useState<any[]>([])
  const [loadingImg, setLoadingImg] = useState(false)
  const [feedbackImg, setFeedbackImg] = useState<string | null>(null)

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // --- Submit bài viết ---
  const handleSubmitText = async () => {
    if (!content.trim()) {
      message.warning("Please enter your writing content.")
      return
    }

    setLoadingText(true)
    setFeedbackText(null)

    try {
      const res = await sendRequest<IBackendRes<WritingFeedback>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing-ai/generate-text`,
        method: 'POST',
        body: {
          writingId: writing?._id,
          title: writing?.title,
          description: writing?.description,
          content,
          minWords: writing?.minWords,
          maxWords: writing?.maxWords,
          level: writing?.level,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      })
      if (res?.data) {
        setFeedbackText(res.data)
        setLoadingText(false)
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing-history`,
          method: 'POST',
          body: {
            userId: session?.user._id,
            writingId: writing?._id,
            content,
            feedback: res.data,
            score: res.data.score || {
              overall: 0,
              grammar: 0,
              vocabulary: 0,
              structure: 0
            },
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        })
      }
    } catch (err) {
      console.error(err)
      message.error("Error while submitting writing. Please try again.")
    }
  }

  // --- Submit ảnh ---
  const handleSubmitImage = async () => {
    if (fileList.length === 0) {
      alert("Please upload at least one image.")
      return
    }

    setLoadingImg(true)
    setFeedbackImg(null)

    try {
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj)
      })

      const res = await fetch("/api/evaluateImage", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setFeedbackImg(data.feedback || "No feedback received.")
    } catch (err) {
      console.error(err)
      setFeedbackImg("Error while evaluating image. Please try again.")
    } finally {
      setLoadingImg(false)
    }
  }

  const renderFeedback = (data: any) => {
    if (!data) return null

    // Nếu backend chỉ trả về chuỗi feedback
    if (typeof data === "string" || data.overallFeedback === undefined) {
      return (
        <Alert
          message="AI Feedback"
          description={data.overallFeedback || data}
          type="info"
          showIcon
        />
      )
    }

    return (
      <Collapse defaultActiveKey={["overall", "grammar", "vocab", "score"]}>
        <Panel header="Overall Feedback" key="overall">
          <Paragraph>{data.overallFeedback}</Paragraph>
        </Panel>

        <Panel header="Grammar Errors" key="grammar">
          {data.grammarErrors?.length ? (
            <List
              dataSource={data.grammarErrors}
              renderItem={(item: any) => (
                <List.Item>
                  <div>
                    <Text type="danger">✗ {item.original}</Text>
                    <br />
                    <Text type="success">→ {item.correction}</Text>
                    <br />
                    <Text type="secondary">{item.explanation}</Text>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No grammar issues found.</Text>
          )}
        </Panel>

        <Panel header="Vocabulary Suggestions" key="vocab">
          {data.vocabularySuggestions?.length ? (
            <List
              dataSource={data.vocabularySuggestions}
              renderItem={(item: any) => (
                <List.Item>
                  <div>
                    <Text strong>{item.word}</Text> → <Text>{item.suggestion}</Text>
                    <br />
                    <Text type="secondary">{item.reason}</Text>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No vocabulary suggestions.</Text>
          )}
        </Panel>

        <Panel header="Structure Feedback" key="structure">
          <Paragraph>{data.structureFeedback || "No feedback provided."}</Paragraph>
        </Panel>

        <Panel header="Score Breakdown" key="score">
          {data.score ? (
            <>
              {Object.entries(data.score).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <Text>{k.toUpperCase()}</Text>
                  <Progress percent={Number(v) * 10} showInfo />
                </div>
              ))}
            </>
          ) : (
            <Text type="secondary">No score data.</Text>
          )}
        </Panel>

        <Panel header="Improved Version" key="improved">
          <Paragraph>{data.improvedVersion || "No improved version provided."}</Paragraph>
        </Panel>
      </Collapse>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: "24px auto" }}>
      {/* --- Card 1: Writing --- */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>{writing?.title}</Title>
        <Paragraph type="secondary">{writing?.description}</Paragraph>
        <Text type="secondary">Level: {writing?.level}</Text>
        <br />
        <Text type="secondary">
          Words: {writing?.minWords} – {writing?.maxWords}
        </Text>
        <Paragraph style={{ marginTop: 12 }}>
          <Text strong>Suggestion: </Text>
          {writing?.suggestion}
        </Paragraph>

        <TextArea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your answer here..."
          style={{ marginBottom: 8 }}
        />

        <Text type={wordCount < (writing?.minWords || 0) ? "danger" : "secondary"}>
          Word count: {wordCount}
        </Text>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleSubmitText} disabled={loadingText}>
            {loadingText ? "Submitting..." : "Submit Text"}
          </Button>
        </div>

        <div style={{ marginTop: 24 }}>
          {loadingText && <Spin />}
          {feedbackText && renderFeedback(feedbackText)}
        </div>
      </Card>

      {/* --- Card 2: Upload Image --- */}
      <Card>
        <Title level={4}>Upload Image</Title>
        <Paragraph type="secondary">
          You can upload related images for separate AI analysis.
        </Paragraph>

        <Upload
          multiple
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList }) => setFileList(fileList)}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleSubmitImage} disabled={loadingImg}>
            {loadingImg ? "Submitting..." : "Submit Image"}
          </Button>
        </div>

        <div style={{ marginTop: 24 }}>
          {loadingImg && <Spin />}
          {feedbackImg && (
            <Alert
              message="AI Feedback (Image)"
              description={feedbackImg}
              type="info"
              showIcon
            />
          )}
        </div>
      </Card>
    </div>
  )
}
