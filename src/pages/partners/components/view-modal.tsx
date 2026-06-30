import { Modal, Button, Tabs } from "antd";
import { type EntityType } from "../config-page.const";

import { useState } from "react";
import { DetailsTab } from "./details-tab";
import { TablePriceTab } from "./lead-table-price-tab.tsx/table-price-tab";

interface ViewModalProps {
    open: boolean;
    viewingEntity: EntityType | null;
    onClose: () => void;
    onEdit?: (entity: EntityType) => void;
    onDelete?: (entity: EntityType) => void;
}

export function ViewModal({ open, viewingEntity, onClose, onEdit, onDelete }: ViewModalProps) {
    const [activeTab, setActiveTab] = useState("details");
    const renderFooter = () => {
        switch (activeTab) {
            case "details":
                return (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button type="primary" onClick={() => viewingEntity && onEdit?.(viewingEntity)}>
                            Editar
                        </Button>
                        <Button danger onClick={() => viewingEntity && onDelete?.(viewingEntity)}>
                            Deletar
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };
    return (
        <Modal
            open={open}
            // title={`Visualizar ${entityPage.name}`}
            footer={renderFooter()}
            onCancel={onClose}
            destroyOnHidden
            width={910}
        >


            <Tabs
                defaultActiveKey="details"
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "details",
                        label: (
                            <span className="flex items-center gap-1">
                                Dados do Parceiro  </span>
                        ),
                        children: (
                            <DetailsTab viewingEntity={viewingEntity} />
                        ),
                    },

                    {
                        key: "table-price",
                        label: "Tabela de Preço de Leads",
                        children: (
                            <TablePriceTab partner={viewingEntity} />
                        ),
                    },


                ]}
            />
        </Modal>
    );
}