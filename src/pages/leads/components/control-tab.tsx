import { appSetting } from "@/constants/app-setting/config.const";
import type { ILeadCRMManagement } from "@/types/ILead.type";
import { AutoComplete, Button, Checkbox, Col, ConfigProvider, Divider, Form, Input, Row, Select, Typography } from "antd";
import type { FormInstance } from "antd";
import { useEffect } from "react";
import { DatePicker } from "antd";
import "dayjs/locale/pt-br";
type ContactHistoryForm = {
    attempt_number?: string;
    date?: string;
    channel?: string;
    consultant_name?: string;
    status?: string;
    note?: string;
    return?: string;
    future_return?: boolean;
    future_return_date?: string;
};

type ControlFormValues = {
    crm_management?: {
        operator_name?: string;
        transhipment_operator?: boolean;
        transhipment_operator_name?: string;
        input_at_operator?: {
            input?: string;
            note?: string;
        };
        debt_with_operator?: {
            debt_with_operator?: string;
            number_of_open_invoices?: string;
            debt_with_operator_amount?: string;
        };
        score_serasa?: string;
        score_boa_vista?: string;
        credit_analysis?: string;
        antifraude?: string;
        pap_availability?: string;
        operator_history?: {
            history?: boolean;
            description?: string;
        };
        lows_history?: {
            history?: boolean;
            amout_of_days?: string;
        };
        reregistration?: boolean;
        re_registration_info?: {
            document?: boolean;
            data?: unknown;
            note?: string;
        };
        submission_of_documents?: {
            is_submitted?: boolean;
            documents?: string[];
        };
        biometrics?: string;
        contract?: string;
        installation?: {
            installation?: string;
            scheduled_date?: string;
            rescheduled_date?: string;
            client_not_found_date?: string;
            notes?: string;
        };
        order_status?: string;
        sales_status?: string;
        consultant_name?: string;
        id_corp?: string;
        id_operator?: string;
        id_crm?: string;
        team?: string;
        contact_history?: ContactHistoryForm[];
    };
};

type ViewingEntity = {
    id: number;
    crm_management?: ILeadCRMManagement;
};

const operatorInputOptions = [
    { value: "nao_realizado", label: "Não realizado" },
    { value: "realizado_com_sucesso", label: "Realizado com sucesso" },
    { value: "registro_com_pendencias", label: "Registro com pendências" },
];

const debtOptions = [
    { value: "sem_registro", label: "Sem registro" },
    { value: "nao", label: "Não" },
    { value: "sim", label: "Sim" },
];



const creditAnalysisOptions = [
    { value: "sem_analise", label: "Sem análise" },
    { value: "aprovado", label: "Aprovado" },
    { value: "negado", label: "Negado" },
    { value: "em_analise", label: "Em análise" },
];

const antifraudeOptions = [
    { value: "sem_analise", label: "Sem análise" },
    { value: "ok", label: "OK" },
    { value: "reprovado", label: "Reprovado" },
];

const papAvailabilityOptions = [
    { value: "viavel", label: "Viável" },
    { value: "inviavel", label: "Inviável" },
    { value: "bloqueado", label: "Bloqueado" },
    { value: "outros", label: "Outros" },
];

const installationOptions = [
    { value: "nao_agendado", label: "Não agendado" },
    { value: "agendado", label: "Agendado" },
    { value: "reagendado", label: "Reagendado" },
    { value: "cliente_nao_encontrado", label: "Cliente não encontrado" },
    { value: "local_sem_viabilidade", label: "Sem viabilidade no local" },
    { value: "pendente", label: "Pendente" },
    { value: "cancelado", label: "Cancelado" },
];

const biometricsOptions = [
    { value: "ok", label: "OK" },
    { value: "pendente", label: "Pendente" },
    { value: "cancelado", label: "Cancelado" },
    { value: "dispensado", label: "Dispensado" },
];

const contractOptions = [
    { value: "pendente", label: "Pendente" },
    { value: "enviado", label: "Enviado" },
];

