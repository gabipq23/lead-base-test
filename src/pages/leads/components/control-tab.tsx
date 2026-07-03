import { appSetting } from "@/constants/app-setting/config.const";
import { Button, Checkbox, Col, ConfigProvider, Divider, Form, Input, Row, Select, Typography } from "antd";
import type { FormInstance } from "antd";
import { useEffect } from "react";

type ControlFormValues = {
    consultor?: string;
    idCRM?: string;
    idCORP?: string;
    operadora?: string;
    team?: string;
    transbordar_operadora?: string;
    transbordar_operadora_qual?: string;
    pedido_operadora_status?: string;
    pedido_operadora_obs?: string;
    divida_operadora_status?: string;
    divida_operadora_faturas?: string;
    divida_operadora_total?: string;
    score_serasa_status?: string;
    score_serasa?: string;
    score_boa_vista_status?: string;
    score_boa_vista?: string;
    analise_credito?: string;
    antifraude?: string;
    viabilidade_pap?: string;
    viabilidade_pap_outros?: string;
    historico_operadora?: string;
    historico_operadora_descricao?: string;
    historico_baixa?: string;
    historico_baixa_prazos?: Array<"30" | "60" | "90" | "180" | "360">;
    recadastro?: string;
    recadastro_documento?: string;
    recadastro_dados?: string;
    recadastro_obs?: string;
    envio_documentos?: string;
    envio_documentos_quais?: string;
    biometrics?: string;
    contract?: string;
    installation?: string;
    installation_date?: string;
    installation_reschedule_date?: string;
    installation_not_found_date?: string;
    installation_local_sem_viabilidade_obs?: string;
    pedido?: string;
    status_venda?: string;
    id_operadora?: string;
    obs?: string;
    historico_contato?: Array<{
        datetime?: string;
        channel?: string;
        channel_other?: string;
        consultant_name?: string;
        status?: string;
        obs?: string;
        retorno?: string;
        retorno_futuro?: string;
        retorno_futuro_datetime?: string;
    }>;
};

type ViewingEntity = {
    id: number;
    responsible_consultant?: string | null;
    crm_id?: number | string | null;
    corporate_id?: string | null;
    operadora?: string | null;
    operator?: string | null;
    team?: string | null;
    transbordar_operadora?: string | null;
    transhipment?: boolean | null;
    transbordar_operadora_qual?: string | null;
    pedido_operadora_status?: string | null;
    pedido_operadora_obs?: string | null;
    divida_operadora_status?: string | null;
    debt_with_operator?: string | null;
    divida_operadora_faturas?: string | null;
    divida_operadora_total?: string | null;
    score_serasa_status?: string | null;
    score_serasa?: string | null;
    score_boa_vista_status?: string | null;
    score_boa_vista?: string | null;
    analise_credito?: string | null;
    credit?: string | null;
    antifraude?: string | null;
    viabilidade_pap?: string | null;
    viabilidade_pap_outros?: string | null;
    historico_operadora?: string | null;
    historico_operadora_descricao?: string | null;
    historico_baixa?: string | null;
    historico_baixa_prazos?: Array<"30" | "60" | "90" | "180" | "360">;
    recadastro?: string | null;
    re_registration?: boolean | null;
    recadastro_documento?: string | null;
    recadastro_dados?: string | null;
    recadastro_obs?: string | null;
    envio_documentos?: string | null;
    envio_documentos_quais?: string | null;
    biometrics?: string | null;
    contract?: string | null;
    installation?: string | null;
    installation_date?: string | null;
    installation_reschedule_date?: string | null;
    installation_not_found_date?: string | null;
    installation_local_sem_viabilidade_obs?: string | null;
    pedido?: string | null;
    status?: string | null;
    status_venda?: string | null;
    id_operadora?: string | null;
    operator_id?: string | null;
    obs?: string | null;
    historico_contato?: ControlFormValues["historico_contato"];
    contact_history?: ControlFormValues["historico_contato"];
};

