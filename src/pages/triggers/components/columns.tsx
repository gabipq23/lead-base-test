import { Button, Space, Tag, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { type EntityType, triggerTypeLabelMap } from "../config-page.const";
import type { TriggersType } from "@/types/ITriggers.type";

interface GetColumnsProps {
    onEdit: (record: EntityType) => void;
    onDelete: (record: EntityType) => void;
}

export function getColumns({ onEdit, onDelete }: GetColumnsProps): TableColumnsType<EntityType> {
    return [
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            width: 200,
            filters: Object.entries(triggerTypeLabelMap).map(([value, text]) => ({ text, value })),
            onFilter: (value, record) => record.type === value,
            render: (type: TriggersType) => (
                <Tag color="blue">{triggerTypeLabelMap[type] ?? type}</Tag>
            ),
        },
        {
            title: "Mensagem",
            dataIndex: "message",
            key: "message",
            ellipsis: { showTitle: false },
            render: (message: string) => (
                <Tooltip placement="topLeft" title={message} overlayInnerStyle={{ fontSize: 12 }}>
                    {message || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Delay (min)",
            dataIndex: "delay_minutes",
            key: "delay_minutes",
            width: 120,
            sorter: (a, b) => a.delay_minutes - b.delay_minutes,
            render: (delay: number) => `${delay} min`,
        },
        {
            title: "Status",
            dataIndex: "enabled",
            key: "enabled",
            width: 100,
            filters: [
                { text: "Ativo", value: true },
                { text: "Inativo", value: false },
            ],
            onFilter: (value, record) => record.enabled === value,
            render: (enabled: boolean) => (
                <Tag color={enabled ? "green" : "red"}>
                    {enabled ? "Ativo" : "Inativo"}
                </Tag>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 100,
            render: (_: unknown, record: EntityType) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); onEdit(record); }}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => { e.stopPropagation(); onDelete(record); }}
                    />
                </Space>
            ),
        },
    ];
}