import { Button, message, Tooltip, type TableColumnsType } from "antd";
import {
    AlertCircle,
    CheckCircle2,
    MapIcon,
    MapPinned,
    Mars,
    Monitor,
    Smartphone,
    Tablet,
    Venus,
    XCircle,
} from "lucide-react";
import { formatCEP, formatCNPJ, formatCPF, formatRG } from "@/utils/document.util";
import { formatPhoneNumber } from "@/utils/number.utils";
import {
    formatBrowserDisplay,
    formatOSDisplay,
    formatResolution,
    normalizeCompanyPartners,
    normalizeNames,
} from "@/utils/orders.util";
import type {
    OrderBase,
    OrderCompanyPartner,
    OrderFingerprint,
    OrderGeolocation,
    OrderWhatsAppInfo,
} from "@/types/orders/base.type";
import { CopyOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Thermometer } from "@/layout/common-components/Thermomter";
import anonymousAvatar from "@/assets/anonymous_avatar.png";

export type OrderCommonRecord = OrderBase & {
    rfb_name?: string | null;
    rfb_birth_date?: string | null;
    rfb_mother_name?: string | null;
    rfb_gender?: string | null;
    phone_valid?: boolean | number | null;
    is_email_valid?: boolean | null;
    is_mei?: boolean | null;
    is_socio?: boolean | null;
    company_partners?: Array<OrderCompanyPartner> | string | null;
    portability?: string | null;
    whatsapp?: OrderWhatsAppInfo | null;
    geolocation?: OrderGeolocation | null;
    client_ip?: string | null;
    ip_isp?: string | null;
    ip_access_type?: string | null;
    fingerprint?: OrderFingerprint | null;
    fingerprint_id?: string | null;
    crm_id?: string | number | null;
    service?: string | null;
    installation?: string | null;
    pf_temperature?: number | null;
};

export type SharedOrderRecord = OrderCommonRecord & {
    debit?: boolean | number | string | null;
    credit?: boolean | number | string | null;
};

const handleCopy = (value: string | null | undefined) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    message.success("Copiado!");
};
// Helper no topo do componente ou arquivo
export const getPersonData = (record: any) => {
    if (record.client_type === "PJ") {
        return {
            email: record.manager?.email,
            cpf: record.manager?.cpf,
            rg: record.manager?.rg,
            full_name: record.manager?.name,
            birth_date: record.manager?.birth_date,
            rfb_mother_name: record.manager?.mother_full_name,
            phone: record.manager?.phone
        };
    }
    // PF — usa os campos diretos do record
    return {
        cpf: record.cpf,
        rg: record.rg,
        full_name: record.full_name,
        birth_date: record.birth_date,
        email: record.email,
        rfb_mother_name: record.rfb_mother_name ?? record.mother_full_name,
        phone: record.phone
    };
};

