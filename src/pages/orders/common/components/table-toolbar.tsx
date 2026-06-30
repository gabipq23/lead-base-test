import { useEffect, useState, type ReactNode } from "react";
import { DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
interface TableToolbarProps {
    searchText: string;
    regionText: string;
    onSearchChange: (value: string) => void;
    onRegionChange: (value: string) => void;
    onSearchClick?: () => void;
    statusText: string;
    onStatusChange: (value: string) => void;
    idText: string;
    onIdChange: (value: string) => void;
    categorySelect?: any;
    clientTypeSelect?: any;
    leftExtra?: ReactNode;
    dateFrom?: string | null;
    onDateFromChange: (value: string | null) => void;
    onDateToChange: (value: string | null) => void;
    dateTo?: string | null;

}

export function TableToolbar({
    searchText,
    regionText,
    onSearchChange,
    onRegionChange,
    statusText,
    onStatusChange,
    idText,
    onIdChange,
    categorySelect,
    clientTypeSelect,
    leftExtra,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
}: TableToolbarProps) {
    const [searchInput, setSearchInput] = useState(searchText);

    useEffect(() => {
        setSearchInput(searchText);
    }, [searchText]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                gap: 8,
                flexWrap: "wrap",
            }}
        >
            <Space wrap>

                <Input

                    style={{ width: 120 }}
                    value={idText}
                    placeholder="ID"
                    onChange={(e) => onIdChange(e.target.value)}
                    allowClear

                />
                {/* INPUT NOME */}
                <Input


                    placeholder="Nome ou Email"
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        onSearchChange(e.target.value);
                    }}
                    style={{ width: 200 }}
                    allowClear

                />

                {/* REGIÃO */}
                <Select
                    placeholder="Região"
                    style={{ width: 140 }}
                    value={regionText}
                    options={[
                        { label: "Norte", value: "Norte" },
                        { label: "Nordeste", value: "Nordeste" },
                        { label: "Sul", value: "Sul" },
                        { label: "Sudeste", value: "Sudeste" },
                        { label: "Centro-Oeste", value: "Centro-Oeste" },
                    ]}
                    onChange={(value) => onRegionChange(value)}
                    allowClear

                />
                <Select
                    placeholder="Status"
                    style={{ width: 130 }}
                    value={statusText}
                    options={[
                        { label: "Aberto", value: "aberto" },
                        { label: "Fechado", value: "fechado" },
                        { label: "Transbordo", value: "tranbordo" },
                    ]}
                    onChange={(value) => onStatusChange(value)}
                    allowClear

                />


                {categorySelect && (
                    <Select
                        placeholder="Categoria"
                        options={categorySelect.options}
                        value={categorySelect.value}
                        onChange={categorySelect.onChange}
                        style={{ width: 170 }}
                        allowClear

                    />
                )}

                {clientTypeSelect && (
                    <Select
                        placeholder="PF / PJ"
                        options={clientTypeSelect.options}
                        value={clientTypeSelect.value}
                        onChange={clientTypeSelect.onChange}
                        style={{ minWidth: 160 }}

                        allowClear

                    />
                )}
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
                        onDateFromChange(
                            dates?.[0]
                                ? dates[0].startOf("day").format("YYYY-MM-DD")
                                : null
                        );

                        onDateToChange(
                            dates?.[1]
                                ? dates[1].endOf("day").format("YYYY-MM-DD")
                                : null
                        );
                    }}
                />
                {leftExtra}
            </Space>


        </div>
    );
}