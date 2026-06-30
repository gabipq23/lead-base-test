import { Col, Row, Alert } from "antd";

import { OrderModalSection } from "../../common/components/order-modal-section";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatPhoneNumber, } from "@/utils/number.utils";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatBrowserDisplay, formatDevice, formatOSDisplay, formatResolution } from "@/utils/orders.util";
import { EmpresasDisplay } from "../../common/components/companiesDisplay";
import anonymousAvatar from "@/assets/anonymous_avatar.png";
import React from "react";

type AlertScenario = { color: string; content: React.ReactNode };

function resolveAlertType(color: string): "error" | "warning" | "success" {
    if (color === "#ffeaea") return "error";
    if (color === "#fff6c7") return "warning";
    if (color === "#e6ffed") return "success";
    return "warning";
}

export function OrderDetailsTab({
    viewingEntity,
    isAdmin,
    companyName,
    partnerName,
    color,
    alertScenarios = [],
    produtoPrincipal,
    outrosProdutos
}: {
    viewingEntity: any;
    isAdmin: boolean;
    companyName?: string;
    partnerName?: string;
    color?: string;
    alertScenarios?: AlertScenario[];
    produtoPrincipal?: string;
    outrosProdutos?: string;

}) {


    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin">


            {alertScenarios

                .map((scenario, idx) => (
                    <Alert
                        key={idx}
                        type={resolveAlertType(scenario.color)}
                        message={scenario.content}
                        showIcon
                        className="mb-2"
                    />
                ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
                {isAdmin && (
                    <div className="bg-neutral-100 rounded-sm p-3 w-full">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Empresa"
                                    value={viewingEntity.company_id
                                        ? (companyName ?? `#${viewingEntity.company_id}`)
                                        : "-"}
                                />
                            </Col>
                            <Col span={12}>
                                <ReadonlyField
                                    label="Parceiro"
                                    value={viewingEntity.partner_id
                                        ? (partnerName ?? `#${viewingEntity.partner_id}`)
                                        : "-"}
                                />
                            </Col>
                        </Row>
                    </div>
                )}

                <OrderModalSection title="Produtos de Interesse">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField label="Produto Principal" value={produtoPrincipal} />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Outros Produtos" value={outrosProdutos} />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="App C6 Bank">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField
                                label="Click App"
                                value={viewingEntity?.app_click == null ? "-" : viewingEntity.app_click ? "Sim" : "Não"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Data/Hora Click"
                                value={viewingEntity?.app_click_at ? new Date(viewingEntity.app_click_at).toLocaleString("pt-BR") : "-"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Cadastro App"
                                value={viewingEntity?.app_register == null ? "-" : viewingEntity.app_register ? "Sim" : "Não"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Data/Hora Cadastro"
                                value={viewingEntity?.app_register_at ? new Date(viewingEntity.app_register_at).toLocaleString("pt-BR") : "-"}
                            />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Informações do Cliente">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={viewingEntity?.whatsapp?.avatar || anonymousAvatar}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            outline: viewingEntity?.pf_temperature === 10 ? "2px solid #d63535" : "none",
                                        }}
                                    />
                                    {viewingEntity?.pf_temperature === 10 && (
                                        <span style={{ position: "absolute", top: -4, right: -4, fontSize: 12 }}>🔥</span>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome" value={viewingEntity?.full_name} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome (RFB)" value={viewingEntity?.rfb_name} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="CPF" value={formatCPF(viewingEntity?.cpf || "")} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField
                                label="Gênero (RFB)"
                                value={viewingEntity?.rfb_gender === "M" ? "Masculino" : viewingEntity?.rfb_gender === "F" ? "Feminino" : "-"}
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Data Nascimento (RFB)" value={viewingEntity?.rfb_birth_date} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Nome Mãe (RFB)" value={viewingEntity?.rfb_mother_name} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Email" value={viewingEntity?.email} copyable />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Contato">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8 }}>Telefone Principal</p>
                            <Row gutter={[8, 8]}>
                                <Col span={24}>
                                    <ReadonlyField label="Número" value={formatPhoneNumber(viewingEntity?.phone || "")} copyable />
                                </Col>
                                <Col span={12}>
                                    <ReadonlyField
                                        label="Anatel"
                                        value={viewingEntity?.phone_valid == null ? "-" : viewingEntity.phone_valid ? "Sim" : "Não"}
                                    />
                                </Col>
                                <Col span={12}>
                                    <ReadonlyField label="Portado" value={viewingEntity?.portability} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Informações Empresariais">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <ReadonlyField label="Sócio" value={viewingEntity?.is_socio ? "Sim" : "Não"} />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="MEI" value={viewingEntity?.is_mei ? "Sim" : "Não"} />
                        </Col>
                        <Col span={12}>
                            <EmpresasDisplay empresas={viewingEntity?.company_partners} />
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Endereço">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField label="Rua" value={viewingEntity?.address || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="Número" value={viewingEntity?.address_number || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField
                                label="Complemento"
                                value={
                                    viewingEntity?.address_complement?.building_or_house === "house"
                                        ? viewingEntity?.address_complement?.home_complement || "-"
                                        : viewingEntity?.address_complement?.building_or_house === "building"
                                            ? `${viewingEntity?.address_complement?.unit_type || "-"} ${viewingEntity?.address_complement?.unit_number || "-"}`
                                            : "-"
                                }
                                copyable
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Bairro" value={viewingEntity?.district || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Cidade" value={viewingEntity?.city || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="UF" value={viewingEntity?.state || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="CEP" value={formatCEP(viewingEntity?.zip_code || "")} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="CEP Único" value={viewingEntity?.single_zip_code ? "Sim" : "Não"} />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="Quadra" value={viewingEntity?.address_complement?.square || "-"} copyable />
                        </Col>
                        <Col span={6}>
                            <ReadonlyField label="Lote" value={viewingEntity?.address_complement?.lot || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField
                                label="Tipo"
                                value={viewingEntity?.address_complement?.building_or_house === "building" ? "Edifício" : "Casa"}
                            />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Andar" value={viewingEntity?.address_complement?.floor || "-"} copyable />
                        </Col>
                        <Col span={8}>
                            <ReadonlyField label="Ponto de Referência" value={viewingEntity?.address_complement?.reference_point || "-"} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Coordenadas"
                                value={
                                    viewingEntity?.geolocation?.latitude && viewingEntity?.geolocation?.longitude
                                        ? `${viewingEntity.geolocation.latitude}, ${viewingEntity.geolocation.longitude}`
                                        : "-"
                                }
                            />
                        </Col>
                        <Col span={6} style={{ display: "flex", alignItems: "flex-end" }}>
                            <a href={viewingEntity?.geolocation?.maps_link} target="_blank" rel="noopener noreferrer" style={{ color: color, textDecoration: "underline" }}>
                                Ver no Google Maps
                            </a>
                        </Col>
                        <Col span={6} style={{ display: "flex", alignItems: "flex-end" }}>
                            <a href={viewingEntity?.geolocation?.street_view_link} target="_blank" rel="noopener noreferrer" style={{ color: color, textDecoration: "underline" }}>
                                Ver no Street View
                            </a>
                        </Col>
                    </Row>
                </OrderModalSection>

                <OrderModalSection title="Dados do Tráfego">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ReadonlyField label="IP" value={viewingEntity?.client_ip} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Provedor" value={viewingEntity?.ip_isp} />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="Tipo de Acesso"
                                value={(() => {
                                    const accessTypeMap: Record<string, string> = {
                                        movel: "Móvel",
                                        fixo: "Fixo",
                                        hosting: "Hosting",
                                        proxy: "Proxy",
                                        local: "Local",
                                        desconhecido: "Desconhecido",
                                    };

                                    return accessTypeMap[String(viewingEntity?.ip_access_type ?? "")] ?? "-";
                                })()}
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="URL" value={viewingEntity?.url} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Plataforma" value={formatOSDisplay(viewingEntity?.fingerprint?.os)} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Dispositivo" value={formatDevice(viewingEntity?.fingerprint?.device || "-")} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Browser" value={formatBrowserDisplay(viewingEntity?.fingerprint?.browser)} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField
                                label="TimeZone"
                                value={[
                                    viewingEntity?.fingerprint?.timezone,
                                    viewingEntity?.fingerprint?.timezone_name,
                                ]
                                    .filter(Boolean)
                                    .join(" - ") || "-"}
                                copyable
                            />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="Resolução" value={formatResolution(viewingEntity?.fingerprint?.resolution || "-")} copyable />
                        </Col>
                        <Col span={12}>
                            <ReadonlyField label="ID Fingerprint" value={viewingEntity?.fingerprint_id || "-"} copyable />
                        </Col>
                    </Row>
                </OrderModalSection>

            </div>
        </div>
    );
}