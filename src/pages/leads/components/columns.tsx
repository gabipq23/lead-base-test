
import { Button, Tag, Tooltip, type TableColumnsType } from "antd";
import { CheckCircle2, MapIcon, MapPinned, Mars, Venus, XCircle } from "lucide-react";

import type { ILead } from "@/types/ILead.type";
import { formatCEP, formatCPF } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import { getPersonData } from "@/pages/orders/common/components/columns";
import { normalizeNames } from "@/utils/orders.util";

import { ElapsedTimeCell } from "./timer";
import { getElapsedMs } from "@/utils/elapsedTime";

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


export function getStatusColor(status: string): string {
    const normalized = status.toUpperCase();

    if (normalized === "DISPONIVEL") return "green";
    if (normalized === "RESERVADO") return "red";
    if (normalized === "VENDIDO") return "blue";
    return "default";
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
    showReservationInfo?: boolean;
    now: number;
}

export function getColumns(options: GetColumnsOptions): TableColumnsType<ILead> {
    const { showReservationInfo = false, now } = options;

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
        ...(showReservationInfo
            ? [
                {
                    key: "reserved_at",
                    title: "Reservado em",
                    dataIndex: "reserved_at",
                    width: 140,
                    render: (reservedAt: string | null) => reservedAt ?? "-",
                },
                {
                    key: "reserved_by_user_id",
                    title: "Reservado por",
                    dataIndex: "reserved_by_user_id",
                    width: 130,
                    render: (userId: number | null) => userId ?? "-",
                },
            ]
            : []),
        {
            key: "created_at",
            title: "Criado em",
            dataIndex: "created_at",
            width: 100,
            render: (createdAt: string) => createdAt ?? "-",
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

                if (!full_name) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 140,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

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

                return formatCPF(cpf);
            },
        }, {
            key: "mother_name",
            title: "Nome da mãe",
            dataIndex: "mother_name",
            width: 180,
            ellipsis: true,
            render: (motherName: string) => {
                if (!motherName) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 160,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                return motherName;
            },
        },
        {
            key: "birth_date",
            title: "Nascimento",
            dataIndex: "birth_date",
            width: 140,
            render: (birthDate: string) => {
                if (!birthDate) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 90,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                return birthDate;
            },
        },
        {
            key: "age",
            title: "Idade",
            dataIndex: "age",
            width: 90,
            render: (age: number | string) => {

                return age || "-";
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
                const isValid = record.is_phone_valid;

                const validationIcon =
                    isValid === true ? (
                        <Tooltip title="Telefone válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        </Tooltip>
                    ) : isValid === false ? (
                        <Tooltip title="Telefone inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        </Tooltip>
                    ) : null;

                if (!phone) {
                    return (
                        <div className="flex items-center gap-1 min-w-0">
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 120,
                                    height: 16,
                                    borderRadius: 4,
                                    background: "#d9d9d9",
                                    filter: "blur(4px)",
                                }}
                            />
                            {validationIcon}
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="truncate">{formatPhoneNumber(phone)}</span>
                        {validationIcon}
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
        },
        {
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
                const isValid = record.is_additional_phone_valid;

                const validationIcon =
                    isValid === true ? (
                        <Tooltip title="Telefone válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        </Tooltip>
                    ) : isValid === false ? (
                        <Tooltip title="Telefone inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        </Tooltip>
                    ) : null;

                if (!additional_phone) {
                    return (
                        <div className="flex items-center gap-1 min-w-0">
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 120,
                                    height: 16,
                                    borderRadius: 4,
                                    background: "#d9d9d9",
                                    filter: "blur(4px)",
                                }}
                            />
                            {validationIcon}
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="truncate">
                            {formatPhoneNumber(additional_phone)}
                        </span>
                        {validationIcon}
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
                const isValid = record.is_email_valid;

                const validationIcon =
                    isValid === true ? (
                        <Tooltip title="Email válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        </Tooltip>
                    ) : isValid === false ? (
                        <Tooltip title="Email inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        </Tooltip>
                    ) : null;

                if (!email) {
                    return (
                        <div className="flex items-center gap-1 min-w-0">
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 200,
                                    height: 16,
                                    borderRadius: 4,
                                    background: "#d9d9d9",
                                    filter: "blur(4px)",
                                }}
                            />
                            {validationIcon}
                        </div>
                    );
                }

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
            render: (channel: string) => channel || "-",
        },
        {
            key: "campaign",
            title: "Campanha",
            dataIndex: "campaign",
            width: 180,
            ellipsis: true,
            render: (campaign: string) => campaign,
        },
        {
            key: "purchase_intent",
            title: "Intenção de compra",
            dataIndex: "purchase_intent",
            width: 180,
            ellipsis: true,
            render: (purchaseIntent: string) => purchaseIntent,
        },
        {
            key: "purchase_intent_plan_price",
            title: "Preço do plano",
            dataIndex: "purchase_intent_plan_price",
            width: 180,
            ellipsis: true,
            render: (purchaseIntentPlanPrice: number | null) => <p className="flex">R$ {purchaseIntentPlanPrice?.toString() ?? "-"}</p>,
        },
        {
            key: "landing_page",
            title: "Landing page",
            dataIndex: "landing_page",
            width: 180,
            ellipsis: true,
            render: (landingPage: string) => {
                if (!landingPage) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 140,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                return landingPage;
            },
        },
        {
            key: "cep",
            title: "CEP",
            dataIndex: "cep",
            width: 120,
            render: (cep: string, record) => {
                const isValid = record.is_cep_valid;

                const validationIcon =
                    isValid === true ? (
                        <Tooltip title="CEP válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        </Tooltip>
                    ) : isValid === false ? (
                        <Tooltip title="CEP inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        </Tooltip>
                    ) : null;

                if (!cep) {
                    return (<div className="flex items-center gap-1 min-w-0">
                        <span
                            style={{
                                display: "inline-block",
                                width: 90,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />  {validationIcon}
                    </div>
                    );
                }
                return (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="truncate">{formatCEP(cep)}</span>
                        {validationIcon}
                    </div>
                );

            },
        },

        {
            key: "uf",
            title: "UF",
            dataIndex: "uf",
            width: 160,
            render: (uf: string) => uf,
        }, {
            key: "city",
            title: "Cidade",
            dataIndex: "city",
            width: 160,
            render: (city: string) => city,
        },
        {
            key: "district",
            title: "Bairro",
            dataIndex: "district",
            width: 160,
            ellipsis: true,
            render: (district: string) => district,
        },
        {
            key: "address",
            title: "Endereço",
            dataIndex: "address",
            width: 180,
            render: (_, record) => {
                const value = record.address;

                if (!value) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 150,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                return value;
            },
        },
        {
            key: "number",
            title: "Número",
            dataIndex: "number",
            width: 100,
            render: (numberValue: string) => {
                if (!numberValue) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 50,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                return numberValue;
            },
        },

        {
            title: "Coordenadas",
            dataIndex: "geolocation",
            width: 180,
            render: (geolocation) => {
                if (!geolocation?.latitude || !geolocation?.longitude) {
                    return (
                        <span
                            style={{
                                display: "inline-block",
                                width: 140,
                                height: 16,
                                borderRadius: 4,
                                background: "#d9d9d9",
                                filter: "blur(4px)",
                            }}
                        />
                    );
                }

                const coordenadas = `Lat: ${geolocation.latitude}\nLong: ${geolocation.longitude}`;

                return (
                    <Tooltip placement="topLeft" title={coordenadas} overlayInnerStyle={{ fontSize: 12 }}>
                        <div style={{ whiteSpace: "nowrap" }}>
                            <div>Lat: {geolocation.latitude}</div>
                            <div>Long: {geolocation.longitude}</div>
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
            render: (maps_link, record) =>
                maps_link ? (
                    <div className="flex items-center justify-center">
                        <Tooltip placement="topLeft" title={maps_link} overlayInnerStyle={{ fontSize: 12 }}>
                            <Button
                                disabled={record.is_reserved}
                                style={{ width: 32, height: 32, padding: 0 }}
                                type="default"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (record.is_reserved) return;
                                    window.open(maps_link, "_blank");
                                }}
                            >
                                <MapIcon size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <span
                        style={{
                            display: "inline-block",
                            width: 32,
                            height: 16,
                            borderRadius: 6,
                            background: "#d9d9d9",
                            filter: "blur(4px)",
                        }}
                    />
                ),
        },
        {
            title: "Street View",
            dataIndex: ["geolocation", "street_view_link"],
            width: 110,
            ellipsis: { showTitle: false },
            render: (street_view_link, record) =>
                street_view_link ? (
                    <div className="flex items-center justify-center">
                        <Tooltip placement="topLeft" title={street_view_link} overlayInnerStyle={{ fontSize: 12 }}>
                            <Button
                                disabled={record.is_reserved}
                                style={{ width: 32, height: 32, padding: 0 }}
                                type="default"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (record.is_reserved) return;
                                    window.open(street_view_link, "_blank");
                                }}
                            >
                                <MapPinned size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <span
                        style={{
                            display: "inline-block",
                            width: 32,
                            height: 16,
                            borderRadius: 6,
                            background: "#d9d9d9",
                            filter: "blur(4px)",
                        }}
                    />
                ),
        },
    ];
}
