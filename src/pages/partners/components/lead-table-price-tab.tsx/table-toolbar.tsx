import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
    searchText: string;
    onSearchChange: (v: string) => void;
    // selectedCount: number;
    // onBulkDelete: () => void;
    onCreate: () => void;
}

export function TableToolbar({
    // searchText,
    // onSearchChange,
    // selectedCount,
    // onBulkDelete,
    onCreate,
}: Props) {
    return (
        <div className="flex justify-end mb-4">
            {/* <Space>
                <Input.Search
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />

                {selectedCount > 0 && (
                    <Button danger icon={<DeleteOutlined />} onClick={onBulkDelete}>
                        Deletar {selectedCount}
                    </Button>
                )}
            </Space> */}

            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                Novo Preço
            </Button>
        </div>
    );
}