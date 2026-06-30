import { Modal, Tag } from "antd";
import type { ILead } from "@/types/ILead.type";


interface Props {
    open: boolean;
    leads: ILead[];
    credits: number;
    totalCost: number;
    confirmDisabled?: boolean;
    confirmLoading?: boolean;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
}

export function BuyLeadsModal({
    open,
    leads,
    credits,
    totalCost,
    confirmDisabled,
    confirmLoading,
    onCancel,
    onConfirm,
}: Props) {
    return (
        <Modal
            open={open}
            title="Reservar leads selecionados"
            centered
            okText="Confirmar reserva"
            cancelText="Cancelar"
            onCancel={onCancel}
            onOk={onConfirm}
            okButtonProps={{ disabled: confirmDisabled }}
            confirmLoading={confirmLoading}
            width={650}
        >
            <div
                style={{
                    background: "#fafafa",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 16
                }}
            >
                <div
                    style={{
                        marginBottom: 12,
                        fontSize: 16,
                    }}
                >
                    Foram escolhidos <strong>{leads.length}</strong>{" "}
                    {leads.length === 1 ? "lead" : "leads"}.
                </div>

                <div>
                    Valor da reserva:
                </div>

                <strong
                    style={{
                        fontSize: 22,
                        color: "#1677ff"
                    }}
                >
                    R$ {totalCost.toFixed(2)}
                </strong>

                <div
                    style={{
                        marginTop: 12
                    }}
                >
                    Créditos disponíveis:
                    <Tag
                        color={credits >= totalCost ? "green" : "red"}
                        style={{
                            marginLeft: 8
                        }}
                    >
                        R$ {credits}
                    </Tag>
                </div>

                {credits < totalCost && (
                    <div style={{ marginTop: 8, color: "#cf1322" }}>
                        Saldo insuficiente para reservar os leads selecionados.
                    </div>
                )}
            </div>
        </Modal>
    )
}