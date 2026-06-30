import { Col, Row, Tooltip } from "antd";
import { OrderModalSection } from "@/pages/orders/common/components/order-modal-section";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import type { ILead } from "@/types/ILead.type";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { appSetting } from "@/constants/app-setting/config.const";

const OPERATOR_ASSETS: Record<string, { src: string; className: string }> = {
    claro: { src: "/claro.png", className: "h-8 w-8" },
    tim: { src: "/tim.svg", className: "h-9" },
    oi: { src: "/oi.svg", className: "h-8" },
    sky: { src: "/sky.svg", className: "h-6" },
    nio: { src: "/nio.svg", className: "h-3" },
    algar: { src: "/algar.png", className: "h-5" },
    vivo: { src: "/vivo.png", className: "h-4" },
};

const LEAD_OPERATOR_KEYS = ["claro", "tim", "oi", "sky", "nio", "algar", "vivo"] as const;

function OperatorAvailabilityDot({
    available,
    foundViaRange,
}: {
    available: boolean | null | undefined;
    foundViaRange?: boolean | null;
}) {
    if (available === null || available === undefined) {
        return "-";
    }

    if (available) {
        if (foundViaRange) {
            return (
                <Tooltip title="Disponível (via range numérico)" placement="top">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full cursor-pointer" />
                </Tooltip>
            );
        }
        return (
            <Tooltip title="Disponível" placement="top">
                <div className="h-2 w-2 bg-green-500 rounded-full cursor-pointer" />
            </Tooltip>
        );
    }

    return (
        <Tooltip title="Indisponível" placement="top">
            <div className="h-2 w-2 bg-red-500 rounded-full" />
        </Tooltip>
    );
}

