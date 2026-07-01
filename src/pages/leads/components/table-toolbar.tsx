import { Button, DatePicker, Input, Select, Space, Typography } from "antd";
import { ReloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { UF_OPTIONS2 } from "@/utils/ufOptions";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
interface TableToolbarProps {
    searchText?: string;
    onSearchChange?: (value: string) => void;
    onRefresh: () => void;
    selectedCount?: number;
    onBuyLeads?: () => void;
    buyDisabled?: boolean;
    leftExtra?: ReactNode;
    lastUpdatedAt?: Date | null;
    showActions?: boolean;
    region?: string;
    uf?: string;
    city?: string;
    provider?: string;
    dateFrom?: string;
    dateTo?: string;
    onRegionChange?: (value?: string) => void;
    onUfChange?: (value?: string) => void;
    onCityChange?: (value?: string) => void;
    onProviderChange?: (value?: string) => void;
    onDateFromChange?: (value?: string) => void;
    onDateToChange?: (value?: string) => void;
}
function formatLastUpdated(date: Date): string {
    const time = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return `Atualizado às ${time}`;
}
export function TableToolbar({
    onRefresh,
    leftExtra,
    selectedCount = 0,
    onBuyLeads,
    buyDisabled,
    lastUpdatedAt,
    showActions,
    region,
    uf,
    city,
    provider,
    dateFrom,
    dateTo,
    onRegionChange,
    onUfChange,
    onCityChange,
    onProviderChange,
    onDateFromChange,
    onDateToChange,
}: TableToolbarProps) {

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
                gap: 8,
                flexWrap: "wrap",
            }}
        >
            <Space wrap className="mt-4 ">

                {/* <Input.Search

                    allowClear
                    placeholder="Pesquisar cidade ou UF"
                    value={searchText}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    style={{ width: 340 }}
                /> */}
                {/* REGIÃO */}
                <Select
                    placeholder="Região"
                    style={{ width: 140 }}
                    value={region}
                    options={[
                        { label: "Norte", value: "Norte" },
                        { label: "Nordeste", value: "Nordeste" },
                        { label: "Sul", value: "Sul" },
                        { label: "Sudeste", value: "Sudeste" },
                        { label: "Centro-Oeste", value: "Centro-Oeste" },
                    ]}
                    onChange={(value) => onRegionChange?.(value)}
                    allowClear

                />
                <Select
                    allowClear
                    placeholder="UF"
                    value={uf}
                    style={{ width: 70 }}
                    options={UF_OPTIONS2}
                    onChange={(value) => onUfChange?.(value)}
                />

                <Input
                    allowClear
                    placeholder="Cidade"
                    style={{ width: 140 }}
                    value={city}
                    onChange={(e) => onCityChange?.(e.target.value)}
                />


                <Input
                    allowClear
                    placeholder="Operadora"
                    style={{ width: 140 }}
                    value={provider}
                    onChange={(e) => onProviderChange?.(e.target.value)}
                />

                <RangePicker

                    style={{ width: 215 }}
                    value={
                        dateFrom && dateTo
                            ? [
                                dayjs(decodeURIComponent(dateFrom)),
                                dayjs(decodeURIComponent(dateTo)),
                            ]
                            : null
                    }
                    format="DD/MM/YYYY"
                    allowClear
                    placeholder={["de", "até"]}
                    onChange={(dates) => {
                        onDateFromChange?.(
                            dates?.[0]
                                ? dates[0].startOf("day").format("YYYY-MM-DD")
                                : undefined
                        );

                        onDateToChange?.(
                            dates?.[1]
                                ? dates[1].endOf("day").format("YYYY-MM-DD")
                                : undefined
                        );
                    }}
                />
                {leftExtra}

            </Space>

            {showActions && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    {lastUpdatedAt && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {formatLastUpdated(lastUpdatedAt)}
                        </Typography.Text>
                    )}
                    <Space>
                        <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            disabled={buyDisabled}
                            onClick={onBuyLeads}
                        >
                            Reservar Leads
                            {selectedCount > 0 && ` (${selectedCount})`}
                        </Button>

                        <Button
                            icon={<ReloadOutlined />}
                            onClick={onRefresh}
                        >
                            Atualizar
                        </Button>
                    </Space>


                </div>)}

        </div>
    );
}