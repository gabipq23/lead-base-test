import { useCreateLeadTablePriceMutation } from "@/hooks/leads-table-price/useCreateLeadsTablePriceMutation";
import { useDeleteLeadTablePriceMutation } from "@/hooks/leads-table-price/useDeleteLeadsTablePriceMutation";
import { useUpdateLeadTablePriceMutation } from "@/hooks/leads-table-price/useUpdateLeadsTablePriceMutation";
import { Table } from "antd";
import { useMemo, useState } from "react";
import { getColumns } from "./columns";
import { TableToolbar } from "./table-toolbar";
import { FormModal } from "./form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

interface Props {
    data: any[];
    isLoading: boolean;
    partner: any;
}

export function TableMain({ data, isLoading, partner }: Props) {

    const [searchText, setSearchText] = useState("");

    const [editingEntity, setEditingEntity] = useState<any | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [deleteItems, setDeleteItems] = useState<any>(0);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const createMutation = useCreateLeadTablePriceMutation();
    const updateMutation = useUpdateLeadTablePriceMutation();
    const deleteMutation = useDeleteLeadTablePriceMutation();

    const filteredData = useMemo(() => {
        if (!searchText) return data;
        return data.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase()),
        );
    }, [data, searchText]);

    // ---------------- CREATE ----------------
    function handleCreate() {
        setIsDeleteOpen(false); // 👈 fecha delete se estiver aberto
        setDeleteItems([]);

        setEditingEntity(null);
        setIsFormOpen(true);
    }

    // ---------------- EDIT ----------------
    function handleEdit(record: any) {
        setIsDeleteOpen(false); // 👈 evita overlap
        setDeleteItems([]);

        setEditingEntity(record);
        setIsFormOpen(true);
    }

    // ---------------- DELETE ----------------
    function handleDelete(record: any) {
        setIsFormOpen(false); // 👈 ESSENCIAL
        setEditingEntity(null);

        setDeleteItems([record]);
        setIsDeleteOpen(true);
    }

    function handleConfirmDelete() {
        deleteMutation.mutate(deleteItems);

        setIsDeleteOpen(false);
        setDeleteItems([]);
    }

    function handleCloseForm() {
        setIsFormOpen(false);
        setEditingEntity(null);
    }

    function handleCloseDelete() {
        setIsDeleteOpen(false);
        setDeleteItems([]);
    }

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <>
            <TableToolbar
                searchText={searchText}
                onSearchChange={setSearchText}
                onCreate={handleCreate}
            />
            <div className=" overflow-y-auto scrollbar-thin">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    onRow={(record) => ({
                        onClick: () => handleEdit(record),
                        style: { cursor: "pointer" },
                    })}
                />
            </div>
            <FormModal
                open={isFormOpen}
                partner={partner}
                editingEntity={editingEntity}
                onClose={handleCloseForm}
                onCreate={(values) => createMutation.mutate(values)}
                onUpdate={(values) => updateMutation.mutate(values)}
            />

            <DeleteConfirmModal
                open={isDeleteOpen}
                items={deleteItems}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}