export function LeadDetailsTab({ lead }: { lead: ILead }) {
    const color = appSetting?.primaryColor
    return (
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
                {lead.operators_availability && (
                    <OrderModalSection title="Disponibilidade de Operadoras">
                        <div className="flex flex-wrap justify-center gap-8 py-3">
                            {LEAD_OPERATOR_KEYS.map((key) => {
                                const asset = OPERATOR_ASSETS[key];
                                const avail = lead.operators_availability?.[key];

                                return (
                                    <div key={key} className="flex flex-col items-center gap-2 min-w-15">
                                        <div className="flex items-center justify-center h-10">
                                            {asset ? (
                                                <img
                                                    src={asset.src}
                                                    alt={key}
                                                    className="object-contain max-w-[50px] max-h-[42px]"
                                                />
                                            ) : (
                                                <span className="text-xs uppercase font-semibold">{key}</span>
                                            )}
                                        </div>
                                        <OperatorAvailabilityDot
                                            available={avail?.available ?? null}
                                            foundViaRange={avail?.found_via_range ?? null}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </OrderModalSection>
                )}

                {/* <OrderModalSection title="Controle">
                    <Row gutter={[16, 16]}>
                        <Col span={4}>
                            <ReadonlyField label="ID" value={String(lead.id)} />
                        </Col>

                        <Col span={5}>
                            <ReadonlyField label="Status" value={lead.status} />
                        </Col>

                        <Col span={5}>
                            <ReadonlyField
                                label="Reservado"
                                value={lead.is_reserved ? "Sim" : "Não"}
                            />
                        </Col>

                        <Col span={10}>
                            <ReadonlyField
                                label="CRM"
                                value={lead.crm_status}
                            />
                        </Col>

                        <Col span={8}>
                            <ReadonlyField
                                label="Criado em"
                                value={lead.created_at}
                            />
                        </Col>

                        <Col span={8}>
                            <ReadonlyField
                                label="Atualizado em"
                                value={lead.updated_at}
                            />
                        </Col>

                        {lead.reserved_at && (
                            <Col span={8}>
                                <ReadonlyField
                                    label="Reservado em"
                                    value={lead.reserved_at}
                                />
                            </Col>
                        )}

                        {lead.reserved_by_user_id && (
                            <Col span={8}>
                                <ReadonlyField
                                    label="Reservado por"
                                    value={String(lead.reserved_by_user_id)}
                                />
                            </Col>
                        )}

                        <Col span={8}>
                            <ReadonlyField
                                label="Company ID"
                                value={String(lead.company_id)}
                            />
                        </Col>

                        <Col span={8}>
                            <ReadonlyField
                                label="Partner ID"
                                value={
                                    lead.partner_id != null
                                        ? String(lead.partner_id)
                                        : "-"
                                }
                            />
                        </Col>

                        {lead.consultant_note && (
                            <Col span={24}>
                                <ReadonlyField
                                    label="Observação do consultor"
                                    value={lead.consultant_note}
                                />
                            </Col>
                        )}
                    </Row>
                </OrderModalSection> */}

                <OrderModalSection title="Dados do Lead">
                    <Row gutter={[16, 16]}>

                        <Col span={12}>
                            <ReadonlyField label="Nome" value={lead.full_name} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome (RFB)" value={lead.rfb_name} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="CPF" value={formatCPF(lead.cpf)} copyable />
                        </Col>    <Col span={8}>
                            <ReadonlyField label="Nome da mãe" value={lead.mother_name} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Data de nascimento" value={lead.birth_date} />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField
                                label="Idade"
                                value={lead.age != null ? String(lead.age) : null}
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField
                                label="Gênero"
                                value={
                                    lead.gender === "M"
                                        ? "Masculino"
                                        : lead.gender === "F"
                                            ? "Feminino"
                                            : (lead.gender ?? null)
                                }
                            />
                        </Col>

                        <Col span={8}><ReadonlyField label="Email" value={lead?.email} copyable /></Col>

                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Contato">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 8 }}>Telefone Principal</p>
                            <Row gutter={[8, 8]}>
                                <Col span={24}><ReadonlyField label="Número" value={formatPhoneNumber(lead?.phone)} copyable /></Col>
                                <Col span={12}><ReadonlyField label="Anatel" value={lead?.phone_validation?.valid ? 'Sim' : lead?.phone_validation?.valid == null ? '-' : 'Não'} /></Col>
                                <Col span={12}><ReadonlyField label="Operadora" value={lead?.phone_validation?.operadora} /></Col>
                                <Col span={12}><ReadonlyField label="Portado" value={lead?.phone_validation?.portabilidade} /></Col>
                                <Col span={12}><ReadonlyField label="Data da Portabilidade" value={lead?.phone_validation?.data_portabilidade || '-'} /></Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 8 }}>Telefone Adicional</p>
                            <Row gutter={[8, 8]}>
                                <Col span={24}><ReadonlyField label="Número" value={formatPhoneNumber(lead?.additional_phone || '')} copyable /></Col>
                                <Col span={12}><ReadonlyField label="Anatel" value={lead?.additional_phone_validation?.valid ? 'Sim' : lead?.additional_phone_validation?.valid == null ? '-' : 'Não'} /></Col>
                                <Col span={12}><ReadonlyField label="Operadora" value={lead?.additional_phone_validation?.operadora} /></Col>
                                <Col span={12}><ReadonlyField label="Portado" value={lead?.additional_phone_validation?.portabilidade} /></Col>
                                <Col span={12}><ReadonlyField label="Data da Portabilidade" value={lead?.additional_phone_validation?.data_portabilidade || '-'} /></Col>
                            </Row>
                        </Col>
                    </Row>
                </OrderModalSection>


                <OrderModalSection title="Endereço">
                    <Row gutter={[16, 16]}>
                        <Col span={12}><ReadonlyField label="Rua" value={lead?.address || '-'} copyable /></Col>
                        <Col span={6}><ReadonlyField label="Número" value={lead?.number || '-'} copyable /></Col>
                        <Col span={6}><ReadonlyField label="CEP" value={formatCEP(lead?.cep || '')} copyable /></Col>
                        <Col span={8}><ReadonlyField label="Bairro" value={lead?.district || '-'} copyable /></Col>
                        <Col span={8}><ReadonlyField label="Cidade" value={lead?.city || '-'} copyable /></Col>
                        <Col span={8}><ReadonlyField label="UF" value={lead?.uf || '-'} copyable /></Col>

                        <Col span={12}><ReadonlyField label="Coordenadas" value={lead?.geolocation?.latitude && lead?.geolocation?.longitude ? `${lead?.geolocation.latitude}, ${lead?.geolocation.longitude}` : '-'} /></Col>
                        <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <a href={lead?.geolocation?.maps_link} target="_blank" rel="noopener noreferrer" style={{ color: color }}>
                                Ver no Google Maps
                            </a>
                        </Col>
                        <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <a href={lead?.geolocation?.street_view_link} target="_blank" rel="noopener noreferrer" style={{ color: color }}>
                                Ver no Street View
                            </a>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Origem">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <ReadonlyField label="Canal" value={lead.channel} />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Campanha" value={lead.campaign} />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Intenção de compra" value={lead.purchase_intent} />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Preço do plano" value={lead.purchase_intent_plan_price?.toString() ?? '-'} />
                        </Col>
                        <Col span={24}>
                            <ReadonlyField label="Landing Page" value={lead.landing_page} copyable />
                        </Col>
                    </Row>
                </OrderModalSection>


            </div>
        </div>
    );
}
