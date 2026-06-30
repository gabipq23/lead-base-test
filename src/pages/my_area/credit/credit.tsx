import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Upload,
    message,
    type UploadFile,
    type TableColumnsType,
    Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { appSetting } from "@/constants/app-setting/config.const";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import type { CreditRequestItem } from "@/services/credit.service";
import { useStyle } from "@/style/tableStyle";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useCreateCreditRequestMutation } from "@/hooks/credit/useCreateCreditMutation";
import { useUpdateCreditRequestPaymentMutation } from "@/hooks/credit/useUpdatePaymentCreditMutation";
import { useUpdateCreditRequestStatusMutation } from "@/hooks/credit/useUpdateStatusCreditMutation";
import { useCreditRequestsQuery } from "@/hooks/credit/useCreditQuery";
import { useAddPartnerBonusMutation } from "@/hooks/partners/userAddPartnerBonusMutation";

type CreditStatus = "PENDENTE" | "APROVADO" | "CANCELADO";
type PaymentType = "PIX" | "BOLETO";

type CreditRequest = CreditRequestItem;

const EMPTY_REQUESTS: CreditRequest[] = [];

type CreditFormValues = {
    value: string;
    paymentType: PaymentType;
};

type PaymentFormValues = {
    paymentCode: string;
};

type BonusFormValues = {
    amount: number;
    description: string;
};

function readFileAsBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== "string") {
                reject(new Error("Arquivo inválido"));
                return;
            }

            resolve(result.split(",")[1] ?? "");
        };

        reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
        reader.readAsDataURL(file);
    });
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function parseCurrency(value: string) {
    const normalized = value.replace(/[R$\s.]/g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
}


export function CreditPage(): JSX.Element {
    const [form] = Form.useForm<CreditFormValues>();
    const [paymentForm] = Form.useForm<PaymentFormValues>();
    const [bonusForm] = Form.useForm<BonusFormValues>();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isBonusOpen, setIsBonusOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(null);
    const isPix = selectedRequest?.type_of_payment === "pix";
    const [requestToCancel, setRequestToCancel] = useState<CreditRequest | null>(null);
    const [requestToPay, setRequestToPay] = useState<CreditRequest | null>(null);
    const [paymentFileList, setPaymentFileList] = useState<UploadFile[]>([]);

    const [statusFilter, setStatusFilter] = useState<CreditStatus | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const { user, isGlobalAdmin } = useAuth();
    const { selectedCompanyId, selectedPartnerId } = useAdminScope();
    const { styles } = useStyle();

    const isAdmin = isAdminDomain && isGlobalAdmin;

    const currentPartnerId =
        user?.user?.partner_id ?? user?.user?.partner?.partner_id ?? null;
    const companyId = user?.user?.company_id ?? null;

    const color = appSetting?.primaryColor;
    const resolvedPartnerId = isAdmin ? selectedPartnerId ?? undefined : currentPartnerId ?? undefined;
    const resolvedCompanyId = isAdmin ? selectedCompanyId ?? undefined : companyId ?? undefined;

    const hasRequiredScope = isAdmin ? !!selectedPartnerId : true;

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const { data: partnerData } = usePartnerQuery({
        partnerId: resolvedPartnerId,
        enabled: hasRequiredScope,
        per_page: 100,
    });

    const { data, isLoading, isFetching } = useCreditRequestsQuery({
        partnerId: resolvedPartnerId,
        companyId: resolvedCompanyId,
        page,
        perPage: pageSize,
        enabled: hasRequiredScope,
    });

    const requests: CreditRequest[] = data?.requests ?? EMPTY_REQUESTS;
    const total = data?.total ?? 0;
    const currentPage = data?.page ?? page;
    const currentPageSize = data?.per_page ?? pageSize;
    const createMutation = useCreateCreditRequestMutation();
    const updateStatusMutation = useUpdateCreditRequestStatusMutation();
    const updatePaymentMutation = useUpdateCreditRequestPaymentMutation();
    const addBonusMutation = useAddPartnerBonusMutation();

    const summaryCards = useMemo(() => {
        if (isAdmin) {
            return null;
        }

        const currentPartner = partnerData?.partners?.find(
            (partner) => partner.partner_id === currentPartnerId,
        ) ?? null;
        const currentCredit = currentPartner?.current_credit;
        const currentBonusCredit = currentPartner?.bonus_credit;
        const total = Number(currentCredit) + Number(currentBonusCredit);
        const approvedCount = requests.filter(
            (request) => request.status === "APROVADO",
        ).length;


        return [
            {
                label: "Total",
                value: `R$ ${total}`,
            },
            {
                label: "Crédito",
                value: `R$ ${currentCredit}`,
            },
            {
                label: "Bônus",
                value: `R$ ${currentBonusCredit}`,
            },
            {
                label: "Aprovados",
                value: `${approvedCount}`,
            },

        ];
    }, [isAdmin, partnerData, requests, currentPartnerId]);



    const visibleRequests = useMemo(() => {
        let base = requests;

        if (isAdmin) {
            const normalized = searchTerm.toLowerCase();

            base = base.filter((r) => {
                const matchesStatus =
                    statusFilter === "all" || r.status === statusFilter;

                const text = [
                    r.credit_value,
                    r.type_of_payment,
                    r.status,
                    r.user?.user_name,
                    r.partner?.partner_name,
                    r.partner_id,
                    r.company?.company_name,
                ]
                    .join(" ")
                    .toLowerCase();

                return matchesStatus && text.includes(normalized);
            });
        }

        return base;
    }, [requests, isAdmin, searchTerm, statusFilter]);

    const handleCreateRequest = async () => {
        const values = await form.validateFields();
        const numericValue = parseCurrency(values.value);

        createMutation.mutate({
            partner_id: currentPartnerId!,
            company_id: companyId!,
            credit_value: numericValue,
            type_of_payment: values.paymentType.toLowerCase() as "pix" | "boleto",
        });

        setIsCreateOpen(false);
        form.resetFields();
    };

    const handleConfirmCancel = () => {
        if (!requestToCancel) return;

        updateStatusMutation.mutate({
            id: requestToCancel.id,
            status: "CANCELADO",
        });

        setRequestToCancel(null);
    };

    const handleAddBonus = async () => {
        if (!selectedPartnerId) {
            message.error("Selecione um parceiro no topo da página.");
            return;
        }

        const values = await bonusForm.validateFields();

        addBonusMutation.mutate({
            partnerId: selectedPartnerId,
            entity: {
                amount: values.amount,
                description: values.description,
            },
        });

        setIsBonusOpen(false);
        bonusForm.resetFields();
    };

    const openPaymentModal = (request: CreditRequest) => {
        setRequestToPay(request);

        paymentForm.setFieldsValue({
            paymentCode: request.payment_code ?? "",
        });

        setPaymentFileList(
            request.image
                ? [
                    {
                        uid: String(request.id),
                        name: "boleto",
                        status: "done",
                    },
                ]
                : [],
        );
    };

    const handleConfirmPayment = async () => {
        if (!requestToPay) return;

        const values = await paymentForm.validateFields();
        const file = paymentFileList[0]?.originFileObj;
        const image = file
            ? await readFileAsBase64(file as File)
            : requestToPay.image ?? undefined;

        if (!image) {
            message.error("Informe a imagem do comprovante.");
            return;
        }

        updatePaymentMutation.mutate({
            id: requestToPay.id,
            payment_code: values.paymentCode,
            image,
        });

        setRequestToPay(null);
        paymentForm.resetFields();
        setPaymentFileList([]);
        message.success("Pagamento atualizado com sucesso.");
    };

    const columns: TableColumnsType<CreditRequest> = isAdmin
        ? [
            { title: "Data", dataIndex: "created_at", key: "date", width: 150 },
            {
                title: "Status",
                dataIndex: "status",
                key: "status", width: 150,
                render: (status: CreditStatus) => {
                    const map = {
                        PENDENTE: "gold",
                        APROVADO: "green",
                        CANCELADO: "red",
                    };
                    return <Tag color={map[status]}>{status}</Tag>;
                },
            },
            { title: "Valor", dataIndex: "credit_value", key: "value", render: (value: number) => formatCurrency(value), width: 160 },
            { title: "Tipo", dataIndex: "type_of_payment", key: "type", render: (type: string) => (type === "boleto" ? "Boleto" : "Pix") },


            {
                title: "Solicitante",
                render: (_, r) =>
                    `${r.partner?.partner_name ?? r.partner_id} - ${r.user?.user_name ?? "-"}`,
            },
            {
                title: "",
                render: (_, r) => (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => openPaymentModal(r)}
                        style={{ backgroundColor: color }}
                    >
                        Pagamento
                    </Button>
                ),
            },
        ]
        : [
            { title: "Valor", dataIndex: "credit_value" },
            { title: "Tipo", dataIndex: "type_of_payment" },
            {
                title: "Status",
                dataIndex: "status",
                render: (s: CreditStatus) => (
                    <Tag color={s === "PENDENTE" ? "gold" : s === "APROVADO" ? "green" : "red"}>
                        {s}
                    </Tag>
                ),
            },
            { title: "Data", dataIndex: "created_at" },
            {
                title: "",
                render: (_, r) => (
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => setSelectedRequest(r)}
                            style={{ backgroundColor: color }}
                        >
                            Ver
                        </Button>
                        <Button
                            danger
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setRequestToCancel(r);
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                ),
            },
        ];

    const creditTable = (
        <Table
            rowKey="id"
            loading={isLoading || isFetching}
            columns={columns}
            dataSource={visibleRequests}
            scroll={{ x: "max-content", y: 800 }}
            pagination={{
                current: currentPage,
                pageSize: currentPageSize,
                total,
                locale: { items_per_page: "" },
                pageSizeOptions: [20, 50, 100, 200],
                showSizeChanger: true,
                showTotal: (value) => `Total de ${value} solicitações`,
                onChange: (page) => setPage(page),
                onShowSizeChange: (_, size) => {
                    setPageSize(size);
                    setPage(1);
                },
            }}
            className={styles.customTable}
        />
    );

    return (
        <div className="flex flex-col gap-3">
            {/* HEADER */}
            <div className="flex justify-between">

                <Typography.Title level={3} style={{ marginBottom: 4 }}>
                    {isAdmin ? "Gestão de Créditos" : ""}
                </Typography.Title>


            </div>

            {isAdmin ? (
                selectedPartnerId ? (
                    <>
                        <div className="flex justify-between mb-2">
                            {/* FILTER ADMIN */}
                            <Space>
                                <Input.Search
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <Select
                                    value={statusFilter}
                                    className="w-30"
                                    onChange={setStatusFilter}
                                    options={[
                                        { label: "Todos", value: "all" },
                                        { label: "Pendente", value: "PENDENTE" },
                                        { label: "Aprovado", value: "APROVADO" },
                                        { label: "Cancelado", value: "CANCELADO" },
                                    ]}
                                />
                            </Space>
                            <Space>
                                {isAdmin && selectedPartnerId && (
                                    <Button onClick={() => setIsBonusOpen(true)}>
                                        Adicionar Bônus
                                    </Button>
                                )}


                                <Button
                                    type="primary"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    Solicitar crédito
                                </Button>

                            </Space>
                        </div>
                        {creditTable}
                    </>
                ) : (
                    <Card className="border-neutral-200 shadow-sm">
                        <Typography.Paragraph style={{ marginBottom: 0 }}>
                            Selecione um segmento, uma empresa e um parceiro usando os seletores no topo da página.
                        </Typography.Paragraph>
                    </Card>
                )
            ) : (
                <> <div className="flex justify-between mb-2">
                    <Typography.Title level={3} style={{ marginBottom: 4 }}>
                        Gestão de Créditos
                    </Typography.Title>
                    <Space>



                        <Button
                            type="primary"
                            style={{ backgroundColor: color }}
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Solicitar crédito
                        </Button>

                    </Space>
                </div>
                    {summaryCards && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {summaryCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-2 text-center shadow-sm"
                                >
                                    <div className="text-sm text-slate-400">{card.label}</div>
                                    <div className="mt-1 text-2xl font-semibold text-slate-900">
                                        {card.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {creditTable}
                </>
            )}

            {/* CREATE */}
            <Modal
                open={isCreateOpen}
                title="Nova solicitação"
                onCancel={() => setIsCreateOpen(false)}
                onOk={handleCreateRequest}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="value" label="Valor" rules={[{ required: true }]}>
                        <Input placeholder="R$ 100,00" />
                    </Form.Item>

                    <Form.Item name="paymentType" label="Tipo">
                        <Select
                            options={[
                                { value: "Pix", label: "Pix" },
                                { value: "Boleto", label: "Boleto" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* BONUS (ADMIN) */}
            <Modal
                open={isBonusOpen}
                title="Adicionar Bônus"
                onCancel={() => {
                    setIsBonusOpen(false);
                    bonusForm.resetFields();
                }}
                onOk={handleAddBonus}
                okText="Adicionar"
                confirmLoading={addBonusMutation.isPending}
            >
                <Form form={bonusForm} layout="vertical">
                    <Form.Item
                        name="amount"
                        label="Valor do bônus"
                        rules={[{ required: true, message: "Informe o valor" }]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="50,00"
                            min={0}
                            step={0.01}
                            prefix="R$"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Descrição"
                        rules={[{ required: true, message: "Informe a descrição" }]}
                    >
                        <Input.TextArea
                            placeholder="Bonificação por atingir meta de junho"
                            rows={3}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* CANCEL */}
            <Modal
                open={!!requestToCancel}
                title="Cancelar solicitação"
                onCancel={() => setRequestToCancel(null)}
                onOk={handleConfirmCancel}
                okButtonProps={{ danger: true }}
            >
                Confirmar cancelamento?
            </Modal>

            {/* PAYMENT ADMIN */}
            <Modal
                open={!!requestToPay}
                title="Registrar pagamento"
                onCancel={() => setRequestToPay(null)}
                width={620}
                centered
                destroyOnClose
                footer={[
                    <Button key="cancel" onClick={() => setRequestToPay(null)}>
                        Cancelar
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        style={{ backgroundColor: color }}
                        onClick={handleConfirmPayment}
                    >
                        Salvar pagamento
                    </Button>,
                ]}
            >
                <Form form={paymentForm} layout="vertical" className="mt-4 flex flex-col gap-2">
                    {requestToPay && (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Valor</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    {formatCurrency(requestToPay.credit_value)}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Solicitante</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    {`${requestToPay.partner?.partner_name ?? requestToPay.partner_id} - ${requestToPay.user?.user_name ?? "-"}`}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Tipo</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    {requestToPay.type_of_payment === "boleto" ? "Boleto" : "Pix"}
                                </div>
                            </div>
                        </div>
                    )}
                    <div >
                        <Form.Item label="Status" >
                            <Select
                                value={requestToPay?.status}
                                onChange={(value) => {
                                    if (!requestToPay) return;

                                    updateStatusMutation.mutate({
                                        id: requestToPay.id,
                                        status: value,
                                    });

                                    setRequestToPay((prev) =>
                                        prev ? { ...prev, status: value } : null,
                                    );
                                }}
                                options={[
                                    { value: "PENDENTE", label: "Pendente" },
                                    { value: "APROVADO", label: "Aprovado" },
                                    { value: "CANCELADO", label: "Cancelado" },
                                ]}
                            />
                        </Form.Item>

                        {requestToPay?.type_of_payment === "pix" ? (
                            <>
                                <Form.Item
                                    name="paymentCode"
                                    label="Código PIX"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Chave PIX" />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item label="Boleto (imagem/PDF)" required>
                                    <Upload
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        accept="image/*,.pdf"
                                        fileList={paymentFileList}
                                        onChange={({ fileList }) => setPaymentFileList(fileList)}
                                    >
                                        <Button icon={<UploadOutlined />}>
                                            Selecionar boleto
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    name="paymentCode"
                                    label="Código de barras"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Linha digitável do boleto" />
                                </Form.Item>
                            </>
                        )}
                    </div>

                </Form>
            </Modal>

            {/* DETAIL */}
            <Modal
                open={!!selectedRequest}
                title="Solicitação de crédito"
                width={620}
                centered
                destroyOnClose
                onCancel={() => setSelectedRequest(null)}
                footer={[
                    <Button key="close" onClick={() => setSelectedRequest(null)}>
                        Fechar
                    </Button>,
                ]}
            >
                {selectedRequest && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Valor de crédito</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    {formatCurrency(selectedRequest.credit_value)}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Tipo de pagamento</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    {selectedRequest.type_of_payment === "boleto"
                                        ? "Boleto"
                                        : "Pix"}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Status</div>
                                <div className="mt-2 inline-flex">
                                    <Tag
                                        color={
                                            selectedRequest.status === "PENDENTE"
                                                ? "gold"
                                                : selectedRequest.status === "APROVADO"
                                                    ? "green"
                                                    : "red"
                                        }
                                    >
                                        {selectedRequest.status === "APROVADO"
                                            ? "Aprovado"
                                            : selectedRequest.status === "PENDENTE"
                                                ? "Pendente"
                                                : "Cancelado"}
                                    </Tag>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-sm text-slate-400">Data</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">
                                    {selectedRequest.created_at}
                                </div>
                            </div>
                        </div>

                        {isPix ? (
                            <>
                                <div className="text-sm text-slate-400">QRCODE</div>
                                <div className="mt-3 flex min-h-44 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                                    {selectedRequest.payment_code &&
                                        <QRCodeSVG
                                            value={selectedRequest.payment_code ?? ""}
                                            size={180}
                                        />
                                    }

                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="text-sm text-slate-400">Código</div>
                                    <div className="mt-2 break-all text-sm font-medium text-slate-900">
                                        {selectedRequest.payment_code}
                                    </div> </div>
                            </>
                        ) : (
                            <>
                                {selectedRequest.image && (
                                    <>  <div className="text-sm text-slate-400">Boleto</div>
                                        <div className="mt-3 flex min-h-44 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                                            <img
                                                src={`data:image/*;base64,${selectedRequest.image}`}
                                                className="rounded-xl border"
                                            />
                                        </div></>
                                )}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="text-sm text-slate-400">Código</div>
                                    <div className="mt-2 break-all text-sm font-medium text-slate-900">
                                        {selectedRequest.payment_code}
                                    </div>  </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}