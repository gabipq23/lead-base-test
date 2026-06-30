import { Button, Input, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface TableToolbarProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    onCreate: () => void;
}

export function TableToolbar({
    searchText,
    onSearchChange,
    onCreate,
}: TableToolbarProps) {
    return (
        <>
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                Contas Conectadas
            </Typography.Title>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <Space>
                    <Input.Search
                        placeholder="Buscar conta..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        allowClear
                        style={{ width: 320 }}
                    />
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onCreate}
                >
                    Conectar conta
                </Button>
            </div>
        </>
    );
}