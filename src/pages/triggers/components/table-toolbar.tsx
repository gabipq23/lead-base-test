import { Button, Input, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { entityPage } from "../config-page.const";

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
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      <Space wrap>
        <Input.Search
          placeholder="Buscar por tipo ou mensagem..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </Space>

      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        Novo {entityPage.name.toLowerCase()}
      </Button>
    </div>
  );
}