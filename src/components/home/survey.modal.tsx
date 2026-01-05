import { sendRequest } from "@/utils/api";
import {
  Form,
  message,
  Modal,
  Select,
  Divider,
  Row,
  Col,
  Button,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Option } = Select;

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const SurveyModal = ({ isModalOpen, setIsModalOpen }: IProps) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await sendRequest<any>({
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
    } catch (error: any) {
      message.error(error?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="TOEIC Learning Path Survey"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading} // đây là nút sẽ hiển thị "loading"
        >
          {loading ? "AI đang tạo..." : "Submit"}
        </Button>,
      ]}
      width="70vw"
      maskClosable={false}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Current Level */}
        <Divider orientation="left">Current Level</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="toeicHistory" label="Toeic History" required>
              <Select placeholder="Select TOEIC history">
                <Option value="none">Never taken TOEIC</Option>
                <Option value="<300">Below 300</Option>
                <Option value="300-500">300 – 500</Option>
                <Option value="500-650">500 – 650</Option>
                <Option value="700+">Above 700</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="targetScore" label="Target Score" required>
              <Select placeholder="Select target score">
                <Option value="450">450+</Option>
                <Option value="600">600+</Option>
                <Option value="700">700+</Option>
                <Option value="750">750</Option>
                <Option value="800">800+</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="readingLevel" label="Reading Level" required>
              <Select placeholder="Select reading level">
                <Option value="Hiểu ý chính">Hiểu ý chính</Option>
                <Option value="Trung bình">Trung bình</Option>
                <Option value="Tốt">Tốt</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="listeningLevel" label="Listening Level" required>
              <Select placeholder="Select listening level">
                <Option value="Yếu">Yếu</Option>
                <Option value="Trung bình">Trung bình</Option>
                <Option value="Tốt">Tốt</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="vocabularyLevel" label="Vocabulary Level" required>
              <Select placeholder="Select vocabulary level">
                <Option value="Cơ bản">Cơ bản</Option>
                <Option value="Trung bình">Trung bình</Option>
                <Option value="Nâng cao">Nâng cao</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Goals & Study Time */}
        <Divider orientation="left">Goals & Study Time</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="studyTimePerDay" label="Study Time Per Day" required>
              <Select placeholder="Select study time per day">
                <Option value="30m">30 minutes</Option>
                <Option value="1h">1 hour</Option>
                <Option value="1–2 tiếng">1–2 tiếng</Option>
                <Option value="2h+">2+ hours</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="studyTimePerWeek" label="Study Time Per Week" required>
              <Select placeholder="Select study time per week">
                <Option value="<5h">Below 5 hours</Option>
                <Option value="5">5 hours</Option>
                <Option value="5-7h">5 – 7 hours</Option>
                <Option value="8-10h">8 – 10 hours</Option>
                <Option value="10h+">10+ hours</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="focus" label="Focus" required>
              <Select placeholder="Select focus">
                <Option value="Listening">Listening</Option>
                <Option value="Reading">Reading</Option>
                <Option value="Vocabulary">Vocabulary</Option>
                <Option value="Grammar">Grammar</Option>
                <Option value="Test Strategy">Test Strategy</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="examGoal" label="Exam Goal" required>
              <Select placeholder="Select exam goal">
                <Option value="1 tháng">1 tháng</Option>
                <Option value="2 tháng">2 tháng</Option>
                <Option value="3 tháng">3 tháng</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Learning Style & Personal Info */}
        <Divider orientation="left">Learning Style & Personal Info</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="learningStyle" label="Learning Style" required>
              <Select placeholder="Select learning style">
                <Option value="Video lessons">Video lessons</Option>
                <Option value="Flashcards">Flashcards</Option>
                <Option value="Practice tests">Practice tests</Option>
                <Option value="Làm test và xem giải thích">Làm test và xem giải thích</Option>
                <Option value="AI conversation">AI conversation</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="preferredStudyTime" label="Preferred Study Time" required>
              <Select placeholder="Select preferred study time">
                <Option value="Morning">Morning</Option>
                <Option value="Afternoon">Afternoon</Option>
                <Option value="Evening">Evening</Option>
                <Option value="Tối">Tối</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="studyPreference" label="Study Preference" required>
              <Select placeholder="Select study preference">
                <Option value="Online">Online</Option>
                <Option value="Offline">Offline</Option>
                <Option value="Hybrid">Hybrid</Option>
                <Option value="Có mentor gợi ý">Có mentor gợi ý</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mentorSupportType" label="Mentor Support Type" required>
              <Select placeholder="Select mentor support type">
                <Option value="AI">AI</Option>
                <Option value="Mentor">Mentor</Option>
                <Option value="Self-study">Self-study</Option>
                <Option value="Nhắc nhở nhẹ nhàng">Nhắc nhở nhẹ nhàng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="occupation" label="Occupation" required>
              <Select placeholder="Select occupation">
                <Option value="Student">Student</Option>
                <Option value="Office Worker">Office Worker</Option>
                <Option value="IT">IT</Option>
                <Option value="Job Seeker">Job Seeker</Option>
                <Option value="Sinh viên">Sinh viên</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="purpose" label="Purpose" required>
              <Select placeholder="Select purpose">
                <Option value="Graduate">Graduate</Option>
                <Option value="Job application">Job application</Option>
                <Option value="Promotion">Promotion</Option>
                <Option value="Xin việc">Xin việc</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SurveyModal;
