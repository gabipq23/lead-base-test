import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Checkbox, Dropdown, Table } from "antd";
import type { Key } from "react";
import type { TableColumnsType } from "antd";

import { useStyle } from "@/style/tableStyle";
import type { ILead } from "@/types/ILead.type";

import { TableToolbar } from "./table-toolbar";
import { LeadViewModal } from "./view-modal";
import { useUpdateLeadMutation } from "@/hooks/leads/useUpdateLeadsMutation";
import { useAuth } from "@/context/auth-provider";
import { getColumnsReservedLeads } from "./columns-reserved-leads";

function getColKey(col: TableColumnsType<ILead>[number]): string {
    if ("key" in col && col.key) return String(col.key);
    if ("dataIndex" in col) {
        const dataIndex = (col as { dataIndex?: unknown }).dataIndex;
        if (Array.isArray(dataIndex)) return dataIndex.join(".");
        return String(dataIndex ?? "");
    }
    return "";
}

function getColLabel(col: TableColumnsType<ILead>[number]): string {
    const key = getColKey(col);
    const title = col.title;

    if (typeof title === "string") return title;
    if (typeof title === "number") return String(title);

    return key.toUpperCase();
}

const ALWAYS_VISIBLE_KEYS: string[] = [];

function getSelectableKeys(cols: TableColumnsType<ILead>): string[] {
    return cols
        .filter(
            (col) =>
                "dataIndex" in col &&
                !ALWAYS_VISIBLE_KEYS.includes(getColKey(col)),
        )
        .map(getColKey)
        .filter(Boolean);
}

interface LeadsTableProps {
    data: ILead[];
    isLoading: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    searchText: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    region?: string;
    uf?: string;
    city?: string;
    provider?: string;
    dateFrom?: string;
    dateTo?: string;

    onRegionChange: (value?: string) => void;
    onUfChange: (value?: string) => void;
    onCityChange: (value?: string) => void;
    onProviderChange: (value?: string) => void;
    onDateFromChange: (value?: string) => void;
    onDateToChange: (value?: string) => void;
}

export function TableReservedLeads({
    data,
    isLoading,
    currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    searchText,
    onSearchChange,
    onRefresh,
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
}: LeadsTableProps) {
    const { styles } = useStyle();

    const currentUser = useAuth().user!;
    const topScrollRef = useRef<HTMLDivElement>(null);

    const updateMutation = useUpdateLeadMutation();

    const [now, setNow] = useState(Date.now());
    const tableWrapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const columns = useMemo(
        () =>
            getColumnsReservedLeads({

                now,
            }),
        [now],
    );
    const [viewingLead, setViewingLead] = useState<ILead | null>(null);

    const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
        getSelectableKeys(columns),
    );

    const colSignature = useMemo(
        () => getSelectableKeys(columns).join(","),
        [columns],
    );

    useEffect(() => {
        setVisibleColumns(getSelectableKeys(columns));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colSignature]);

    const visibleTableColumns: TableColumnsType<ILead> = [
        ...columns.filter(
            (column) =>
                !("dataIndex" in column) || ALWAYS_VISIBLE_KEYS.includes(getColKey(column)),
        ),
        ...columns.filter(
            (column) =>
                "dataIndex" in column &&
                !ALWAYS_VISIBLE_KEYS.includes(getColKey(column)) &&
                visibleColumns.includes(getColKey(column)),
        ),
    ];

    const allColumnOptions = columns
        .filter(
            (col) =>
                "dataIndex" in col &&
                !ALWAYS_VISIBLE_KEYS.includes(getColKey(col)),
        )
        .map((col) => ({
            label: getColLabel(col),
            value: getColKey(col),
        }))
        .filter((opt) => opt.value);

    const columnSelectorDropdown = (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                dropdownRender={() => (
                    <div
                        style={{
                            width: 240,
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            padding: 12,
                            maxHeight: 320,
                            overflowY: "auto",
                        }}
                    >
                        <Checkbox.Group
                            options={allColumnOptions}
                            value={visibleColumns}
                            onChange={(vals) => setVisibleColumns(vals as Key[] as string[])}
                            style={{ display: "flex", flexDirection: "column", gap: 8 }}
                        />
                    </div>
                )}
            >
                <Button>Selecionar Colunas</Button>
            </Dropdown>
        </div>
    );

    const filteredData = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();

        if (!normalizedSearch) return data;

        return data.filter((lead) => {
            const haystack = [
                lead.full_name,
                lead.email,
                lead.cpf,
                lead.phone,
                lead.city,
                lead.uf,
                lead.campaign,
                lead.purchase_intent,
                lead.purchase_intent_plan_price?.toString() ?? "",
                lead.crm_status,
                lead.status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(normalizedSearch);
        });
    }, [data, searchText]);

    useEffect(() => {
        const top = topScrollRef.current;
        const tableBody = tableWrapRef.current?.querySelector<HTMLElement>(".ant-table-body");

        if (!top || !tableBody) return;

        const inner = top.querySelector<HTMLElement>(".top-scroll-inner");
        if (inner) inner.style.width = `${tableBody.scrollWidth}px`;

        const syncFromTop = () => {
            tableBody.scrollLeft = top.scrollLeft;
        };

        const syncFromTable = () => {
            top.scrollLeft = tableBody.scrollLeft;
        };

        top.addEventListener("scroll", syncFromTop);
        tableBody.addEventListener("scroll", syncFromTable);

        return () => {
            top.removeEventListener("scroll", syncFromTop);
            tableBody.removeEventListener("scroll", syncFromTable);
        };
    }, [filteredData, isLoading, columns]);

    return (
        <>
            <TableToolbar
                searchText={searchText}
                onSearchChange={onSearchChange}
                onRefresh={onRefresh}
                leftExtra={columnSelectorDropdown}
                showActions={false}
                region={region}
                uf={uf}
                city={city}
                provider={provider}
                dateFrom={dateFrom}
                dateTo={dateTo}

                onRegionChange={onRegionChange}
                onUfChange={onUfChange}
                onCityChange={onCityChange}
                onProviderChange={onProviderChange}
                onDateFromChange={onDateFromChange}
                onDateToChange={onDateToChange}
            />

            <div
                ref={topScrollRef}
                className="scrollbar-thin"
                style={{ overflowX: "auto", overflowY: "hidden", marginBottom: 2 }}
            >
                <div className="top-scroll-inner" style={{ height: 1 }} />
            </div>

            <div ref={tableWrapRef} className="flex overflow-y-auto scrollbar-thin">
                <Table<ILead>
                    rowKey="id"
                    columns={visibleTableColumns}
                    dataSource={filteredData}
                    className={styles.customTable}
                    loading={isLoading}
                    // rowSelection={rowSelection}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total,
                        locale: { items_per_page: "" },
                        pageSizeOptions: [20, 50, 100, 200, 500],
                        showSizeChanger: true,
                        showTotal: (value) => `Total de ${value} leads`,
                        onChange: (page) => onPageChange(page),
                        onShowSizeChange: (_: number, size: number) => {
                            onPageSizeChange(size);
                            onPageChange(1);
                        },
                    }}
                    scroll={{ x: "max-content", y: 800 }}
                    onRow={(record) => ({
                        onClick: () => {
                            setViewingLead(record);
                        },
                        style: {
                            cursor: "pointer",
                        },
                    })}
                />
            </div>
            <LeadViewModal
                updateMutation={updateMutation}
                currentUser={currentUser}
                lead={viewingLead}
                open={viewingLead !== null}
                onClose={() => setViewingLead(null)}
            />


        </>
    );
}