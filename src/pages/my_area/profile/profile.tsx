import { Avatar, Card, Col, Row, Tag, Typography } from "antd";
import type { JSX } from "react";
import { useAuth } from "@/context/auth-provider";
import { summarizeName } from "@/utils/text.util";
import ReadonlyField from "@/layout/common-components/ReadOnlyField";
import { formatCNPJ, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatRoleLabel } from "@/utils/role.util";

export function ProfilePage(): JSX.Element {
    const { user } = useAuth();
    const profile = user?.user;

    const responsibleLabel = profile?.person_responsible
        ? `${profile.person_responsible.user_name} - ${formatRoleLabel(profile.person_responsible.role ?? "")}`
        : "-";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <Typography.Title level={4} style={{ marginBottom: 4 }}>
                        Perfil do usuário
                    </Typography.Title>
                </div>

                {/* <Space>
                    <Button>Editar perfil</Button>

                </Space> */}
            </div>

            <Card className="border-neutral-200 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <Avatar size={64} className="bg-neutral-800 text-white text-xl font-semibold">
                        {summarizeName(profile?.name ?? "")}
                    </Avatar>

                    <div>
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                            {profile?.name ?? "Usuário não identificado"}
                        </Typography.Title>

                        <div className="mt-2 flex flex-wrap gap-2">
                            <Tag color="blue">{profile?.role ?? "sem função"}</Tag>

                        </div>
                    </div>
                </div>

                <Row gutter={[16, 16]}>

                    <Col span={8}>
                        <ReadonlyField label="Email" value={profile?.email} copyable />
                    </Col>

                    <Col span={8}>
                        <ReadonlyField label="Telefone" value={formatPhoneNumber(profile?.telephone ?? "")} />
                    </Col>

                    <Col span={8}>
                        <ReadonlyField label="CPF" value={formatCPF(profile?.cpf ?? "")} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="CNPJ" value={formatCNPJ(profile?.cnpj ?? "")} />
                    </Col>
                    {/* <Col span={8}>
                        <ReadonlyField label="Empresa" value={profile?.company?.company_name ?? profile?.company_id?.toString()} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Parceiro" value={profile?.partner?.partner_name ?? profile?.partner_id?.toString()} />
                    </Col> */}
                    <Col span={8}>
                        <ReadonlyField
                            label="Tipo"
                            value={profile?.user_type === "EQUIPE" ? "Equipe" : profile?.user_type === "SUBCREDENCIADO" ? "Subcredenciado" : "-"}
                        />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Equipe" value={profile?.team} />
                    </Col>
                    <Col span={8}>
                        <ReadonlyField label="Responsável" value={responsibleLabel} />
                    </Col>

                    {/* <Col span={24}>
                        <div style={{ marginTop: 8 }}>
                            <Typography.Text type="secondary">Permissões de Notificação</Typography.Text>
                            <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
                                {profile?.allow_email_notifications && <li><CheckCircleOutlined /> Email</li>}
                                {profile?.allow_sms_notifications && <li><CheckCircleOutlined /> SMS</li>}
                                {profile?.allow_wpp_notifications && <li><CheckCircleOutlined /> WhatsApp</li>}
                                {(!profile?.allow_email_notifications && !profile?.allow_sms_notifications && !profile?.allow_wpp_notifications) && <li><CloseCircleOutlined /> Nenhum canal habilitado</li>}
                            </ul>
                        </div>
                    </Col> */}
                </Row>
            </Card>
        </div>
    );
}