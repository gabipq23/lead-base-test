import { CopyOutlined } from "@ant-design/icons";
import { Button, message, Tag, Tooltip, type TableColumnsType } from "antd";
import { CheckCircle2, MapIcon, MapPinned, Mars, Venus, XCircle } from "lucide-react";

import type { ILead } from "@/types/ILead.type";
import { formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { getPersonData } from "@/pages/orders/common/components/columns";
import { normalizeNames } from "@/utils/orders.util";

import { ElapsedTimeCell } from "./timer";
import { getElapsedMs } from "@/utils/elapsedTime";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

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

type LeadOperatorKey = (typeof LEAD_OPERATOR_KEYS)[number];

function handleCopy(value: string | number | null | undefined) {
    if (value == null || value === "") return;

    navigator.clipboard.writeText(String(value));
    message.success("Copiado!");
}

export function getStatusColor(status: string): string {
    const normalized = status.toUpperCase();

    if (normalized === "DISPONIVEL") return "green";
    if (normalized === "RESERVADO") return "red";

    return "default";
}

function renderCopyableText(value: string | number | null | undefined) {
    if (value == null || value === "") {
        return "-";
    }

    return (
        <div className="flex items-center gap-1">
            <span className="truncate">{value}</span>
            <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                <CopyOutlined
                    onClick={(event) => {
                        event.stopPropagation();


                        handleCopy(value);
                    }}
                    style={{
                        color: "#8c8c8c",
                        cursor: "pointer",
                        opacity: 1,
                        flexShrink: 0,
                    }}
                />
            </Tooltip>
        </div>
    );
}

function renderAvailability(value: boolean | null | undefined, foundViaRange?: boolean | null) {
    if (value === null || value === undefined) return "-";

    return value ? (
        foundViaRange ? (
            <div className="flex items-center justify-center">
                <Tooltip
                    title="Disponível (via range numérico)"
                    placement="top"
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                </Tooltip>
            </div>
        ) : (
            <div className="flex items-center justify-center">
                <Tooltip title="Disponível" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                </Tooltip>
            </div>
        )
    ) : (
        <div className="flex items-center justify-center">
            <Tooltip title="Indisponível" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                <div className="h-2 w-2 bg-red-500 rounded-full" />
            </Tooltip>
        </div>
    );
}

function resolveOperatorKey(operator: string) {
    return operator.toLowerCase().trim() as LeadOperatorKey;
}

function getLeadAvailabilityColumns(): TableColumnsType<ILead> {
    return LEAD_OPERATOR_KEYS.map((operatorKey) => {
        const asset = OPERATOR_ASSETS[operatorKey];

        return {
            key: operatorKey,
            dataIndex: operatorKey,
            title: (
                <div className="flex items-center justify-center">
                    {asset ? (
                        <img src={asset.src} alt={operatorKey} className={asset.className} />
                    ) : (
                        <span className="text-xs uppercase">{operatorKey}</span>
                    )}
                </div>
            ),
            width: 100,
            render: (_: unknown, record: ILead) => {
                const availability = record.operators_availability?.[resolveOperatorKey(operatorKey)];

                return renderAvailability(
                    availability?.available ?? null,
                    availability?.found_via_range ?? null,
                );
            },
        };
    });
}
interface GetColumnsOptions {

    now: number;
}

export function getColumnsReservedLeads(options: GetColumnsOptions): TableColumnsType<ILead> {
    const { now } = options;

    return [
        // {
        //     title: "",
        //     key: "consultant_note",
        //     dataIndex: "consultant_note",
        //     width: 30,
        //     render: (consultant_note) => (
        //         <Tooltip
        //             placement="top"
        //             title={consultant_note}
        //             overlayInnerStyle={{ fontSize: 12 }}
        //         >
        //             {consultant_note && <ExclamationCircleOutlined />}
        //         </Tooltip>
        //     ),
        // },
        {
            key: "button",
            title: "Chatter",

            width: 70,
            render: () => (
                <div className="flex items-center justify-center">
                    <Tooltip
                        placement="top"
                        title="Prévia de conversa "
                        overlayInnerStyle={{ fontSize: 12 }}
                    >
                        <Button
                            style={{ width: 34, height: 34, padding: 0 }}
                            type="default"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            <ChatBubbleIcon />
                        </Button>
                    </Tooltip>
                </div>)
        },
        ...getLeadAvailabilityColumns(),
        {
            key: "id",
            title: "ID",
            dataIndex: "id",
            width: 50,
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            className: "lead-col-no-fade",
            width: 120,
            render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
            filters: [{ text: "Reservado", value: "RESERVADO" }, { text: "Disponível", value: "DISPONIVEL" }],
            onFilter: (value, record) => record.status === value,
        },
        {
            key: "client_type",
            title: "Tipo de Cliente",
            dataIndex: "client_type",
            width: 140,
            render: (clientType: string) => clientType ?? "-",
            filters: [{ text: "PF", value: "PF" }, { text: "PJ", value: "PJ" }],
            onFilter: (value, record) => record.client_type === value,


        },

        {
            key: "reserved_at",
            title: "Reservado em",
            dataIndex: "reserved_at",
            width: 140,
            render: (reservedAt: string | null) => renderCopyableText(reservedAt),
        },
        {
            key: "reserved_by_user_id",
            title: "Reservado por",
            dataIndex: "reserved_by_user_id",
            width: 130,
            render: (userId: number | null) => renderCopyableText(userId),
        },


        {
            key: "created_at",
            title: "Criado em",
            dataIndex: "created_at",
            width: 100,
            render: (createdAt: string) => renderCopyableText(createdAt),
        },
        {
            key: "elapsed",
            title: "Tempo em aberto",
            width: 140,
            render: (_, record) => (
                <ElapsedTimeCell
                    createdAt={record.created_at}
                    reservedAt={record.reserved_at}
                    isReserved={record.is_reserved}
                    now={now}
                />
            ),
            sorter: (a, b) => {
                const aElapsed = getElapsedMs(a.created_at, a.reserved_at, a.is_reserved, now);
                const bElapsed = getElapsedMs(b.created_at, b.reserved_at, b.is_reserved, now);
                return aElapsed - bElapsed;
            },
        },

        {
            title: "Nome",
            dataIndex: "full_name",
            width: 140,
            render: (_, record) => {
                const { full_name } = getPersonData(record);
                const isNamesMatch =
                    normalizeNames(full_name, record.rfb_name);

                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <Tooltip
                            placement="topLeft"
                            title={full_name}
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    maxWidth: 140,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {full_name}
                            </span>
                        </Tooltip>

                        {isNamesMatch === true ? (
                            <Tooltip
                                title="Nome confere com RFB"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            </Tooltip>
                        ) : isNamesMatch === false ? (
                            <Tooltip
                                title="Nome diferente da RFB"
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(full_name); }}
                                style={{
                                    color: "#8c8c8c",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            key: "cpf",
            title: "CPF",
            dataIndex: "cpf",
            width: 150,
            render: (cpf: string) => {
                if (!cpf) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 110,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                return renderCopyableText(formatCPF(cpf));
            },
        }, {
            key: "mother_name",
            title: "Nome da mãe",
            dataIndex: "mother_name",
            width: 180,
            ellipsis: true,
            render: (motherName: string) => {


                return renderCopyableText(motherName);
            },
        },
        {
            key: "birth_date",
            title: "Nascimento",
            dataIndex: "birth_date",
            width: 140,
            render: (birthDate: string) => {


                return renderCopyableText(birthDate);
            },
        },
        {
            key: "age",
            title: "Idade",
            dataIndex: "age",
            width: 90,
            render: (age: number | string) => {


                return age;
            },
        },
        {
            title: "Gênero",
            dataIndex: "gender",
            width: 80,
            render: (gender) =>
                gender === "M" ? (
                    <div className="flex items-center justify-center">
                        <Mars color="blue" size={17} />
                    </div>
                ) : gender === "F" ? (
                    <div className="flex items-center justify-center">
                        <Venus color="magenta" size={18} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center">-</div>
                ),
        },
        {
            key: "phone",
            title: "Telefone",
            dataIndex: "phone",
            width: 160,
            render: (phone: string, record) => {

                const isValid = record.phone_validation?.valid;

                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="truncate">{formatPhoneNumber(phone)}</span>

                        {isValid === true ? (
                            <Tooltip title="Telefone válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            </Tooltip>
                        ) : isValid === false ? (
                            <Tooltip title="Telefone inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(phone); }}
                                style={{
                                    color: "#8c8c8c",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            key: "operadora",
            title: "Operadora",
            dataIndex: "operadora",
            width: 160,
            render: (_, record) => record.phone_validation?.operadora ?? "-",
        }, {
            key: "whatsapp",
            title: "WhatsApp",
            dataIndex: "whatsapp",
            width: 140,
            render: (_, record) => record.whatsapp ?? "-",
        },
        {
            key: "additional_phone",
            title: "Telefone Adicional",
            dataIndex: "additional_phone",
            width: 160,
            render: (additional_phone: string, record) => {


                const isValid = record.additional_phone_validation?.valid;

                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="truncate">
                            {formatPhoneNumber(additional_phone)}
                        </span>

                        {isValid === true ? (
                            <Tooltip title="Telefone válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            </Tooltip>
                        ) : isValid === false ? (
                            <Tooltip title="Telefone inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(additional_phone); }}
                                style={{
                                    color: "#8c8c8c",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            key: "additional_operadora",
            title: "Operadora",
            dataIndex: "additional_operadora",
            width: 160,
            render: (_, record) => record.additional_phone_validation?.operadora ?? "-",
        },
        {
            key: "whatsapp",
            title: "WhatsApp",
            dataIndex: "whatsapp",
            width: 140,
            render: (_, record) => record.whatsapp ?? "-",
        },
        {
            key: "email",
            title: "Email",
            dataIndex: "email",
            width: 240,
            ellipsis: true,
            render: (email: string, record) => {


                const isValid = record.email_validation?.valid;

                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <Tooltip placement="topLeft" title={email} overlayInnerStyle={{ fontSize: 12 }}>
                            <span
                                style={{
                                    display: "block",
                                    maxWidth: 240,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {email}
                            </span>
                        </Tooltip>

                        {isValid === true ? (
                            <Tooltip title="Email válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            </Tooltip>
                        ) : isValid === false ? (
                            <Tooltip title="Email inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(email); }}
                                style={{
                                    color: "#8c8c8c",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
        // {
        //     key: "crm_status",
        //     title: "CRM",
        //     dataIndex: "crm_status",
        //     width: 120,
        //     ellipsis: true,
        // },
        {
            key: "origem",
            title: "Origem",
            dataIndex: "origem",
            width: 180,
            ellipsis: true,
            render: (origem: string) => origem || "-",
        },
        {
            key: "channel",
            title: "Canal",
            dataIndex: "channel",
            width: 140,
            ellipsis: true,
            render: (channel: string) => renderCopyableText(channel),
        },
        {
            key: "campaign",
            title: "Campanha",
            dataIndex: "campaign",
            width: 180,
            ellipsis: true,
            render: (campaign: string) => renderCopyableText(campaign),
        },
        {
            key: "purchase_intent",
            title: "Intenção de compra",
            dataIndex: "purchase_intent",
            width: 180,
            ellipsis: true,
            render: (purchaseIntent: string) => renderCopyableText(purchaseIntent),
        },
        {
            key: "purchase_intent_plan_price",
            title: "Preço do plano",
            dataIndex: "purchase_intent_plan_price",
            width: 180,
            ellipsis: true,
            render: (purchaseIntentPlanPrice: number | null) => <span className="flex">R$ {renderCopyableText(purchaseIntentPlanPrice?.toString() ?? "-")}</span>,
        },
        {
            key: "landing_page",
            title: "Landing page",
            dataIndex: "landing_page",
            width: 180,
            ellipsis: true,
            render: (landingPage: string) => {


                return renderCopyableText(landingPage);
            },
        },
        {
            key: "cep",
            title: "CEP",
            dataIndex: "cep",
            width: 120,
            render: (cep: string) => {


                return renderCopyableText(cep);
            },
        },

        {
            key: "uf",
            title: "UF",
            dataIndex: "uf",
            width: 160,
            render: (_, record) => renderCopyableText(record.uf),
        }, {
            key: "city",
            title: "Cidade",
            dataIndex: "city",
            width: 160,
            render: (city: string) => renderCopyableText(city),
        },
        {
            key: "district",
            title: "Bairro",
            dataIndex: "district",
            width: 160,
            ellipsis: true,
            render: (district: string) => renderCopyableText(district),
        },
        {
            key: "address",
            title: "Endereço",
            dataIndex: "address",
            width: 180,
            render: (_, record) => {
                const value = record.address;



                return renderCopyableText(value);
            },
        },
        {
            key: "number",
            title: "Número",
            dataIndex: "number",
            width: 100,
            render: (numberValue: string) => {


                return renderCopyableText(numberValue);
            },
        },

        {
            title: "Coordenadas",
            dataIndex: "geolocation",
            width: 180,
            render: (geolocation) => {


                const coordenadas = `Lat: ${geolocation?.latitude}\nLong: ${geolocation?.longitude}`;

                return (
                    <Tooltip placement="topLeft" title={coordenadas} overlayInnerStyle={{ fontSize: 12 }}>
                        <div style={{ whiteSpace: "nowrap" }}>
                            <div>Lat: {geolocation?.latitude}</div>
                            <div>Long: {geolocation?.longitude}</div>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: "Maps",
            dataIndex: ["geolocation", "maps_link"],
            width: 80,
            ellipsis: { showTitle: false },
            render: (maps_link) =>
                maps_link ? (
                    <div className="flex items-center justify-center">
                        <Tooltip placement="topLeft" title={maps_link} overlayInnerStyle={{ fontSize: 12 }}>
                            <Button
                                style={{ width: 32, height: 32, padding: 0 }}
                                type="default"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    window.open(maps_link, "_blank");
                                }}
                            >
                                <MapIcon size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            title: "Street View",
            dataIndex: ["geolocation", "street_view_link"],
            width: 110,
            ellipsis: { showTitle: false },
            render: (street_view_link) =>
                street_view_link ? (
                    <div className="flex items-center justify-center">
                        <Tooltip placement="topLeft" title={street_view_link} overlayInnerStyle={{ fontSize: 12 }}>
                            <Button

                                style={{ width: 32, height: 32, padding: 0 }}
                                type="default"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    window.open(street_view_link, "_blank");
                                }}
                            >
                                <MapPinned size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    "-"
                ),
        },
    ];
}
