import { useMemo, useState } from "react";
import { Table } from "antd";
import { getColumns } from "./columns";
import { TableToolbar } from "./table-toolbar";
import { FormModal } from "./form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

import { useStyle } from "@/style/tableStyle";
import type { ITriggers } from "@/types/ITriggers.type";

interface TriggersTableProps {
    data: ITriggers[];
    isLoading: boolean;
}

export function TableMain({ data, isLoading }: TriggersTableProps) {
    const [searchText, setSearchText] = useState("");
    const [editingEntity, setEditingEntity] = useState<ITriggers | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<ITriggers | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { styles } = useStyle();

    const filteredData = useMemo(() => {
        if (!searchText) return data;
        const lower = searchText.toLowerCase();
        return data.filter((t) =>
            t.type.toLowerCase().includes(lower) ||
            t.message.toLowerCase().includes(lower)
        );
    }, [data, searchText]);

    function handleEdit(record: ITriggers) {
        setEditingEntity(record);
        setIsFormModalOpen(true);
    }

    function handleDelete(record: ITriggers) {
        setEntityToDelete(record);
        setIsDeleteModalOpen(true);
    }

    function handleCreate() {
        setEditingEntity(null);
        setIsFormModalOpen(true);
    }

    function handleFormClose() {
        setIsFormModalOpen(false);
        setEditingEntity(null);
    }

    function handleDeleteClose() {
        setIsDeleteModalOpen(false);
        setEntityToDelete(null);
    }

    const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

    return (
        <>
            <TableToolbar
                searchText={searchText}
                onSearchChange={setSearchText}
                onCreate={handleCreate}
            />
            <div className="flex overflow-y-auto scrollbar-thin">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredData}
                    className={styles.customTable}
                    loading={isLoading}
                    pagination={false}
                    scroll={{ y: 800 }}
                />
            </div>

            <FormModal
                open={isFormModalOpen}
                editingEntity={editingEntity}
                onClose={handleFormClose}
            />

            <DeleteConfirmModal
                open={isDeleteModalOpen}
                entityToDelete={entityToDelete}
                onClose={handleDeleteClose}
            />
        </>
    );
}