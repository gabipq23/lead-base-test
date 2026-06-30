

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { Edit } from "lucide-react";

export function getColumns({
    onEdit,
    onDelete,
}: any) {
    return [
        {
            title: "ID",
            dataIndex: "id",
            width: 80,
        },
        {
            title: "Serviço",
            dataIndex: "service_name",
        },
        {
            title: "Preço",
            dataIndex: "price",
            render: (v: number) => `R$ ${v}`,
        },
        {
            title: "",
            width: 120,
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(record);
                        }}
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        danger
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation(); // 👈 ISSO AQUI resolve
                            onDelete(record);
                        }}
                    >
                        <DeleteOutlined size={16} />
                    </Button>
                </Space>
            ),
        },
    ];
}