const contactChannelOptions = [
    { value: "ligação", label: "Ligação" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telegram", label: "Telegram" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "outro", label: "Outro" },
];

const documentOptions = [
    { value: "cpf", label: "CPF" },
    { value: "cnpj", label: "CNPJ" },
    { value: "rg", label: "RG" },
    { value: "comprovante_endereco", label: "Comprovante de endereço" },
    { value: "outros", label: "Outros" },
];

function SectionTitle({ children }: { children: string }) {
    return <Divider style={{ fontSize: 13, color: "#666" }}>{children}</Divider>;
}

function FieldLabel({ children }: { children: string }) {
    return <Typography.Text type="secondary">{children}</Typography.Text>;
}

function BooleanField({ name, label }: { name: (string | number)[]; label: string }) {
    return (
        <Form.Item name={name} valuePropName="checked" noStyle>
            <Checkbox>{label}</Checkbox>
        </Form.Item>
    );
}

export function OrderControlTab({
    viewingEntity,
    updateMutation,
    form,
}: {
    viewingEntity: ViewingEntity;
    updateMutation: { mutate: (variables: { id: number; payload: Record<string, unknown> }) => void };
    form: FormInstance<ControlFormValues>;
}) {
    useEffect(() => {
        const crm = viewingEntity.crm_management;
        if (!crm) return;

        form.setFieldsValue({
            crm_management: {
                operator_name: crm.operator_name,
                transhipment_operator: crm.transhipment_operator,
                transhipment_operator_name: crm.transhipment_operator_name,
                input_at_operator: crm.input_at_operator,
                debt_with_operator: crm.debt_with_operator,
                score_serasa: crm.score_serasa,
                score_boa_vista: crm.score_boa_vista,
                credit_analysis: crm.credit_analysis,
                antifraude: crm.antifraude,
                pap_availability: crm.pap_availability,
                operator_history: crm.operator_history,
                lows_history: crm.lows_history,
                reregistration: crm.reregistration,
                re_registration_info: crm.re_registration_info,
                submission_of_documents: crm.submission_of_documents,
                biometrics: crm.biometrics,
                contract: crm.contract,
                installation: crm.installation,
                order_status: crm.order_status,
                sales_status: crm.sales_status,
                consultant_name: crm.consultant_name,
                id_corp: crm.id_corp,
                id_operator: crm.id_operator,
                id_crm: crm.id_crm,
                team: crm.team,
                contact_history: crm.contact_history ?? [],
            },
        });
    }, [form, viewingEntity]);

    const handleFinish = (values: ControlFormValues) => {
        updateMutation.mutate({
            id: viewingEntity.id,
            payload: {
                crm_management: values.crm_management,
            },
        });
    };

    const color = appSetting.primaryColor;

    return (
        <Form form={form} onFinish={handleFinish} layout="vertical">
            <div className="max-h-90 overflow-y-auto scrollbar-thin flex flex-col gap-1">
                <ConfigProvider
                    theme={{
                        components: {
                            Select: { hoverBorderColor: color, activeBorderColor: color, activeOutlineColor: "none" },
                            Input: { hoverBorderColor: color, activeBorderColor: color },
                        },
                    }}
                >
                    <SectionTitle>Identificação</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>ID CRM</FieldLabel><Form.Item name={["crm_management", "id_crm"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>ID Operadora</FieldLabel><Form.Item name={["crm_management", "id_operator"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>

                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Nome da operadora</FieldLabel><Form.Item name={["crm_management", "operator_name"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>ID CORP</FieldLabel><Form.Item name={["crm_management", "id_corp"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>

                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Consultor</FieldLabel><Form.Item name={["crm_management", "consultant_name"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Equipe</FieldLabel><Form.Item name={["crm_management", "team"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>


                        </Row>
                    </div>

                    <SectionTitle>Operadora</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            {/* <Col span={6}><BooleanField name={["crm_management", "transhipment_operator"]} label="Transbordo na operadora" /></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Nome da operadora de transbordo</FieldLabel><Form.Item name={["crm_management", "transhipment_operator_name"]} noStyle><Input size="small" style={{ width: 260 }} /></Form.Item></span></Col> */}

                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Input na operadora</FieldLabel><Form.Item name={["crm_management", "input_at_operator", "input"]} noStyle><Select size="small" style={{ width: 220 }} allowClear options={operatorInputOptions} /></Form.Item></span></Col>
                            <Col span={16}><span className="flex flex-col gap-1"><FieldLabel>Observação do input</FieldLabel><Form.Item name={["crm_management", "input_at_operator", "note"]} noStyle><Input.TextArea rows={2} style={{ width: 540 }} /></Form.Item></span></Col>



                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Dívida com a operadora</FieldLabel><Form.Item name={["crm_management", "debt_with_operator", "debt_with_operator"]} noStyle><Select size="small" style={{ width: 220 }} allowClear options={debtOptions} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Faturas em aberto</FieldLabel><Form.Item name={["crm_management", "debt_with_operator", "number_of_open_invoices"]} noStyle><Input size="small" type="number" style={{ width: 180 }} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Valor total da dívida</FieldLabel><Form.Item name={["crm_management", "debt_with_operator", "debt_with_operator_amount"]} noStyle><Input size="small" style={{ width: 220 }} /></Form.Item></span></Col>

                            <Col span={8}><BooleanField name={["crm_management", "operator_history", "history"]} label="Histórico na operadora" /></Col>
                            <Col span={16}><span className="flex flex-col gap-1"><FieldLabel>Descrição do histórico</FieldLabel><Form.Item name={["crm_management", "operator_history", "description"]} noStyle><Input.TextArea rows={2} style={{ width: 540 }} /></Form.Item></span></Col>
                            <Col span={8}><BooleanField name={["crm_management", "lows_history", "history"]} label="Histórico de baixas" /></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Quantidade de dias</FieldLabel><Form.Item name={["crm_management", "lows_history", "amout_of_days"]} noStyle><Select size="small" style={{ width: 180 }} allowClear options={[{ value: "30", label: "30 dias" }, { value: "60", label: "60 dias" }, { value: "90", label: "90 dias" }, { value: "180", label: "180 dias" }, { value: "360", label: "360 dias" }]} /></Form.Item></span></Col>

                        </Row>
                    </div>

                    <SectionTitle>Análise de Crédito</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <span className="flex flex-col gap-1">
                                    <FieldLabel>Score SERASA</FieldLabel>

                                    <Form.Item
                                        name={["crm_management", "score_serasa"]}
                                        noStyle
                                        rules={[
                                            {
                                                validator: (_, value) => {
                                                    if (!value) return Promise.resolve();

                                                    if (
                                                        value === "sem-registro" ||
                                                        /^\d+$/.test(value)
                                                    ) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(
                                                        new Error("Informe 'sem-registro' ou uma pontuação numérica.")
                                                    );
                                                },
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            style={{ width: 200 }}
                                            size="small"
                                            options={[
                                                { value: "sem-registro", label: "Sem registro" },
                                            ]}
                                            placeholder="Ex.: 850 ou sem registro"
                                            filterOption
                                        />
                                    </Form.Item>
                                </span>
                            </Col>

                            <Col span={8}>
                                <span className="flex flex-col gap-1">
                                    <FieldLabel>Score Boa Vista</FieldLabel>

                                    <Form.Item
                                        name={["crm_management", "score_boa_vista"]}
                                        noStyle
                                        rules={[
                                            {
                                                validator: (_, value) => {
                                                    if (!value) return Promise.resolve();

                                                    if (
                                                        value === "sem-registro" ||
                                                        /^\d+$/.test(value)
                                                    ) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(
                                                        new Error("Informe 'sem-registro' ou uma pontuação numérica.")
                                                    );
                                                },
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            style={{ width: 200 }}
                                            size="small"
                                            options={[
                                                { value: "sem-registro", label: "Sem registro" },
                                            ]}
                                            placeholder="Ex.: 720 ou sem registro"
                                            filterOption
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Análise de crédito</FieldLabel><Form.Item name={["crm_management", "credit_analysis"]} noStyle><Select size="small" style={{ width: 200 }} allowClear options={creditAnalysisOptions} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Antifraude</FieldLabel><Form.Item name={["crm_management", "antifraude"]} noStyle><Select size="small" style={{ width: 200 }} allowClear options={antifraudeOptions} /></Form.Item></span></Col>
                            <Col span={8}><span className="flex flex-col gap-1"><FieldLabel>Disponibilidade PAP</FieldLabel><Form.Item name={["crm_management", "pap_availability"]} noStyle><Select size="small" style={{ width: 200 }} allowClear options={papAvailabilityOptions} /></Form.Item></span></Col>
                        </Row>
                    </div>

                    <SectionTitle>Documentos</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            {/* <Col span={6}><BooleanField name={["crm_management", "reregistration"]} label="Possui recadastro" /></Col>
                            <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Documento</FieldLabel><Form.Item name={["crm_management", "re_registration_info", "document"]} valuePropName="checked" noStyle><Checkbox>CPF/CNPJ</Checkbox></Form.Item></span></Col>
                            <Col span={12}><span className="flex flex-col gap-1"><FieldLabel>Dados do recadastro</FieldLabel><Typography.Text type="secondary" className="text-xs">Campo reservado para a estrutura livre do recadastro. Será tratado em um layout próprio.</Typography.Text></span></Col>
                            <Col span={12}><span className="flex flex-col gap-1"><FieldLabel>Observação do recadastro</FieldLabel><Form.Item name={["crm_management", "re_registration_info", "note"]} noStyle><Input.TextArea rows={1} style={{ width: 360 }} /></Form.Item></span></Col> */}
                            <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Envio de documentos</FieldLabel><Form.Item name={["crm_management", "submission_of_documents", "is_submitted"]} valuePropName="checked" noStyle><Checkbox>Documentos enviados</Checkbox></Form.Item></span></Col>
                            <Col span={18}><span className="flex flex-col gap-1"><FieldLabel>Quais documentos</FieldLabel><Form.Item name={["crm_management", "submission_of_documents", "documents"]} noStyle><Checkbox.Group options={documentOptions} /></Form.Item></span></Col>
                        </Row>
                    </div>

                    <SectionTitle>Contrato</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Biometria</FieldLabel><Form.Item name={["crm_management", "biometrics"]} noStyle><Select size="small" style={{ width: 180 }} allowClear options={biometricsOptions} /></Form.Item></span></Col>
                            <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Contrato</FieldLabel><Form.Item name={["crm_management", "contract"]} noStyle><Select size="small" style={{ width: 180 }} allowClear options={contractOptions} /></Form.Item></span></Col>
                        </Row>
                    </div>

                    <SectionTitle>Instalação</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Instalação</FieldLabel><Form.Item name={["crm_management", "installation", "installation"]} noStyle><Select size="small" style={{ width: 200 }} allowClear options={installationOptions} /></Form.Item></span></Col>
                            <Col span={6}>  <Form.Item
                                className="flex flex-col gap-2"
                                name={["crm_management", "installation", "scheduled_date"]}
                                noStyle
                            >
                                <FieldLabel>Data de Instalação</FieldLabel>
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    size="small"
                                    placeholder="Escolha uma data"
                                    style={{ width: 200, height: 25, marginTop: 4 }}
                                    showNow={false}
                                />
                            </Form.Item></Col>
                            <Col span={6}>  <Form.Item
                                className="flex flex-col gap-2"
                                name={["crm_management", "installation", "rescheduled_date"]}
                                noStyle
                            >
                                <FieldLabel>Data de Reagendamento</FieldLabel>
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    size="small"
                                    placeholder="Escolha uma data"
                                    style={{ width: 200, height: 25, marginTop: 4 }}
                                    showNow={false}
                                />
                            </Form.Item></Col>
                            <Col span={6}>  <Form.Item
                                className="flex flex-col gap-2"
                                name={["crm_management", "installation", "client_not_found_date"]}
                                noStyle
                            >
                                <FieldLabel>Cliente não encontrado</FieldLabel>
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    size="small"
                                    placeholder="Escolha uma data"
                                    style={{ width: 200, height: 25, marginTop: 4 }}
                                    showNow={false}
                                />
                            </Form.Item></Col>
                            <Col span={12}><span className="flex flex-col gap-1"><FieldLabel>Observações da instalação</FieldLabel><Form.Item name={["crm_management", "installation", "notes"]} noStyle><Input.TextArea rows={2} style={{ width: 430 }} /></Form.Item></span></Col>
                        </Row>
                    </div>

                    <SectionTitle>Histórico de Contato</SectionTitle>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Form.List name={["crm_management", "contact_history"]}>
                            {(fields, { add, remove }) => (
                                <div className="flex flex-col gap-3">
                                    <div><Button
                                        type="dashed"
                                        onClick={() => {
                                            const attempts =
                                                form.getFieldValue(["crm_management", "contact_history"]) || [];

                                            const nextAttempt =
                                                attempts.length === 0
                                                    ? 1
                                                    : Math.max(
                                                        ...attempts.map((a) => Number(a?.attempt_number) || 0)
                                                    ) + 1;

                                            add({
                                                attempt_number: String(nextAttempt),
                                            });
                                        }}
                                    >
                                        Adicionar tentativa
                                    </Button></div>
                                    {fields.map((field) => (
                                        <div key={field.key} className="rounded border border-neutral-200 bg-white p-3">
                                            <Row gutter={[16, 16]}>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <FieldLabel>Tentativa</FieldLabel>
                                                        <Form.Item name={[field.name, "attempt_number"]} noStyle>
                                                            <Input
                                                                size="small"
                                                                style={{ width: 180 }}
                                                                disabled
                                                            />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>  <Form.Item
                                                    className="flex flex-col gap-2"
                                                    name={[field.name, "date"]}
                                                    noStyle
                                                >
                                                    <FieldLabel>Data</FieldLabel>
                                                    <DatePicker
                                                        showTime
                                                        format="DD/MM/YYYY HH:mm"
                                                        size="small"
                                                        placeholder="Escolha uma data"
                                                        style={{ width: 200, height: 25, marginTop: 4 }}
                                                        showNow={false}
                                                    />
                                                </Form.Item></Col>


                                                <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Canal de atendimento</FieldLabel><Form.Item name={[field.name, "channel"]} noStyle><Select size="small" style={{ width: 200 }} options={contactChannelOptions} allowClear /></Form.Item></span></Col>
                                                <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Nome do consultor</FieldLabel><Form.Item name={[field.name, "consultant_name"]} noStyle><Input size="small" style={{ width: 200 }} /></Form.Item></span></Col>
                                                <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Status</FieldLabel><Form.Item name={[field.name, "status"]} noStyle><Select size="small" style={{ width: 200 }} allowClear options={[{ value: "atendido", label: "Atendido" }, { value: "nao_atendido", label: "Não atendido" }, { value: "sem_resposta", label: "Sem resposta" }]} /></Form.Item></span></Col>
                                                <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Resposta</FieldLabel><Form.Item name={[field.name, "return"]} noStyle><Select size="small" style={{ width: 200 }} allowClear options={[{ value: "positivo", label: "Positiva" }, { value: "negativo", label: "Negativa" }, { value: "neutro", label: "Neutra" }]} /></Form.Item></span></Col>

                                                <Col span={6}><span className="flex flex-col gap-1"><FieldLabel>Retorno futuro</FieldLabel><Form.Item name={[field.name, "future_return"]} valuePropName="checked" noStyle><Checkbox>Sim</Checkbox></Form.Item></span></Col>
                                                <Col span={6}>  <Form.Item
                                                    className="flex flex-col gap-2"
                                                    name={[field.name, "future_return_date"]}
                                                    noStyle
                                                >
                                                    <FieldLabel>Data do retorno futuro</FieldLabel>
                                                    <DatePicker
                                                        showTime
                                                        format="DD/MM/YYYY HH:mm"
                                                        size="small"
                                                        placeholder="Escolha uma data"
                                                        style={{ width: 200, height: 25, marginTop: 4 }}
                                                        showNow={false}
                                                    />
                                                </Form.Item></Col>
                                                <Col span={12}><span className="flex flex-col gap-1"><FieldLabel>Observação</FieldLabel><Form.Item name={[field.name, "note"]} noStyle><Input.TextArea rows={2} style={{ width: 430 }} /></Form.Item></span></Col>

                                                <Col span={24}><Button danger type="link" onClick={() => remove(field.name)}>Remover tentativa</Button></Col>

                                            </Row>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.List>
                    </div>
                </ConfigProvider>
            </div >
        </Form >
    );
}