export function getSharedOrderColumnsBefore<T extends OrderCommonRecord>(): TableColumnsType<T> {
    return [
        {
            title: "",
            dataIndex: "consultant_notes",
            width: 30,
            render: (consultant_notes) => (
                <Tooltip
                    placement="top"
                    title={consultant_notes?.[consultant_notes.length - 1]?.obs || consultant_notes || "Sem observações"}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {consultant_notes && <ExclamationCircleOutlined />}
                </Tooltip>
            ),
        },
        {
            title: "",
            dataIndex: "whatsapp",
            width: 80,
            render: (whatsapp, record) => {
                const avatarSrc = whatsapp?.avatar || anonymousAvatar;

                if (record.pf_temperature === 10) {
                    return (
                        <div className="flex bg-[#d63535] rounded-full w-9 h-9 items-center justify-center relative">


                            <img
                                src={avatarSrc}
                                className="rounded-full w-9 h-9 object-cover"
                            />
                            <div className="text-sm absolute -top-1 -right-1 flex items-center justify-center">
                                🔥
                            </div>

                        </div>
                    );
                }
                return (

                    <img
                        src={avatarSrc}
                        className="rounded-full w-9 h-9 object-cover"
                    />
                );
            },
        },
        {
            title: "Temperatura",
            dataIndex: "pf_temperature",
            width: 140,
            render: (pf_temperature) => (
                <div className="flex w-30 h-2 items-center gap-1 mr-4">
                    {" "}
                    <Thermometer min={0} max={10} value={pf_temperature || 0} />
                </div>
            ),
        },
        {
            title: "ID",
            dataIndex: "order_number",
            width: 160,
            render: (order_number, record) =>
            (
                <div className="flex items-center gap-1">{order_number ? order_number : record.id}
                    {(order_number || record.id) && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                        <CopyOutlined
                            onClick={(e) => { e.stopPropagation(); handleCopy(order_number || record.id); }}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>}</div>
            )
        },
        {
            title: "Abertura",
            dataIndex: "created_at",
            width: 110,
            render: (created_at) =>
            (
                <div className="flex items-center gap-1">{created_at}
                    {created_at && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                        <CopyOutlined
                            onClick={(e) => { e.stopPropagation(); handleCopy(created_at); }}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>}</div>
            )
        },
        {
            title: "Pedido",
            dataIndex: "status",
            render: (status: string) =>
                status === "ABERTO" || status === "aberto"
                    ? "Aberto"
                    : status === "FECHADO" || status === "fechado"
                        ? "Fechado"
                        : status === "CANCELADO" || status === "cancelado"
                            ? "Cancelado"
                            : status === "TRANSBORDO" || status === "transbordo"
                                ? "Transbordo"
                                : "-",
            width: 80,
        },
        {
            title: "Tramitação",
            ellipsis: {
                showTitle: false,
            },
            dataIndex: "after_sales_status",
            width: 155,

            render: (after_sales_status) => (
                <Tooltip
                    placement="topLeft"
                    title={after_sales_status}
                    overlayInnerStyle={{ fontSize: 12 }}
                >
                    {after_sales_status || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Recadastro",
            dataIndex: "number_attempts_second_call",
            width: 110,
            render: (number_attempts_second_call) => number_attempts_second_call || "-",
            filters: [
                { text: "1", value: 1 },
                { text: "2", value: 2 },
                { text: "3", value: 3 },
                { text: "4", value: 4 },
                { text: "5", value: 5 },
            ],
            onFilter: (value, record) => record.number_attempts_second_call === value,
        },
        {
            title: "Transbordo",
            dataIndex: "transhipment",
            width: 110,
            render: (transhipment) => transhipment ? "Sim" : "Não",
            filters: [
                { text: "Sim", value: true },
                { text: "Não", value: false },
            ],
            onFilter: (value, record) => record.transhipment === value,
        },
        {
            title: "Suporte",
            dataIndex: "support",
            width: 110,
            render: (support) => support === "ligacao" ? "Ligação" : support === "whatsapp" ? "Whatsapp" : "-",
            filters: [
                { text: "Ligação", value: "ligacao" },
                { text: "Whatsapp", value: "whatsapp" },

            ],
            onFilter: (value, record) => record.support === value,
        },
    ] as TableColumnsType<T>;
}

export function getSharedOrderColumnsAfter<T extends OrderCommonRecord>(): TableColumnsType<T> {
    return [
        {
            title: "CPF",
            dataIndex: "cpf",
            width: 140,
            render: (_, record) => {
                const { cpf } = getPersonData(record);
                return (
                    <div className="flex items-center gap-1">
                        {cpf ? formatCPF(cpf) : "-"}
                        {cpf && (
                            <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                                <CopyOutlined
                                    onClick={(e) => { e.stopPropagation(); handleCopy(cpf); }}
                                    style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                                />
                            </Tooltip>
                        )}
                    </div>
                );
            },
            filters: [
                { text: "Preenchido", value: "preenchido" },
                { text: "Vazio", value: "vazio" },
            ],
            onFilter: (value, record) => {
                const { cpf } = getPersonData(record);
                if (value === "preenchido") {
                    return cpf !== null && cpf !== undefined && cpf !== "";
                }

                if (value === "vazio") {
                    return cpf === null || cpf === undefined || cpf === "";
                }

                return true;
            },
        },
        {
            title: "RG",
            dataIndex: "rg",
            width: 140,
            render: (_, record) => {
                const { rg } = getPersonData(record);
                return (
                    <div className="flex items-center gap-1">
                        {rg ? formatRG(rg?.number) : "-"}
                        {rg && (
                            <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                                <CopyOutlined
                                    onClick={(e) => { e.stopPropagation(); handleCopy(rg?.number); }}
                                    style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                                />
                            </Tooltip>
                        )}
                    </div>
                );
            },
            filters: [
                { text: "Preenchido", value: "preenchido" },
                { text: "Vazio", value: "vazio" },
            ],
            onFilter: (value, record) => {
                const { rg } = getPersonData(record);
                if (value === "preenchido") {
                    return rg !== null && rg !== undefined && rg.number !== "";
                }

                if (value === "vazio") {
                    return rg === null || rg === undefined || rg.number === "";
                }

                return true;
            },
        },
        {
            title: "Nome",
            dataIndex: "full_name",
            width: 140,
            render: (_, record) => {
                const { full_name } = getPersonData(record);
                const isNamesMatch = record.client_type === "PF"
                    ? normalizeNames(full_name, record.rfb_name)
                    : null;

                return full_name ? (
                    <div className="flex items-center gap-1 min-w-0">

                        <Tooltip placement="topLeft" title={full_name} overlayInnerStyle={{ fontSize: 12 }}>
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
                            <Tooltip title="Nome confere com RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            </Tooltip>
                        ) : isNamesMatch === false ? (
                            <Tooltip title="Nome diferente da RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(full_name); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>
                    </div>
                ) : "-";
            },
        },
        {
            title: "Gênero",
            dataIndex: "rfb_gender",
            width: 80,
            render: (rfb_gender) =>
                rfb_gender === "M" ? (
                    <div className="flex items-center justify-center">
                        <Mars color="blue" size={17} />
                    </div>
                ) : rfb_gender === "F" ? (
                    <div className="flex items-center justify-center">
                        <Venus color="magenta" size={18} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center">-</div>
                ),
        },
        {
            title: "Data de Nascimento",
            dataIndex: "birth_date",
            width: 150,
            render: (_, record) => {
                const { birth_date } = getPersonData(record);
                const compareDates = (date1?: string | null, date2?: string | null) => {
                    if (!date1 || !date2) return null;
                    return date1.trim() === date2.trim();
                };

                const isDatesMatch = record.client_type === "PF" && birth_date && birth_date !== "00/00/0000"
                    ? compareDates(birth_date, record.rfb_birth_date)
                    : null; // PJ não tem comparação RFB

                return (
                    <span className="flex items-center gap-1">
                        {birth_date && birth_date !== "00/00/0000" ? birth_date : "-"}
                        {isDatesMatch === true ? (
                            <Tooltip title="Data de nascimento confere com RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isDatesMatch === false ? (
                            <Tooltip title="Data de nascimento diferente da RFB" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Tooltip>
                        ) : null}  {birth_date && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(birth_date); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>}
                    </span>
                );
            },
        },
        {
            title: "Nome da Mãe",
            dataIndex: "rfb_mother_name",
            width: 140,
            render: (_, record) => {
                const { rfb_mother_name } = getPersonData(record);

                return rfb_mother_name ? (
                    <div className="flex items-center gap-1 min-w-0">
                        <Tooltip placement="topLeft" title={rfb_mother_name} overlayInnerStyle={{ fontSize: 12 }}>
                            <span
                                style={{
                                    display: "block",
                                    maxWidth: 140,        // ajuste conforme necessário
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {rfb_mother_name}
                            </span>
                        </Tooltip>

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(rfb_mother_name); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>
                    </div>
                ) : "-";
            },
        },
        {
            title: "CNPJ",
            dataIndex: "cnpj",
            width: 160,
            render: (cnpj, record) => {
                if (record.client_type !== "PJ") return "-";
                return (
                    <div className="flex items-center gap-1">
                        {cnpj ? formatCNPJ(cnpj) : "-"}
                        {cnpj && (
                            <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                                <CopyOutlined
                                    onClick={(e) => { e.stopPropagation(); handleCopy(cnpj); }}
                                    style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                                />
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Razão Social",
            dataIndex: "company_legal_name",
            width: 140,
            render: (company_legal_name, record) => {
                if (record.client_type !== "PJ") return "-";

                return company_legal_name ? (
                    <div className="flex items-center gap-1 min-w-0">
                        <Tooltip placement="topLeft" title={company_legal_name} overlayInnerStyle={{ fontSize: 12 }}>
                            <span
                                style={{
                                    display: "block",
                                    maxWidth: 140,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {company_legal_name}
                            </span>
                        </Tooltip>

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(company_legal_name); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>
                    </div>
                ) : "-";
            },
        },
        {
            title: "MEI",
            dataIndex: "is_mei",
            width: 70,
            render: (is_mei) => (is_mei ? "Sim" : is_mei === undefined || is_mei === null ? "-" : "Não"),
        },
        {
            title: "Sócio",
            dataIndex: "is_socio",
            width: 70,
            render: (is_socio) =>
                is_socio ? "Sim" : is_socio === undefined || is_socio === null ? "-" : "Não",
        },
        {
            title: "Empresas",
            dataIndex: "company_partners",
            width: 210,
            ellipsis: { showTitle: false },
            render: (company_partners) => {
                const companies = normalizeCompanyPartners(company_partners);

                if (!companies.length) return "-";

                const empresasFormatadas = companies
                    .map((empresa) => `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`)
                    .join("; \n");

                return (
                    <Tooltip
                        placement="topLeft"
                        title={<div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>}
                        overlayInnerStyle={{ fontSize: 12 }}
                    >
                        {empresasFormatadas}
                    </Tooltip>
                );
            },
        },
        {
            title: "Telefone",
            dataIndex: "phone",
            width: 180,
            render: (_, record) => {

                const { phone } = getPersonData(record);
                if (!phone) return "-";

                const isValid = Number(record.phone_valid);

                return (
                    <span className="flex items-center gap-1">
                        {formatPhoneNumber(phone)}
                        {isValid === 1 ? (
                            <Tooltip title="Válido na ANATEL" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValid === 0 ? (
                            <Tooltip title="Inválido na ANATEL" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Tooltip>
                        ) : null}   {phone && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(phone); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>}
                    </span>
                );
            },
            filters: [
                { text: "Preenchido", value: "preenchido" },
                { text: "Vazio", value: "vazio" },
            ],
            onFilter: (value, record) => {
                if (value === "preenchido") {
                    return record.phone !== null && record.phone !== undefined && record.phone !== "";
                }

                if (value === "vazio") {
                    return record.phone === null || record.phone === undefined || record.phone === "";
                }

                return true;
            },
        },
        {
            title: "Portado",
            dataIndex: "portability",
            width: 90,
            render: (portability) => portability || "-",
        },
        {
            title: "Whatsapp",
            dataIndex: ["whatsapp", "is_comercial"],
            width: 90,
            render: (is_comercial, record) => {
                const whatsappData = record?.whatsapp;
                const hasInvalidPhoneError =
                    (whatsappData as { erro?: string } | null)?.erro === "Telefone inválido";

                if (hasInvalidPhoneError || whatsappData?.sucesso === false) {
                    return <div className="flex items-center justify-center">Não</div>;
                }

                if (whatsappData?.existe_no_whatsapp === false) {
                    return <div className="flex items-center justify-center">Não</div>;
                }

                return (
                    <div className="flex items-center justify-center">
                        {is_comercial === true ? (
                            <Tooltip title="Business" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <img src="/assets/whatsapp-business.png" alt="Business" className="h-6 w-6" />
                            </Tooltip>
                        ) : is_comercial === false ? (
                            <Tooltip title="Messenger" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <img src="/assets/whatsapp-messenger.png" alt="Messenger" className="h-6 w-6" />
                            </Tooltip>
                        ) : (
                            "-"
                        )}
                    </div>
                );
            },
        },
        {
            title: "Telefone Adicional",
            dataIndex: "additional_phone",
            width: 180,
            render: (_, record) => {
                if (!record.additional_phone) return "-";

                const isValid = Number(record.additional_phone_valid
                );

                return (
                    <span className="flex items-center gap-1">
                        {formatPhoneNumber(record.additional_phone)}
                        {isValid === 1 ? (
                            <Tooltip title="Válido na ANATEL" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValid === 0 ? (
                            <Tooltip title="Inválido na ANATEL" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Tooltip>
                        ) : null}   {record.additional_phone && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(record.additional_phone); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>}
                    </span>
                );
            },
            filters: [
                { text: "Preenchido", value: "preenchido" },
                { text: "Vazio", value: "vazio" },
            ],
            onFilter: (value, record) => {
                if (value === "preenchido") {
                    return record.phone !== null && record.phone !== undefined && record.phone !== "";
                }

                if (value === "vazio") {
                    return record.phone === null || record.phone === undefined || record.phone === "";
                }

                return true;
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            width: 200,
            render: (_, record) => {
                const { email } = getPersonData(record);
                const isEmailValid = record.is_email_valid;

                return email ? (
                    <div className="flex items-center gap-1 min-w-0">
                        <Tooltip placement="topLeft" title={email} overlayInnerStyle={{ fontSize: 12 }}>
                            <span
                                style={{
                                    display: "block",
                                    maxWidth: 140,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {email}
                            </span>
                        </Tooltip>

                        {isEmailValid === true ? (
                            <Tooltip title="Email válido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            </Tooltip>
                        ) : isEmailValid === false ? (
                            <Tooltip title="Email inválido" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(email); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>
                    </div>
                ) : "-";
            },
        },
        {
            title: "CEP",
            dataIndex: "zip_code",
            width: 130,
            render: (_, record) => {
                if (!record.zip_code) return "-";

                const isValidCep = record.address && record.district && record.city && record.state;
                const isCepUnico = record.single_zip_code;

                return (
                    <span className="flex items-center gap-1">
                        {formatCEP(record.zip_code)}
                        {isCepUnico ? (
                            <Tooltip
                                title="CEP único para localidade. Dados inseridos manualmente pelo usuário. Sujeito a erro de digitação."
                                placement="top"
                                overlayInnerStyle={{ fontSize: 12 }}
                            >
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                            </Tooltip>
                        ) : isValidCep ? (
                            <Tooltip title="CEP válido com endereço completo" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : (
                            <Tooltip title="CEP inválido ou incompleto" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Tooltip>
                        )}  {record.zip_code && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => { e.stopPropagation(); handleCopy(record.zip_code); }}
                                style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                            />
                        </Tooltip>}
                    </span>
                );
            },
        },

        {
            title: "CEP Único",
            dataIndex: "single_zip_code",
            width: 90,
            render: (single_zip_code) => single_zip_code ? 'Sim' : 'Não',
        },
        {
            title: "Endereço",
            dataIndex: "address",
            width: 160,
            render: (address) => address ? (
                <div className="flex items-center gap-1 min-w-0">
                    <Tooltip placement="topLeft" title={address} overlayInnerStyle={{ fontSize: 12 }}>
                        <span
                            style={{
                                display: "block",
                                maxWidth: 140,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {address}
                        </span>
                    </Tooltip>

                    <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                        <CopyOutlined
                            onClick={(e) => { e.stopPropagation(); handleCopy(address); }}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>
                </div>
            ) : "-",
        },
        {
            title: "Número",
            dataIndex: "address_number",
            width: 80,
            render: (address_number) =>
            (
                <div className="flex items-center gap-1">{address_number}
                    {address_number && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                        <CopyOutlined
                            onClick={(e) => { e.stopPropagation(); handleCopy(address_number); }}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>}</div>
            )
        },
        {
            title: "Complemento",
            dataIndex: "address_complement",
            width: 140,
            render: (addressComplement) => {
                const complement =
                    addressComplement?.building_or_house === "house"
                        ? (addressComplement.home_complement && addressComplement.home_complement)
                        : addressComplement?.building_or_house === "building"
                            ? (addressComplement.unit_type && addressComplement.unit_number && `${addressComplement.unit_type} ${addressComplement.unit_number}`)
                            : "-";

                const hasCopy = addressComplement?.home_complement || addressComplement?.unit_type || addressComplement?.unit_number;

                return complement && complement !== "-" ? (
                    <div className="flex items-center gap-1 min-w-0">
                        <Tooltip placement="topLeft" title={complement} overlayInnerStyle={{ fontSize: 12 }}>
                            <span
                                style={{
                                    display: "block",
                                    maxWidth: hasCopy ? 100 : 140,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {complement}
                            </span>
                        </Tooltip>

                        {hasCopy && (
                            <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                                <CopyOutlined
                                    onClick={(e) => { e.stopPropagation(); handleCopy(complement); }}
                                    style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                                />
                            </Tooltip>
                        )}
                    </div>
                ) : "-";
            },
        },
        {
            title: "Bairro",
            dataIndex: "district",
            width: 120,
            render: (district) => district ? (
                <div className="flex items-center gap-1 min-w-0">
                    <Tooltip placement="topLeft" title={district} overlayInnerStyle={{ fontSize: 12 }}>
                        <span
                            style={{
                                display: "block",
                                maxWidth: 120,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {district}
                        </span>
                    </Tooltip>

                    <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                        <CopyOutlined
                            onClick={(e) => { e.stopPropagation(); handleCopy(district); }}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>
                </div>
            ) : "-",
        },
        {
            title: "Cidade",
            dataIndex: "city",
            width: 120,
            render: (city) => (
                <div className="flex items-center max-w-full">
                    <div className="min-w-0 overflow-hidden">
                        <Tooltip
                            placement="topLeft"
                            title={city}
                            overlayInnerStyle={{ fontSize: 12 }}
                        >
                            <span className="block truncate">
                                {city || "-"}
                            </span>
                        </Tooltip>
                    </div>
                    {city && (
                        <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                            <CopyOutlined
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(city);
                                }}
                                className="ml-1 shrink-0"
                                style={{ color: "#8c8c8c", cursor: "pointer" }}
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        },
        {
            title: "UF",
            dataIndex: "state",
            width: 60,
            render: (state) =>
            (
                <div className="flex items-center gap-1">{state}
                    {state && <Tooltip title="Copiar" overlayInnerStyle={{ fontSize: 12 }}>
                        <CopyOutlined
                            onClick={(e) => { e.stopPropagation(); handleCopy(state); }}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>}</div>
            )
        },
        {
            title: "Coordenadas",
            dataIndex: "geolocation",
            width: 180,
            render: (geolocation) => {
                if (!geolocation || !geolocation.latitude || !geolocation.longitude) {
                    return "-";
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
                                tabIndex={0}
                            >
                                <MapIcon size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center"><span>-</span></div>
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
                                tabIndex={0}
                            >
                                <MapPinned size={17} />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex items-center justify-center"><span>-</span></div>
                ),
        },
        {
            title: "URL",
            dataIndex: "url",
            width: 140,
            ellipsis: { showTitle: false },
            render: (url) => (
                <Tooltip placement="topLeft" title={url} overlayInnerStyle={{ fontSize: 12 }}>
                    {url || "-"}
                </Tooltip>
            ),
        },
        {
            title: "IP do Cliente",
            dataIndex: "client_ip",
            width: 120,
            render: (client_ip) => client_ip || "-",
        },
        {
            title: "Provedor",
            dataIndex: "ip_isp",
            width: 120,
            ellipsis: { showTitle: false },
            render: (ip_isp) => (
                <Tooltip placement="topLeft" title={ip_isp} overlayInnerStyle={{ fontSize: 12 }}>
                    {ip_isp || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Tipo de acesso",
            dataIndex: "ip_access_type",
            width: 120,
            render: (ip_access_type) =>
                ip_access_type === "movel"
                    ? "Móvel"
                    : ip_access_type === "fixo"
                        ? "Fixo"
                        : ip_access_type === "hosting"
                            ? "Hosting"
                            : ip_access_type === "proxy"
                                ? "Proxy"
                                : ip_access_type === "local"
                                    ? "Local"
                                    : ip_access_type === "desconhecido"
                                        ? "Desconhecido"
                                        : "-",
        },
        {
            title: "Dispositivo",
            dataIndex: ["fingerprint", "device"],
            width: 100,
            render: (device) => (
                <div className="flex items-center justify-center">
                    {device === "mobile" ? (
                        <Tooltip title="Mobile" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <Smartphone className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : device === "desktop" ? (
                        <Tooltip title="Desktop" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <Monitor className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : device === "tablet" ? (
                        <Tooltip title="Tablet" placement="top" overlayInnerStyle={{ fontSize: 12 }}>
                            <Tablet className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            title: "Plataforma",
            dataIndex: ["fingerprint", "os"],
            width: 140,
            ellipsis: { showTitle: false },
            render: (os) => formatOSDisplay(os),
        },
        {
            title: "Browser",
            dataIndex: ["fingerprint", "browser"],
            width: 140,
            ellipsis: { showTitle: false },
            render: (browser) => formatBrowserDisplay(browser),
        },
        {
            title: "TimeZone",
            dataIndex: ["fingerprint", "timezone"],
            width: 210,
            ellipsis: { showTitle: false },
            render: (timezone, record) => {
                const timezoneName = record?.fingerprint?.timezone_name;
                const value = [timezone, timezoneName].filter(Boolean).join(" - ");

                return (
                    <Tooltip placement="topLeft" title={value || "-"} overlayInnerStyle={{ fontSize: 12 }}>
                        {value || "-"}
                    </Tooltip>
                );
            },
        },
        {
            title: "Resolução",
            dataIndex: ["fingerprint", "resolution"],
            width: 120,
            render: (resolution) => formatResolution(resolution),
        },
        {
            title: "ID Fingerprint",
            dataIndex: "fingerprint_id",
            width: 120,
            ellipsis: { showTitle: false },
            render: (fingerprintId) => fingerprintId || "-",
        },
        {
            title: "Consultor",
            dataIndex: "responsible_consultant",
            width: 140,
            ellipsis: { showTitle: false },
            render: (responsible_consultant) => responsible_consultant || "-",
        },
        {
            title: "ID CRM",
            dataIndex: "crm_id",
            width: 120,
            ellipsis: { showTitle: false },
            render: (crm_id) => crm_id ? String(crm_id) : "-",
        },
        {
            title: "Atendimento",
            dataIndex: "service",
            width: 140,
            ellipsis: { showTitle: false },
            render: (service) => service === "em_andamento" ? "Em Andamento" : service === "concluido" ? "Concluído" : "-",
        },

    ] as TableColumnsType<T>;
}

export function getSharedOrderColumns<T extends OrderCommonRecord>(): TableColumnsType<T> {
    return [...getSharedOrderColumnsBefore<T>(), ...getSharedOrderColumnsAfter<T>()];
}
