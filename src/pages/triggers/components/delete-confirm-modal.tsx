import { Modal, Typography } from "antd";
import { useDeleteTriggerMutation } from "@/hooks/triggers/useDeleteTriggerMutation";
import { entityPage, triggerTypeLabelMap } from "../config-page.const";
import type { ITriggers } from "@/types/ITriggers.type";

interface DeleteConfirmModalProps {
    open: boolean;
    entityToDelete: ITriggers | null;
    onClose: () => void;
}

export function DeleteConfirmModal({
    open,
    entityToDelete,
    onClose,
}: DeleteConfirmModalProps) {
    const deleteMutation = useDeleteTriggerMutation();

    function handleConfirm() {
        if (!entityToDelete) return;
        deleteMutation.mutate({ id: entityToDelete.id }, { onSuccess: onClose });
    }

    return (
        <Modal
            open={open}
            title="Confirmar exclusão"
            okText="Deletar"
            okButtonProps={{ danger: true }}
            cancelText="Cancelar"
            onOk={handleConfirm}
            onCancel={onClose}
            confirmLoading={deleteMutation.isPending}
        >
            <Typography.Text>
                Tem certeza que deseja deletar o(a) {entityPage.name.toLowerCase()}{" "}
                <Typography.Text strong>
                    {entityToDelete ? triggerTypeLabelMap[entityToDelete.type] : ""}
                </Typography.Text>
                ? Esta ação não pode ser desfeita.
            </Typography.Text>
        </Modal>
    );
}