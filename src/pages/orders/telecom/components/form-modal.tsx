import { useEffect, useMemo } from "react";
import { Form, Input, Row, Col, Select, DatePicker } from "antd";
import dayjs from "dayjs"

import { entityPage, useUpdateEntity, type EntityType, type TelecomFormValues } from "../../config-page.const";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import type { OrderPriceSummary } from "@/types/orders/base.type";
import { OrderModalSection } from "../../common/components/order-modal-section";

function toValidDayjs(value?: string | null) {
    if (!value) return undefined;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : undefined;
}
function toNumber(value?: number | string | null) {
    if (value === null || value === undefined || value === "") return 0;
    return Number(value);
}


interface FormModalProps {
    open: boolean;
    editingEntity: EntityType | null;
    onClose: () => void;
}

export function FormModal({ open, editingEntity, onClose }: FormModalProps) {
    const [form] = Form.useForm<TelecomFormValues>();
    const clientType = editingEntity?.client_type;
    const isPJ = clientType === "PJ";
    const updateMutation = useUpdateEntity();
    const isEditing = !!editingEntity;
    const isPending = updateMutation.isPending;
    const selectedPropertyType = Form.useWatch(
        ["address_complement", "building_or_house"],
        form,
    ) || "house";

    const computedPriceSummary = useMemo<OrderPriceSummary>(() => {
        const planPrice = 100
        const originalPrice = 50
        const extrasPrice = 150

        return {
            plan_price: planPrice,
            extras_price: extrasPrice,
            total_monthly: planPrice + extrasPrice,
            ...(originalPrice != null ? { original_price: toNumber(originalPrice) } : {}),
        };
    }, []);


    useEffect(() => {
        if (open && editingEntity) {
            const addressComplement = {
                lot: editingEntity.address_complement?.lot ?? null,
                block: editingEntity.address_complement?.block ?? null,
                floor: editingEntity.address_complement?.floor ?? null,
                square: editingEntity.address_complement?.square ?? null,
                unit_type: editingEntity.address_complement?.unit_type ?? null,
                unit_number: editingEntity.address_complement?.unit_number ?? null,
                home_complement: editingEntity.address_complement?.home_complement ?? null,
                reference_point:
                    editingEntity.address_complement?.reference_point ??

                    null,
                building_or_house: editingEntity.address_complement?.building_or_house ?? "house",
            };

            form.setFieldsValue({
                plan_id: editingEntity.plan?.id != null ? String(editingEntity.plan.id) : undefined,
                installation_preferred_date_one: toValidDayjs(editingEntity.installation_preferred_date_one),
                installation_preferred_date_two: toValidDayjs(editingEntity.installation_preferred_date_two),
                installation_preferred_date_three: toValidDayjs(editingEntity.installation_preferred_date_three),

                installation_preferred_period_one:
                    editingEntity.installation_preferred_period_one ?? undefined,

                installation_preferred_period_two:
                    editingEntity.installation_preferred_period_two ?? undefined,

                installation_preferred_period_three:
                    editingEntity.installation_preferred_period_three ?? undefined,

                full_name: isPJ
                    ? editingEntity.manager?.name
                    : editingEntity.full_name,

                cpf: isPJ
                    ? editingEntity.manager?.cpf
                    : editingEntity.cpf,

                birth_date: isPJ
                    ? editingEntity.manager?.birth_date
                    : editingEntity.birth_date,

                email: isPJ
                    ? editingEntity.manager?.email
                    : editingEntity.email,

                mother_full_name: isPJ
                    ? editingEntity.manager?.mother_full_name
                    : editingEntity.mother_full_name,

                rg: isPJ
                    ? editingEntity.manager?.rg
                    : editingEntity.rg,
                phone: isPJ
                    ? editingEntity.manager?.phone
                    : editingEntity.phone,

                additional_phone: editingEntity.additional_phone ?? undefined,
                address: editingEntity.address ?? undefined,
                address_number: editingEntity.address_number ?? undefined,
                district: editingEntity.district ?? undefined,
                city: editingEntity.city ?? undefined,
                state: editingEntity.state ?? undefined,
                zip_code: editingEntity.zip_code ?? undefined,
                single_zip_code:
                    editingEntity.single_zip_code === null || editingEntity.single_zip_code === undefined
                        ? undefined
                        : Boolean(editingEntity.single_zip_code),
                consultant_observation: editingEntity.consultant_observation ?? undefined,
                selected_extras:
                    editingEntity.selected_extras?.map((extra) => extra.id) ?? undefined,
                cnpj: editingEntity.cnpj || "",
                due_day:
                    typeof editingEntity.due_day === "number"
                        ? String(editingEntity.due_day)
                        : String(editingEntity.due_day || "") || undefined,
                availability_pap:
                    editingEntity.availability_pap === null || editingEntity.availability_pap === undefined
                        ? undefined
                        : Boolean(editingEntity.availability_pap),
                address_complement: addressComplement,
            });
        } else if (open) {
            form.resetFields();
        }
    }, [open, editingEntity, form]);

    async function handleSubmit() {
        const values = await form.validateFields();

        if (isEditing && editingEntity) {
            const installationPreferredDateOne = dayjs.isDayjs(values.installation_preferred_date_one)
                ? values.installation_preferred_date_one.format("YYYY-MM-DD")
                : values.installation_preferred_date_one ?? null;
            const installationPreferredDateTwo = dayjs.isDayjs(values.installation_preferred_date_two)
                ? values.installation_preferred_date_two.format("YYYY-MM-DD")
                : values.installation_preferred_date_two ?? null;
            const installationPreferredDateThree = dayjs.isDayjs(values.installation_preferred_date_three)
                ? values.installation_preferred_date_three.format("YYYY-MM-DD")
                : values.installation_preferred_date_three ?? null;

            const normalizedAddressComplement = {
                lot: values.address_complement?.lot ?? null,
                block: values.address_complement?.block ?? null,
                floor: values.address_complement?.floor ?? null,
                square: values.address_complement?.square ?? null,
                unit_type: values.address_complement?.unit_type ?? null,
                unit_number: values.address_complement?.unit_number ?? null,
                home_complement: values.address_complement?.home_complement ?? null,
                reference_point: values.address_complement?.reference_point ?? null,
                building_or_house: values.address_complement?.building_or_house ?? "house",
            };

            updateMutation.mutate(
                {
                    id: editingEntity.id,
                    payload: {
                        ...values,

                        price_summary: computedPriceSummary,
                        installation_preferred_date_one: installationPreferredDateOne,
                        installation_preferred_date_two: installationPreferredDateTwo,
                        installation_preferred_date_three: installationPreferredDateThree,
                        cnpj: values.cnpj ?? null,
                        due_day: values.due_day ?? null,
                        address_complement: normalizedAddressComplement,
                        address_floor: normalizedAddressComplement.floor,
                        address_lot: normalizedAddressComplement.lot,
                        address_block: normalizedAddressComplement.square,
                        address_reference_point: normalizedAddressComplement.reference_point,
                    },
                },
                { onSuccess: onClose },
            );
        }
    }

    return (
        <OrderModalShell
            open={open}
            title={isEditing ? `Editar ${entityPage.name}` : `Novo ${entityPage.name}`}
            okText={isEditing ? "Salvar" : "Criar"}
            cancelText="Cancelar"
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={isPending}
            destroyOnHidden
            width={1100}
        >
            <Form form={form} layout="vertical" className="max-h-110 overflow-y-auto scrollbar-thin mt-2">
                <OrderModalSection title="Detalhes do Plano">
                    <div className="flex flex-col bg-neutral-100 mb-3 rounded-sm p-3 px-1">

                        <div className="mt-4 flex w-full flex-col text-neutral-700">
                            <div className="flex items-center px-2 justify-between font-semibold text-[#666666] text-[14px]">
                                <p className="w-60 text-center">Plano</p>
                                <p className="w-28 text-center">Data Instalação 1</p>
                                <p className="w-20 text-center">Período 1</p>
                                <p className="w-28 text-center">Data Instalação 2</p>
                                <p className="w-20 text-center">Período 2</p>
                                <p className="w-28 text-center">Data Instalação 3</p>
                                <p className="w-20 text-center">Período 3</p>
                                <p className="w-20 text-center">Vencimento</p>
                            </div>
                            <hr className="border-t border-neutral-300" />

                            <div className="flex px-2 items-center justify-between gap-4 py-4 pb-0 text-[14px]">


                                <div className="w-28 flex justify-center">
                                    <Form.Item name="installation_preferred_date_one" className="mb-0">
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            placeholder="Data 1"
                                            className="min-w-28 text-center"
                                            size="small"
                                            allowClear
                                        />
                                    </Form.Item>
                                </div>

                                <div className="w-20 flex justify-center">
                                    <Form.Item name="installation_preferred_period_one" className="mb-0">
                                        <Select
                                            size="small"
                                            placeholder="Período 1"
                                            className="min-w-22"
                                            options={[
                                                { label: "MANHÃ", value: "MANHA" },
                                                { label: "TARDE", value: "TARDE" },
                                                { label: "NOITE", value: "NOITE" },
                                            ]}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="w-28 flex justify-center">
                                    <Form.Item name="installation_preferred_date_two" className="mb-0">
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            placeholder="Data 2"
                                            className="min-w-28 text-center"
                                            size="small"
                                            allowClear
                                        />
                                    </Form.Item>
                                </div>

                                <div className="w-20 flex justify-center">
                                    <Form.Item name="installation_preferred_period_two" className="mb-0">
                                        <Select
                                            size="small"
                                            placeholder="Período 2"
                                            className="min-w-22"
                                            options={[
                                                { label: "MANHÃ", value: "MANHA" },
                                                { label: "TARDE", value: "TARDE" },
                                                { label: "NOITE", value: "NOITE" },
                                            ]}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="w-28 flex justify-center">
                                    <Form.Item name="installation_preferred_date_three" className="mb-0">
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            placeholder="Data 3"
                                            className="min-w-28 text-center"
                                            size="small"
                                            allowClear
                                        />
                                    </Form.Item>
                                </div>

                                <div className="w-20 flex justify-center">
                                    <Form.Item name="installation_preferred_period_three" className="mb-0">
                                        <Select
                                            size="small"
                                            placeholder="Período 3"
                                            className="min-w-22"
                                            options={[
                                                { label: "MANHÃ", value: "MANHA" },
                                                { label: "TARDE", value: "TARDE" },
                                                { label: "NOITE", value: "NOITE" },
                                            ]}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="w-20 flex justify-center">
                                    <Form.Item name="due_day" className="mb-0">
                                        <Select
                                            size="small"
                                            placeholder="Dia"
                                            className="min-w-16"
                                            showSearch
                                            options={Array.from({ length: 31 }, (_, index) => ({
                                                label: String(index + 1),
                                                value: String(index + 1),
                                            }))}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <hr className="border-t border-neutral-300 mx-2" />
                        </div>

                    </div>
                </OrderModalSection>

                <OrderModalSection title="Informações de Pagamento">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="payment_method" label="Método de Pagamento">
                                <Input placeholder="Método de Pagamento" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bank_name" label="Nome do Banco">
                                <Input placeholder="Nome do Banco" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bank_branch" label="Agência">
                                <Input placeholder="Agência" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="bank_account_number" label="Número da Conta">
                                <Input placeholder="Número da Conta" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bank_account_holder_name" label="Titular da Conta">
                                <Input placeholder="Titular da Conta" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bank_account_holder_cpf" label="CPF do Titular">
                                <Input placeholder="CPF do Titular" />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Disponibilidade">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="availability_pap" label="Disponibilidade PAP">
                                <Select
                                    allowClear
                                    placeholder="Selecione"
                                    options={[
                                        { label: "Disponível", value: true },
                                        { label: "Indisponível", value: false },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Informações do Cliente">
                    {isPJ && (
                        <>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="company_legal_name"
                                        label="Razão Social"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="cnpj"
                                        label="CNPJ"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="full_name" label="Nome completo">
                                <Input placeholder="Nome completo" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="cpf" label="CPF">
                                <Input placeholder="000.000.000-00" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={["rg", "number"]}
                                label="Número RG"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="birth_date" label="Data de nascimento">
                                <Input placeholder="DD/MM/AAAA" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Email inválido" }]}>
                                <Input placeholder="exemplo@email.com" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="mother_full_name" label="Nome da mãe">
                                <Input placeholder="Nome da mãe" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="phone" label="Telefone">
                                <Input placeholder="(00) 00000-0000" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="additional_phone" label="Telefone adicional">
                                <Input placeholder="(00) 00000-0000" />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Endereço">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="address" label="Endereço">
                                <Input placeholder="Endereço" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="address_number" label="Número">
                                <Input placeholder="Número" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "building_or_house"]} label="Tipo">
                                <Select
                                    placeholder="Tipo"
                                    options={[
                                        { label: "Casa", value: "house" },
                                        { label: "Edifício", value: "building" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            {selectedPropertyType === "house" ? (
                                <Form.Item name={["address_complement", "home_complement"]} label="Complemento">
                                    <Input placeholder="Complemento" />
                                </Form.Item>
                            ) : (
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item name={["address_complement", "unit_type"]} label="Tipo da unidade">
                                            <Select
                                                placeholder="Unidade"
                                                options={[
                                                    { label: "Apartamento", value: "apto" },
                                                    { label: "Sala", value: "sala" },
                                                    { label: "Conjunto", value: "conjunto" },
                                                    { label: "Loja", value: "loja" },
                                                    { label: "Outros", value: "outros" },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name={["address_complement", "unit_number"]} label="Número da unidade">
                                            <Input placeholder="Ex: 1203" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "floor"]} label="Andar">
                                <Input placeholder="Andar" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "lot"]} label="Lote">
                                <Input placeholder="Lote" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name={["address_complement", "square"]} label="Quadra">
                                <Input placeholder="Quadra" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name={["address_complement", "reference_point"]} label="Ponto de referência">
                                <Input placeholder="Ponto de referência" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="single_zip_code" label="CEP único">
                                <Select
                                    allowClear
                                    placeholder="Selecione"
                                    options={[
                                        { label: "Sim", value: true },
                                        { label: "Não", value: false },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="district" label="Bairro">
                                <Input placeholder="Bairro" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="city" label="Cidade">
                                <Input placeholder="Cidade" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="state" label="UF">
                                <Input placeholder="UF" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="zip_code" label="CEP">
                                <Input placeholder="CEP" />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Observação do Consultor">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="consultant_observation">
                                <Input.TextArea rows={3} placeholder="Adicione aqui uma observação sobre esse pedido..." />
                            </Form.Item>
                        </Col>
                    </Row>
                </OrderModalSection>
            </Form>
        </OrderModalShell>
    );
}
