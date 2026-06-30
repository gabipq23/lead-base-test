import { Modal } from "antd";

interface Props {
    open: boolean;
    items: any[];
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmModal({
    open,
    items,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={onConfirm}
            title="Confirmar exclusão"
        >
            <p>Deseja deletar {items.length} registro(s)?</p>
        </Modal>
    );
}