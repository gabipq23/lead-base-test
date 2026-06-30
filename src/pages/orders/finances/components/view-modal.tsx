import { App, Badge, Button, ConfigProvider, Form, Select, Tabs } from "antd";
import { useState, } from "react";
import { OrderModalShell } from "../../common/components/order-modal-shell";
import { getAlertScenarios } from "@/utils/orders.util";
import { useUpdateEntity } from "../../config-page.const";
import type { FinanceOrder } from "@/types/orders";
import { appSetting, isAdminDomain } from "@/constants/app-setting/config.const";
import { useUpdateOrderStatusMutation } from "@/hooks/orders/useUpdateOrderStatusMutation";
import { useAuth } from "@/context/auth-provider";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { generateOrderPdf } from "@/utils/order-pdf.util";
import { TranshipmentTab } from "./transhipment-tab";
import { OrderNotesTab } from "./notes-tb";
import { OrderHistoryTab } from "../../common/components/history-tab";
import { OrderControlTab } from "./control-tab";
import { OrderDetailsTab } from "./details-tab";
const financeProductLabelMap = {
    "conta-pj": "Conta PJ",
    "capital-giro-c6": "Capital de Giro",
    "maquinha-cartao": "Maquininha",
    investimentos: "Investimentos",
    "cartao-credito": "Cartão de Crédito",
    "reducao-dividas": "Redução de Dívidas",
    outro: "Outro",
} as const;

type FinanceProductKey = keyof typeof financeProductLabelMap;


interface ViewModalProps {
    open: boolean;
    viewingEntity: FinanceOrder | null;
    onClose: () => void;
    onEdit?: (entity: FinanceOrder) => void;
    onDelete?: (entity: FinanceOrder) => void;
    canDelete?: boolean;
}

