import { useEffect } from "react";
import { Form, Input, Modal, Select, Row, Col, Switch, Typography, InputNumber } from "antd";
import {
    useCreateEntity,
    useUpdateEntity,
    entityPage,
    type EntityType,
    type FormValues,
    triggerTypeOptions,
} from "../config-page.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";

interface FormModalProps {
    open: boolean;
    editingEntity: EntityType | null;
    onClose: () => void;
}

export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
    const [form] = Form.useForm<FormValues>();
    const createMutation = useCreateEntity();
    const updateMutation = useUpdateEntity();
    const { isGlobalAdmin } = useAuth();
    const { selectedCompanyId: adminCompanyId, selectedPartnerId: adminPartnerId } = useAdminScope();

    const isEditing = !!editingEntity;
    const isPending = createMutation.isPending || updateMutation.isPending;

    const selectedCompanyId = Form.useWatch("company_id", form);

    const companyOptions = useCompanyQuery({ enabled: isGlobalAdmin }).data?.companies.map((c) => ({
        label: c.company_name,
        value: c.company_id,
    })) ?? [];

    const partnerOptions = usePartnerQuery({ enabled: isGlobalAdmin }).data?.partners
        .filter((p) => String(p.company_id) === String(selectedCompanyId))
        .map((p) => ({
            label: p.partner_name,
            value: p.partner_id,
        })) ?? [];

    useEffect(() => {
        if (open && editingEntity) {
            form.setFieldsValue({
                type: editingEntity.type,
                enabled: editingEntity.enabled,
                delay_minutes: editingEntity.delay_minutes,
                message: editingEntity.message,
                company_id: editingEntity.company_id ?? undefined,
                partner_id: editingEntity.partner_id ?? undefined,
            });
        } else if (open) {
            form.resetFields();
            form.setFieldsValue({ enabled: true });

            if (isGlobalAdmin) {
                form.setFieldsValue({
                    company_id: adminCompanyId,
                    partner_id: adminPartnerId,
                });
            }
        }
    }, [open, editingEntity, form, isGlobalAdmin, adminCompanyId, adminPartnerId]);

    async function handleSubmit() {
        const values = await form.validateFields();

        if (isEditing && editingEntity) {
            updateMutation.mutate(
                {
                    id: editingEntity.id,
                    type: values.type,
                    enabled: values.enabled,
                    delay_minutes: values.delay_minutes,
                    message: values.message,
                },
                { onSuccess: onClose }
            );
        } else {
            const payload: FormValues = {
                type: values.type,
                enabled: values.enabled,
                delay_minutes: values.delay_minutes,
                message: values.message,
                ...(isGlobalAdmin
                    ? { company_id: values.company_id, partner_id: values.partner_id }
                    : {}),
            };

            createMutation.mutate(payload, { onSuccess: onClose });
        }
    }
    return (
        <Modal
            open={open}
            title={isEditing ? `Editar ${entityPage.name}` : `Novo ${entityPage.name}`}
            okText={isEditing ? "Salvar" : "Criar"}
            cancelText="Cancelar"
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={isPending}
            destroyOnHidden
            width={700}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>

                {/* company e partner só aparecem para ADMIN e só no create */}
                {isGlobalAdmin && !isEditing && (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="company_id"
                                label="Empresa"
                                rules={[{ required: true, message: "Selecione a empresa" }]}
                            >
                                <Select
                                    placeholder="Selecione..."
                                    options={companyOptions}
                                    onChange={() => form.setFieldValue("partner_id", undefined)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="partner_id"
                                label="Parceiro"
                                rules={[{ required: true, message: "Selecione o parceiro" }]}
                            >
                                <Select
                                    placeholder={selectedCompanyId ? "Selecione..." : "Selecione uma empresa primeiro"}
                                    options={partnerOptions}
                                    disabled={!selectedCompanyId}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item
                            name="type"
                            label="Tipo de Evento"
                            rules={[{ required: true, message: "Selecione o tipo de evento" }]}
                        >
                            <Select
                                placeholder="Selecione..."
                                options={triggerTypeOptions}
                                disabled={isEditing}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="delay_minutes"
                            label="Delay (minutos)"
                            rules={[{ required: true, message: "Informe o delay" }]}
                        >
                            <InputNumber min={0} placeholder="Ex: 10" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="message"
                            label="Mensagem"
                            rules={[{ required: true, message: "Informe a mensagem" }]}
                            extra={
                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                    Variáveis disponíveis:{" "}
                                    <Typography.Text style={{ fontSize: 11 }} code>@selectedBotName</Typography.Text>,{" "}
                                    <Typography.Text style={{ fontSize: 11 }} code>@context</Typography.Text> e{" "}
                                    <Typography.Text style={{ fontSize: 11 }} code>@consultantName</Typography.Text>.
                                    {" "}Utilize apenas essas variáveis no texto.
                                </Typography.Text>
                            }
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Ex: Sou a @selectedBotName, consultora responsável na @context. Meu nome é @consultantName."
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="enabled" label="Status" valuePropName="checked">
                            <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Modal>
    );
}