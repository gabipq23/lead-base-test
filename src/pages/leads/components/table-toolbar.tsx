import { Button, Input, Space, Typography } from "antd";
import { ReloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface TableToolbarProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    selectedCount?: number;
    onBuyLeads?: () => void;
    buyDisabled?: boolean;
    leftExtra?: ReactNode;
    lastUpdatedAt?: Date | null;
    showActions?: boolean;
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
    searchText,
    onSearchChange,
    onRefresh,
    leftExtra,
    selectedCount = 0,
    onBuyLeads,
    buyDisabled,
    lastUpdatedAt,
    showActions
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

                <Input.Search

                    allowClear
                    placeholder="Pesquisar cidade ou UF"
                    value={searchText}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    style={{ width: 340 }}
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