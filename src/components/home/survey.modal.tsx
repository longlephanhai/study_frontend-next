import { sendRequest } from "@/utils/api";
import { Form, Input, message, Modal } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const SurveyModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen } = props;

  const [form] = Form.useForm();

  const { data: session } = useSession();

  const router = useRouter();

  const handleOk = async (values: ISurvey) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/surveys`,
      method: "POST",
      body: values,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-survey'] }
      }
    })
    if (res && res.data) {
      setIsModalOpen(false);
      form.resetFields();
      message.success('Survey submitted successfully!');
      router.refresh();
    } else {
      message.error(res?.error || 'Submission failed. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  return (
    <>
      <Modal
        title="Khảo sát lộ trình học TOEIC"
        open={isModalOpen}
        onOk={(() => form.submit())}
        onCancel={handleCancel}
        maskClosable={false}
        okText="Submit"
        width={'60vw'}
      >
        <Form
          name="basic"
          layout="vertical"
          form={form}
          onFinish={handleOk}
        >
          <Form.Item<ISurvey>
            label="Toeic History "
            name="toeicHistory"
            rules={[{ required: true, message: 'Please input your Toeic History!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Reading Level"
            name="readingLevel"
            rules={[{ required: true, message: 'Please input your Reading Level!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Listening Level"
            name="listeningLevel"
            rules={[{ required: true, message: 'Please input your Listening Level!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Vocabulary Level"
            name="vocabularyLevel"
            rules={[{ required: true, message: 'Please input your Vocabulary Level!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Target Score"
            name="targetScore"
            rules={[{ required: true, message: 'Please input your Target Score!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Focus"
            name="focus"
            rules={[{ required: true, message: 'Please input your Focus!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Purpose"
            name="purpose"
            rules={[{ required: true, message: 'Please input your Purpose!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Study Time Per Day"
            name="studyTimePerDay"
            rules={[{ required: true, message: 'Please input your Study Time Per Day!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Study Time Per Week"
            name="studyTimePerWeek"
            rules={[{ required: true, message: 'Please input your Study Time Per Week!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Exam Goal"
            name="examGoal"
            rules={[{ required: true, message: 'Please input your Exam Goal!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Learning Style"
            name="learningStyle"
            rules={[{ required: true, message: 'Please input your Learning Style!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Study Preference"
            name="studyPreference"
            rules={[{ required: true, message: 'Please input your Study Preference!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Mentor Support Type"
            name="mentorSupportType"
            rules={[{ required: true, message: 'Please input your Mentor Support Type!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Occupation"
            name="occupation"
            rules={[{ required: true, message: 'Please input your Occupation!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ISurvey>
            label="Preferred Study Time"
            name="preferredStudyTime"
            rules={[{ required: true, message: 'Please input your Preferred Study Time!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default SurveyModal;;