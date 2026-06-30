import { Col, Form, Input, Modal, Row } from "antd";

export function ModalCreateEvolution({
  showModal,
  setShowModal,
  createEvolutionInstance,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  createEvolutionInstance: any;
}) {
  const [form] = Form.useForm();

  const selectedClientId = import.meta.env.VITE_CLIENT_ID;

  const handleClose = () => {
    form.resetFields();
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    createEvolutionInstance({
      instanceName: values.name,
      number: values.phone,
      qrcode: true,
      clientId: selectedClientId,
    });

    handleClose();
  };

  return (
    <Modal
      open={showModal}
      title="Conectar conta"
      okText="Conectar"
      cancelText="Cancelar"
      onOk={handleSubmit}
      onCancel={handleClose}
      destroyOnHidden
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[
                {
                  required: true,
                  message: "Informe o nome",
                },
              ]}
            >
              <Input placeholder="Comercial" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="phone"
              label="Telefone"
              rules={[
                {
                  required: true,
                  message: "Informe o telefone",
                },
              ]}
            >
              <Input placeholder="5511999999999" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}