export function ViewModal({
    open,
    viewingEntity,
    onClose,
    onEdit,
    onDelete,
    canDelete = false,
}: ViewModalProps) {
    const { message } = App.useApp();

    const [controlForm] = Form.useForm();
    const currentUser = useAuth().user!;
    const updateMutation = useUpdateEntity();
    const statusMutation = useUpdateOrderStatusMutation();
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    const { isGlobalAdmin } = useAuth();
    const isAdmin = isAdminDomain && isGlobalAdmin;
    const renderFooter = () => {
        switch (activeTab) {
            case "details":
                return (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={handleExportPdf} loading={isExportingPdf}>
                            Exportar PDF
                        </Button>
                        <Button type="primary" onClick={() => viewingEntity && onEdit?.(viewingEntity)}>
                            Editar
                        </Button>
                        {canDelete && (
                            <Button danger onClick={() => viewingEntity && onDelete?.(viewingEntity)}>
                                Deletar
                            </Button>
                        )}
                    </div>
                );
            case "control":
                return (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button type="primary" onClick={() => controlForm.submit()}>
                            Salvar
                        </Button>
                    </div>
                );
            // case "notes":
            //     return (
            //         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            //             <Button type="primary" onClick={handleSaveObservacao}>
            //                 Salvar
            //             </Button>
            //         </div>
            //     );
            default:
                return null;
        }
    };
    const { data: partnerData } = usePartnerQuery({
        partnerId: viewingEntity?.partner_id ?? undefined,
        enabled: isAdmin && !!viewingEntity?.partner_id,
    });
    const selectedPartner = partnerData?.partners?.find(
        (p) => p.partner_id === viewingEntity?.partner_id,
    );
    const partnerName = selectedPartner?.partner_name;

    const { data: companyData } = useCompanyQuery({
        per_page: 100,
        enabled: isAdmin && !!viewingEntity?.company_id,
    });
    const selectedCompany = companyData?.companies.find(
        (c) => c.company_id === viewingEntity?.company_id,
    );
    const companyName = selectedCompany?.company_name;

    const financeData = viewingEntity;

    const alertScenarios =
        viewingEntity?.status?.toLowerCase() === "fechado"
            ? getAlertScenarios({

                status: viewingEntity?.status,
            })
            : [];

    const badgeColor = alertScenarios.some(s => s.color === "#ffeaea")
        ? "red"
        : alertScenarios.some(s => s.color === "#fff6c7")
            ? "gold"
            : "green";


    if (!viewingEntity) return null;

    const handleSaveObservacao = (values: {
        consultant_observation: string;
    }) => {
        const obs = values.consultant_observation?.trim();

        if (!obs) return;

        updateMutation.mutate({
            id: viewingEntity!.id,
            payload: {
                consultant_notes: [
                    ...(viewingEntity?.consultant_notes ?? []),
                    {
                        obs,
                        user: currentUser.user.name,
                        role: currentUser.user.role,
                    },
                ],
            },
        });
    };


    const handleExportPdf = async () => {
        if (!financeData) return;

        setIsExportingPdf(true);
        try {
            await generateOrderPdf({
                order: financeData,
                segmentLabel: "financas",
                companyName,
                partnerName,
            });
        } catch {
            message.error("Nao foi possivel exportar o PDF do pedido.");
        } finally {
            setIsExportingPdf(false);
        }
    };

    const produtoPrincipal =
        financeData?.landing_page === "conta-pj"
            ? "Conta PJ"
            : financeData?.landing_page === "cartao-pj-c6"
                ? "Cartão PJ"
                : financeData?.landing_page === "maquinha-cartao-c6-empresas"
                    ? "Maquininha"
                    : "-";

    const outrosProdutos = (() => {
        if (!financeData?.products_of_interest) return "-";

        const products = Array.isArray(financeData.products_of_interest)
            ? financeData.products_of_interest
            : [financeData.products_of_interest];

        return products.length
            ? products.map((product: string) => financeProductLabelMap[product as FinanceProductKey] ?? product).join(", ")
            : "-";
    })();
    const color = appSetting.primaryColor;
    return (
        <OrderModalShell
            open={open}
            title={
                <div className="flex flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
                    <span style={{ color: "#252525" }}>
                        Pedido Nº {viewingEntity?.order_number || viewingEntity?.id}
                    </span>
                    <div className="flex flex-col flex-wrap items-start gap-4 mr-6">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Select: { hoverBorderColor: color, activeBorderColor: color, activeOutlineColor: "none" },
                                    Input: { hoverBorderColor: color, activeBorderColor: color },
                                },
                            }}
                        >
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold">Pedido:</span>
                                    <Select
                                        size="small"
                                        style={{ width: 110 }}
                                        value={viewingEntity?.status}
                                        onChange={(value) => statusMutation.mutate({ id: viewingEntity!.id, payload: { status: value } })}
                                        options={[
                                            { value: "ABERTO", label: "Aberto" },
                                            { value: "FECHADO", label: "Fechado" },
                                            { value: "CANCELADO", label: "Cancelado" },
                                            { value: "TRANSBORDO", label: "Transbordo" },
                                        ]}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold">Tramitação:</span>
                                    <Select
                                        placeholder="Selecione o status"
                                        size="small"
                                        value={viewingEntity?.after_sales_status}
                                        style={{ width: 340 }}
                                        onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { after_sales_status: value } })}
                                        options={[]}
                                    />

                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold">Atendimento:</span>
                                    <Select
                                        size="small"
                                        value={viewingEntity?.service}
                                        style={{ width: 160 }}
                                        onChange={(value) => updateMutation.mutate({ id: viewingEntity!.id, payload: { service: value } })}
                                        options={[
                                            { value: "em_andamento", label: "Em Andamento" },
                                            { value: "concluido", label: "Concluído" },
                                        ]}
                                    />
                                </div>

                            </div>
                        </ConfigProvider>
                    </div>
                </div>
            }
            footer={renderFooter()}
            onCancel={onClose}
            destroyOnHidden
            width={1000}
        >
            <Tabs
                defaultActiveKey="details"
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "details",
                        label: (
                            <span className="flex items-center gap-1">
                                Dados do Pedido
                                {alertScenarios.length > 0 && <Badge dot color={badgeColor} />}
                            </span>
                        ),
                        children: (
                            <OrderDetailsTab
                                viewingEntity={viewingEntity}
                                companyName={companyName}
                                isAdmin={isAdmin}
                                partnerName={partnerName}
                                color={color}
                                alertScenarios={alertScenarios}
                                produtoPrincipal={produtoPrincipal}
                                outrosProdutos={outrosProdutos}
                            />
                        ),
                    },
                    {
                        key: "control",
                        label: "Controle",
                        children: (
                            <OrderControlTab
                                viewingEntity={viewingEntity}
                                updateMutation={updateMutation}
                                form={controlForm}
                            />
                        ),
                    },
                    {
                        key: "history",
                        label: "Histórico",
                        children: (
                            <OrderHistoryTab orderId={viewingEntity.id} />
                        ),
                    },
                    {
                        key: "notes",
                        label: "Observações",
                        children: (
                            <OrderNotesTab
                                handleSaveObservacao={handleSaveObservacao}
                                viewingEntity={viewingEntity}
                            />
                        ),
                    },
                    {
                        key: "transhipment",
                        label: "Transbordo",
                        children: isAdmin && (
                            <TranshipmentTab viewingEntity={viewingEntity} />
                        ),
                    },
                ]}
            />
        </OrderModalShell>
    );
}