const operadoraOptions = [
    { value: "tim", label: "TIM" },
    { value: "claro", label: "Claro" },
    { value: "vivo", label: "Vivo" },
    { value: "algar", label: "Algar" },
    { value: "brisanet", label: "Brisanet" },
    { value: "nio", label: "Nio" },
    { value: "vero", label: "Vero" },
    { value: "desktop", label: "Desktop" },
    { value: "vr", label: "VR" },
    { value: "c6", label: "C6" },
];

const yesNoOptions = [
    { value: "nao", label: "Não" },
    { value: "sim", label: "Sim" },
];

const trackingChannelOptions = [
    { value: "telefone", label: "Telefone" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telegram", label: "Telegram" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "rcs", label: "RCS" },
    { value: "direct", label: "Direct" },
    { value: "messenger", label: "Messenger" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "outro", label: "Outro" },
];

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
        if (!viewingEntity) return;
        form.setFieldsValue({
            consultor: viewingEntity.responsible_consultant || "",
            idCRM: viewingEntity.crm_id != null ? String(viewingEntity.crm_id) : "",
            idCORP: viewingEntity.corporate_id || "",
            operadora: viewingEntity.operadora ?? viewingEntity.operator ?? undefined,
            team: viewingEntity.team ?? undefined,
            transbordar_operadora: viewingEntity.transbordar_operadora ?? (viewingEntity.transhipment ? "sim" : undefined),
            transbordar_operadora_qual: viewingEntity.transbordar_operadora_qual ?? undefined,
            pedido_operadora_status: viewingEntity.pedido_operadora_status ?? undefined,
            pedido_operadora_obs: viewingEntity.pedido_operadora_obs ?? undefined,
            divida_operadora_status: viewingEntity.divida_operadora_status ?? viewingEntity.debt_with_operator ?? undefined,
            divida_operadora_faturas: viewingEntity.divida_operadora_faturas ?? undefined,
            divida_operadora_total: viewingEntity.divida_operadora_total ?? undefined,
            score_serasa_status: viewingEntity.score_serasa_status ?? undefined,
            score_serasa: viewingEntity.score_serasa ?? undefined,
            score_boa_vista_status: viewingEntity.score_boa_vista_status ?? undefined,
            score_boa_vista: viewingEntity.score_boa_vista ?? undefined,
            analise_credito: viewingEntity.analise_credito ?? viewingEntity.credit ?? undefined,
            antifraude: viewingEntity.antifraude ?? undefined,
            viabilidade_pap: viewingEntity.viabilidade_pap ?? undefined,
            viabilidade_pap_outros: viewingEntity.viabilidade_pap_outros ?? undefined,
            historico_operadora: viewingEntity.historico_operadora ?? undefined,
            historico_operadora_descricao: viewingEntity.historico_operadora_descricao ?? undefined,
            historico_baixa: viewingEntity.historico_baixa ?? undefined,
            historico_baixa_prazos: viewingEntity.historico_baixa_prazos ?? [],
            recadastro: viewingEntity.recadastro ?? (viewingEntity.re_registration ? "sim" : undefined),
            recadastro_documento: viewingEntity.recadastro_documento ?? undefined,
            recadastro_dados: viewingEntity.recadastro_dados ?? undefined,
            recadastro_obs: viewingEntity.recadastro_obs ?? undefined,
            envio_documentos: viewingEntity.envio_documentos ?? undefined,
            envio_documentos_quais: viewingEntity.envio_documentos_quais ?? undefined,
            biometrics: viewingEntity.biometrics ?? undefined,
            contract: viewingEntity.contract ?? undefined,
            installation: viewingEntity.installation ?? undefined,
            installation_date: viewingEntity.installation_date ?? undefined,
            installation_reschedule_date: viewingEntity.installation_reschedule_date ?? undefined,
            installation_not_found_date: viewingEntity.installation_not_found_date ?? undefined,
            installation_local_sem_viabilidade_obs: viewingEntity.installation_local_sem_viabilidade_obs ?? undefined,
            pedido: viewingEntity.pedido ?? viewingEntity.status ?? undefined,
            status_venda: viewingEntity.status_venda ?? undefined,
            id_operadora: viewingEntity.id_operadora ?? viewingEntity.operator_id ?? undefined,
            obs: viewingEntity.obs ?? undefined,
            historico_contato: viewingEntity.historico_contato ?? viewingEntity.contact_history ?? [],
        });
    }, [form, viewingEntity]);

    const handleFinish = (values: ControlFormValues) => {
        updateMutation.mutate({
            id: viewingEntity.id,
            payload: {
                responsible_consultant: values.consultor,
                corporate_id: values.idCORP,
                crm_id: values.idCRM,
                operadora: values.operadora,
                team: values.team,
                transbordar_operadora: values.transbordar_operadora,
                transbordar_operadora_qual: values.transbordar_operadora_qual,
                pedido_operadora_status: values.pedido_operadora_status,
                pedido_operadora_obs: values.pedido_operadora_obs,
                divida_operadora_status: values.divida_operadora_status,
                divida_operadora_faturas: values.divida_operadora_faturas,
                divida_operadora_total: values.divida_operadora_total,
                score_serasa_status: values.score_serasa_status,
                score_serasa: values.score_serasa,
                score_boa_vista_status: values.score_boa_vista_status,
                score_boa_vista: values.score_boa_vista,
                analise_credito: values.analise_credito,
                antifraude: values.antifraude,
                viabilidade_pap: values.viabilidade_pap,
                viabilidade_pap_outros: values.viabilidade_pap_outros,
                historico_operadora: values.historico_operadora,
                historico_operadora_descricao: values.historico_operadora_descricao,
                historico_baixa: values.historico_baixa,
                historico_baixa_prazos: values.historico_baixa_prazos,
                recadastro: values.recadastro,
                recadastro_documento: values.recadastro_documento,
                recadastro_dados: values.recadastro_dados,
                recadastro_obs: values.recadastro_obs,
                envio_documentos: values.envio_documentos,
                envio_documentos_quais: values.envio_documentos_quais,
                biometrics: values.biometrics,
                contract: values.contract,
                installation: values.installation,
                installation_date: values.installation_date,
                installation_reschedule_date: values.installation_reschedule_date,
                installation_not_found_date: values.installation_not_found_date,
                installation_local_sem_viabilidade_obs: values.installation_local_sem_viabilidade_obs,
                pedido: values.pedido,
                status_venda: values.status_venda,
                id_operadora: values.id_operadora,
                obs: values.obs,
                historico_contato: values.historico_contato,
                input_crm: values.pedido_operadora_status === "realizado_com_sucesso",
                availability_crm: values.pedido_operadora_status,
                debt_with_operator: values.divida_operadora_status,
                credit: values.analise_credito,
            },
        });
    };

    const color = appSetting.primaryColor;

    return (
        <Form form={form} onFinish={handleFinish}>
            <div className="max-h-90 overflow-y-auto scrollbar-thin flex flex-col gap-4 ">
                <ConfigProvider
                    theme={{
                        components: {
                            Select: { hoverBorderColor: color, activeBorderColor: color, activeOutlineColor: "none" },
                            Input: { hoverBorderColor: color, activeBorderColor: color },
                        },
                    }}
                >
                    <Divider style={{ fontSize: 13, color: "#666" }}>Informações Gerais</Divider>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={7}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Consultor</Typography.Text>
                                    <Form.Item name="consultant_name" noStyle>
                                        <Input size="small" style={{ width: 220 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">ID CORP</Typography.Text>
                                    <Form.Item name="idCORP" noStyle>
                                        <Input size="small" style={{ width: 160 }} maxLength={8} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={5}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">ID Operadora</Typography.Text>
                                    <Form.Item name="id_operadora" noStyle>
                                        <Input size="small" style={{ width: 160 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Equipe</Typography.Text>
                                    <Form.Item name="team" noStyle>
                                        <Select showSearch size="small" style={{ width: 200 }} options={[]} />
                                    </Form.Item>
                                </span>
                            </Col>
                        </Row>
                    </div>

                    <Divider style={{ fontSize: 13, color: "#666" }}>Operadora</Divider>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Transbordar operadora</Typography.Text>
                                    <Form.Item name="transbordar_operadora" noStyle>
                                        <Select size="small" style={{ width: 180 }} options={yesNoOptions} allowClear />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Qual operadora</Typography.Text>
                                    <Form.Item name="transbordar_operadora_qual" noStyle>
                                        <Select showSearch allowClear size="small" style={{ width: 200 }} options={operadoraOptions} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Pedido na operadora</Typography.Text>
                                    <Form.Item name="pedido_operadora_status" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 220 }}
                                            allowClear
                                            options={[
                                                { value: "nao_realizado", label: "Não realizado" },
                                                { value: "realizado_com_sucesso", label: "Realizado com sucesso" },
                                                { value: "registro_com_pendencias", label: "Registro com pendências" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Obs. pedido</Typography.Text>
                                    <Form.Item name="pedido_operadora_obs" noStyle>
                                        <Input.TextArea rows={1} style={{ width: 220 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Dívida operadora</Typography.Text>
                                    <Form.Item name="divida_operadora_status" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "sem_registro", label: "Sem registro" },
                                                { value: "nao", label: "Não" },
                                                { value: "sim", label: "Sim" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Nº de faturas</Typography.Text>
                                    <Form.Item name="divida_operadora_faturas" noStyle>
                                        <Input size="small" type="number" style={{ width: 180 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Total da dívida</Typography.Text>
                                    <Form.Item name="divida_operadora_total" noStyle>
                                        <Input size="small" style={{ width: 180 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Score SERASA</Typography.Text>
                                    <Form.Item name="score_serasa_status" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "sem_registro", label: "Sem registro" },
                                                { value: "score", label: "Score" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Score SERASA</Typography.Text>
                                    <Form.Item name="score_serasa" noStyle>
                                        <Input size="small" type="number" style={{ width: 180 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Score Boa Vista</Typography.Text>
                                    <Form.Item name="score_boa_vista_status" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "sem_registro", label: "Sem registro" },
                                                { value: "score", label: "Score" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Score Boa Vista</Typography.Text>
                                    <Form.Item name="score_boa_vista" noStyle>
                                        <Input size="small" type="number" style={{ width: 180 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                        </Row>
                    </div>

                    <Divider style={{ fontSize: 13, color: "#666" }}>Análise e Cadastro</Divider>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Análise de crédito</Typography.Text>
                                    <Form.Item name="analise_credito" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "sem_analise", label: "Sem análise" },
                                                { value: "aprovado", label: "Aprovado" },
                                                { value: "negado", label: "Negado" },
                                                { value: "em_analise", label: "Em análise" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Antifraude</Typography.Text>
                                    <Form.Item name="antifraude" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "sem_analise", label: "Sem análise" },
                                                { value: "ok", label: "OK" },
                                                { value: "reprovado", label: "Reprovado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Viabilidade PAP</Typography.Text>
                                    <Form.Item name="viabilidade_pap" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "viavel", label: "Viável" },
                                                { value: "inviavel", label: "Inviável" },
                                                { value: "bloqueado", label: "Bloqueado" },
                                                { value: "outros", label: "Outros" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Detalhe PAP</Typography.Text>
                                    <Form.Item name="viabilidade_pap_outros" noStyle>
                                        <Input size="small" style={{ width: 220 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Histórico na operadora</Typography.Text>
                                    <Form.Item name="historico_operadora" noStyle>
                                        <Select size="small" style={{ width: 180 }} options={yesNoOptions} allowClear />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={8}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Descrição do histórico</Typography.Text>
                                    <Form.Item name="historico_operadora_descricao" noStyle>
                                        <Input.TextArea rows={1} style={{ width: 260 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Histórico de baixa</Typography.Text>
                                    <Form.Item name="historico_baixa" noStyle>
                                        <Select size="small" style={{ width: 180 }} options={yesNoOptions} allowClear />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={12}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Períodos</Typography.Text>
                                    <Form.Item name="historico_baixa_prazos" noStyle>
                                        <Checkbox.Group
                                            options={[
                                                { value: "30", label: "30 dias" },
                                                { value: "60", label: "60 dias" },
                                                { value: "90", label: "90 dias" },
                                                { value: "180", label: "180 dias" },
                                                { value: "360", label: "360 dias" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Recadastro</Typography.Text>
                                    <Form.Item name="recadastro" noStyle>
                                        <Select size="small" style={{ width: 160 }} options={yesNoOptions} allowClear />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">CPF/CNPJ</Typography.Text>
                                    <Form.Item name="recadastro_documento" noStyle>
                                        <Input size="small" style={{ width: 180 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={8}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Dados do recadastro</Typography.Text>
                                    <Form.Item name="recadastro_dados" noStyle>
                                        <Input.TextArea rows={1} style={{ width: 260 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={8}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Obs. recadastro</Typography.Text>
                                    <Form.Item name="recadastro_obs" noStyle>
                                        <Input.TextArea rows={1} style={{ width: 260 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Envio de documentos</Typography.Text>
                                    <Form.Item name="envio_documentos" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "ok", label: "OK" },
                                                { value: "pendente", label: "Pendente" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={14}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Quais documentos</Typography.Text>
                                    <Form.Item name="envio_documentos_quais" noStyle>
                                        <Input.TextArea rows={1} style={{ width: 320 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                        </Row>
                    </div>

                    <Divider style={{ fontSize: 13, color: "#666" }}>CRM, Contrato e Instalação</Divider>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">ID CRM</Typography.Text>
                                    <Form.Item name="idCRM" noStyle>
                                        <Input size="small" style={{ width: 160 }} maxLength={8} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Biometria</Typography.Text>
                                    <Form.Item name="biometrics" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            allowClear
                                            options={[
                                                { value: "ok", label: "OK" },
                                                { value: "pendente", label: "Pendente" },
                                                { value: "cancelado", label: "Cancelado" },
                                                { value: "dispensado", label: "Dispensado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Contrato</Typography.Text>
                                    <Form.Item name="contract" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            options={[
                                                { value: "pendente", label: "Pendente" },
                                                { value: "enviado", label: "Enviado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Pedido</Typography.Text>
                                    <Form.Item name="pedido" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 180 }}
                                            options={[
                                                { value: "aberto", label: "Aberto" },
                                                { value: "fechado", label: "Fechado" },
                                                { value: "cancelado", label: "Cancelado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Status venda</Typography.Text>
                                    <Form.Item name="status_venda" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 220 }}
                                            options={[
                                                { value: "venda_realizada", label: "Venda realizada" },
                                                { value: "venda_nao_realizada", label: "Venda não realizada" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Instalação</Typography.Text>
                                    <Form.Item name="installation" noStyle>
                                        <Select
                                            size="small"
                                            style={{ width: 220 }}
                                            allowClear
                                            options={[
                                                { value: "nao_agendado", label: "Não agendado" },
                                                { value: "agendado", label: "Agendado" },
                                                { value: "reagendado", label: "Reagendado" },
                                                { value: "cliente_nao_encontrado", label: "Cliente não encontrado" },
                                                { value: "local_sem_viabilidade", label: "Local sem viabilidade" },
                                                { value: "pendente", label: "Pendente" },
                                                { value: "cancelado", label: "Cancelado" },
                                            ]}
                                        />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Data agendada</Typography.Text>
                                    <Form.Item name="installation_date" noStyle>
                                        <Input size="small" type="datetime-local" style={{ width: 220 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Data reagendada</Typography.Text>
                                    <Form.Item name="installation_reschedule_date" noStyle>
                                        <Input size="small" type="datetime-local" style={{ width: 220 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={6}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Cliente não encontrado</Typography.Text>
                                    <Form.Item name="installation_not_found_date" noStyle>
                                        <Input size="small" type="datetime-local" style={{ width: 220 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                            <Col span={8}>
                                <span className="flex flex-col gap-1">
                                    <Typography.Text type="secondary">Obs. local sem viabilidade</Typography.Text>
                                    <Form.Item name="installation_local_sem_viabilidade_obs" noStyle>
                                        <Input.TextArea rows={1} style={{ width: 260 }} />
                                    </Form.Item>
                                </span>
                            </Col>
                        </Row>
                    </div>

                    <Divider style={{ fontSize: 13, color: "#666" }}>Histórico de Contato</Divider>
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Form.List name="historico_contato">
                            {(fields, { add, remove }) => (
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <Button type="dashed" onClick={() => add()}>
                                            Adicionar tentativa
                                        </Button>
                                    </div>
                                    {fields.map((field, index) => (
                                        <div key={field.key} className="rounded border border-neutral-200 bg-white p-3">
                                            <Row gutter={[16, 16]}>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Tentativa {index + 1}</Typography.Text>
                                                        <Form.Item name={[field.name, "datetime"]} noStyle>
                                                            <Input size="small" type="datetime-local" style={{ width: 220 }} />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Canal de atendimento</Typography.Text>
                                                        <Form.Item name={[field.name, "channel"]} noStyle>
                                                            <Select size="small" style={{ width: 220 }} options={trackingChannelOptions} allowClear />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Outro canal</Typography.Text>
                                                        <Form.Item name={[field.name, "channel_other"]} noStyle>
                                                            <Input size="small" style={{ width: 220 }} />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Nome consultor</Typography.Text>
                                                        <Form.Item name={[field.name, "consultant_name"]} noStyle>
                                                            <Input size="small" style={{ width: 220 }} />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Status</Typography.Text>
                                                        <Form.Item name={[field.name, "status"]} noStyle>
                                                            <Select
                                                                size="small"
                                                                style={{ width: 180 }}
                                                                options={[
                                                                    { value: "atendido", label: "Atendido" },
                                                                    { value: "nao_atendido", label: "Não atendido" },
                                                                    { value: "sem_resposta", label: "Sem resposta" },
                                                                ]}
                                                                allowClear
                                                            />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={8}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">OBS</Typography.Text>
                                                        <Form.Item name={[field.name, "obs"]} noStyle>
                                                            <Input.TextArea rows={1} style={{ width: 260 }} />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Retorno</Typography.Text>
                                                        <Form.Item name={[field.name, "retorno"]} noStyle>
                                                            <Select
                                                                size="small"
                                                                style={{ width: 180 }}
                                                                options={[
                                                                    { value: "positivo", label: "Positivo" },
                                                                    { value: "negativo", label: "Negativo" },
                                                                    { value: "neutro", label: "Neutro" },
                                                                ]}
                                                                allowClear
                                                            />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Retorno futuro</Typography.Text>
                                                        <Form.Item name={[field.name, "retorno_futuro"]} noStyle>
                                                            <Select size="small" style={{ width: 160 }} options={yesNoOptions} allowClear />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={6}>
                                                    <span className="flex flex-col gap-1">
                                                        <Typography.Text type="secondary">Data/hora retorno</Typography.Text>
                                                        <Form.Item name={[field.name, "retorno_futuro_datetime"]} noStyle>
                                                            <Input size="small" type="datetime-local" style={{ width: 220 }} />
                                                        </Form.Item>
                                                    </span>
                                                </Col>
                                                <Col span={24}>
                                                    <Button danger type="link" onClick={() => remove(field.name)}>
                                                        Remover tentativa
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.List>
                    </div>



                </ConfigProvider>
            </div>
        </Form>
    );
}