import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

interface Props {
    open: boolean;
    partner: any;
    editingEntity: any;
    onClose: () => void;
    onCreate: (v: any) => void;
    onUpdate: (v: any) => void;
}

export function FormModal({
    open,
    partner,
    editingEntity,
    onClose,
    onCreate,
}: Props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingEntity) {
            form.setFieldsValue(editingEntity);
        } else {
            form.resetFields();
        }
    }, [editingEntity]);

    function handleSubmit(values: any) {
        const payload = {
            partner_id: partner?.partner_id,
            company_id: partner?.company?.company_id,
            service_name: values.service_name,
            price: values.price,
        };

        onCreate(payload);
        onClose();
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            title={editingEntity ? "Editar Preço" : "Novo Preço"}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="service_name"
                    label="Nome do Serviço"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Preço"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

            </Form>
        </Modal>
    );
}