import { sendRequest } from "@/utils/api";
import { Form, Input, message, Modal } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const FlashCardModal = (props: IProps) => {

  const { isModalOpen, setIsModalOpen } = props;

  const router = useRouter();

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const {data: session} = useSession();
  
  const [form] = Form.useForm();

  const onFinish = async (value: IFlashCard) => {
    const res = await sendRequest<IBackendRes<IFlashCard>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flash-card`,
      method: "POST",
      body: value,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-flashcard'] }
      }
    })
    if(res && res.data){
      message.success("Flashcard created successfully");
      setIsModalOpen(false);
      form.resetFields();
      router.refresh();
    } else{
      message.error(res.message || "Failed to create flashcard");
    }
  }
  return (
    <Modal
      title="Create New Flashcard"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={()=>form.submit()}
      onCancel={handleCancel}
      okText="Create"
      maskClosable={false}
    >
      <Form
        name="basic"
        form={form}
        style={{ maxWidth: 600 }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item<IFlashCard>
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input title!' }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item<IFlashCard>
          label="Title"
          name="description"
          rules={[{ required: true, message: 'Please input description!' }]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FlashCardModal;