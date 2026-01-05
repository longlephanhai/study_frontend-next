import { sendRequest } from "@/utils/api";
import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Radio,
  Checkbox,
  Divider,
  Row,
  Col,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const SurveyModal = ({ isModalOpen, setIsModalOpen }: IProps) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (values: ISurvey) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/surveys`,
      method: "POST",
      body: values,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: { next: { tags: ["fetch-survey"] } },
    });

    if (res?.data) {
      message.success("Survey submitted successfully!");
      setIsModalOpen(false);
      form.resetFields();
      router.refresh();
    } else {
      message.error(res?.error || "Submission failed");
    }
  };

  return (
    <Modal
      title="📘 TOEIC Learning Path Survey"
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={() => setIsModalOpen(false)}
      okText="Submit"
      width="70vw"
      maskClosable={false}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* ===== Section 1 ===== */}
        <Divider orientation="left">1️⃣ Current Level</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="toeicHistory" label="Toeic History" required>
              <Select
                options={[
                  { value: "none", label: "Never taken TOEIC" },
                  { value: "<300", label: "Below 300" },
                  { value: "300-500", label: "300 – 500" },
                  { value: "500-700", label: "500 – 700" },
                  { value: "700+", label: "Above 700" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="targetScore" label="Target Score" required>
              <Select
                options={[
                  { value: "450", label: "450+" },
                  { value: "600", label: "600+" },
                  { value: "700", label: "700+" },
                  { value: "800", label: "800+" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="readingLevel" label="Reading Level" required>
              <Select
                options={[
                  { value: "weak", label: "Weak" },
                  { value: "average", label: "Average" },
                  { value: "good", label: "Good" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="listeningLevel" label="Listening Level" required>
              <Select
                options={[
                  { value: "weak", label: "Weak" },
                  { value: "average", label: "Average" },
                  { value: "good", label: "Good" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="vocabularyLevel" label="Vocabulary Level" required>
              <Select
                options={[
                  { value: "basic", label: "Basic" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ===== Section 2 ===== */}
        <Divider orientation="left">2️⃣ Goals & Study Time</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="studyTimePerDay" label="Study Time Per Day" required>
              <Select
                options={[
                  { value: "30m", label: "30 minutes" },
                  { value: "1h", label: "1 hour" },
                  { value: "1.5h", label: "1.5 hours" },
                  { value: "2h+", label: "2+ hours" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="studyTimePerWeek" label="Study Time Per Week" required>
              <Select
                options={[
                  { value: "<5h", label: "Below 5 hours" },
                  { value: "5-7h", label: "5 – 7 hours" },
                  { value: "8-10h", label: "8 – 10 hours" },
                  { value: "10h+", label: "10+ hours" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="focus" label="Focus" required>
              <Checkbox.Group
                options={[
                  "Listening",
                  "Reading",
                  "Vocabulary",
                  "Grammar",
                  "Test Strategy",
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="examGoal" label="Exam Goal" required>
              <TextArea rows={2} placeholder="Example: Graduate, Job application, Promotion..." />
            </Form.Item>
          </Col>
        </Row>

        {/* ===== Section 3 ===== */}
        <Divider orientation="left">3️⃣ Learning Style & Personal Info</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="learningStyle" label="Learning Style" required>
              <Checkbox.Group
                options={[
                  "Video lessons",
                  "Flashcards",
                  "Practice tests",
                  "AI conversation",
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="preferredStudyTime" label="Preferred Study Time" required>
              <Radio.Group>
                <Radio value="morning">Morning</Radio>
                <Radio value="afternoon">Afternoon</Radio>
                <Radio value="evening">Evening</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="studyPreference" label="Study Preference" required>
              <Radio.Group>
                <Radio value="online">Online</Radio>
                <Radio value="offline">Offline</Radio>
                <Radio value="hybrid">Hybrid</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="mentorSupportType" label="Mentor Support Type" required>
              <Radio.Group>
                <Radio value="ai">AI</Radio>
                <Radio value="mentor">Mentor</Radio>
                <Radio value="self">Self-study</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="occupation" label="Occupation" required>
              <Select
                options={[
                  { value: "student", label: "Student" },
                  { value: "office", label: "Office Worker" },
                  { value: "it", label: "IT" },
                  { value: "jobseeker", label: "Job Seeker" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="purpose" label="Purpose" required>
              <TextArea rows={3} placeholder="Why do you want to study TOEIC?" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SurveyModal;
