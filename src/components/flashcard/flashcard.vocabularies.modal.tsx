import { Button, Card, Col, Form, GetProp, Image, Input, message, Modal, Row, Typography, UploadFile, UploadProps } from "antd";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { sendRequest, sendRequestFile } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  params?: { id: string };
}

const FlashCardVocabulariesModal = (props: IProps) => {

  const { data: session } = useSession();

  const { isModalOpen, setIsModalOpen, params } = props;

  const router = useRouter();

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {


    const res = await sendRequest<IBackendRes<IUploadFile>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flash-card/vocabularies/${params?.id}`,
      method: "POST",
      body: values.items,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['fetch-flashcard-vocabularies'] }
      }
    })
    if (res && res.data) {
      message.success(res.message || "Thêm từ vựng thành công!");
      setIsModalOpen(false);
      form.resetFields();
      router.refresh();
    } else {
      message.error(res.message || "Thêm từ vựng thất bại!");
    }
  }
  return (
    <>
      <Modal
        title="Flashcard Vocabularies"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        width={'80vh'}
      >
        <Form
          form={form}
          name="dynamic_form_complex"
          autoComplete="off"
          initialValues={{ items: [{}] }}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                {fields.map((field) => (
                  <Card
                    size="small"
                    title={`Vocabulary ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Vocabulary"
                          name={[field.name, 'vocabulary']}
                          required
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Meaning"
                          name={[field.name, 'meaning']}
                          required
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Pronunciation"
                          name={[field.name, 'pronunciation']}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Example"
                          name={[field.name, 'example']}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                  </Card>
                ))}

                <Button type="dashed" onClick={() => {
                  add();

                }} block>
                  + Add Item
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  )
}
export default FlashCardVocabulariesModal;