import { Button, Form, Modal, Tabs, Tag } from "antd";

import type { IAuthPayload } from "@/types/IAuthPayload.type";
import type { ILead } from "@/types/ILead.type";
import { getStatusColor } from "./columns";
import { LeadDetailsTab } from "./details-tab";
import { useEffect, useState } from "react";
import { OrderControlTab } from "./control-tab";
import { OrderNotesTab } from "./notes-tb";

type LeadNote = {
    obs: string;
    user: string;
    role: string;
};

type LeadUpdateMutation = {
    mutate: (
        variables: {
            id: number;
            payload: Record<string, unknown>;
        },
        options?: {
            onSuccess?: () => void;
        },
    ) => void;
};

interface LeadViewModalProps {
    lead: ILead | null;
    open: boolean;
    onClose: () => void;
    updateMutation?: LeadUpdateMutation;
    currentUser?: IAuthPayload;
}

export function LeadViewModal({ lead, open, onClose, updateMutation, currentUser }: LeadViewModalProps) {
    const [activeTab, setActiveTab] = useState("details")
    const [viewingLead, setViewingLead] = useState<ILead | null>(lead);
    const [controlForm] = Form.useForm();
    const safeUpdateMutation = updateMutation ?? {
        mutate: () => undefined,
    };

    useEffect(() => {
        setViewingLead(lead);
    }, [lead]);

    if (!lead) return null;

    const handleSaveObservacao = (values: {
        consultant_observation: string;
    }) => {
        const obs = values.consultant_observation?.trim();

        if (!obs || !updateMutation || !currentUser) return;

        const notePayload: LeadNote = {
            obs,
            user: currentUser.user.name,
            role: currentUser.user.role,
        };

        const noteRecord = {
            ...notePayload,
            id: `${Date.now()}`,
            created_at: new Date().toISOString(),
        };

        updateMutation.mutate({
            id: lead.id,
            payload: {
                consultant_notes: [
                    ...(viewingLead?.consultant_notes ?? []),
                    notePayload,
                ],
            },
        }, {
            onSuccess: () => {
                setViewingLead((currentLead) => {
                    if (!currentLead) return currentLead;

                    return {
                        ...currentLead,
                        consultant_notes: [
                            ...(currentLead.consultant_notes ?? []),
                            noteRecord,
                        ],
                    };
                });
            },
        });
    };

    const renderFooter = () => {
        switch (activeTab) {
            case "control":
                return (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button type="primary" onClick={() => controlForm.submit()}>
                            Salvar
                        </Button>
                    </div>
                );
            // case "notes":
            //     return (
            //         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            //             <Button type="primary" onClick={handleSaveObservacao}>
            //                 Salvar
            //             </Button>
            //         </div>
            //     );
            default:
                return null;
        }
    };
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={renderFooter()}
            width={900}
            destroyOnHidden
            title={
                <div className="flex items-center justify-between gap-2">
                    <span>Lead: {viewingLead?.full_name || `Lead #${viewingLead?.id}`}</span>
                    <span className="mr-5"> <Tag color={getStatusColor(viewingLead?.status ?? "")}>{viewingLead?.status}</Tag></span>

                </div>
            }
        >
            <Tabs
                defaultActiveKey="details"
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "details",
                        label:

                            "Dados do Lead"

                        ,
                        children: (
                            <LeadDetailsTab lead={viewingLead ?? lead} />
                        ),
                    },
                    {
                        key: "control",
                        label: "Controle",
                        children: (
                            <OrderControlTab
                                viewingEntity={viewingLead ?? lead}
                                updateMutation={safeUpdateMutation}
                                form={controlForm}
                            />
                        ),
                    },

                    {
                        key: "notes",
                        label: "Observações",
                        children: (
                            <OrderNotesTab
                                handleSaveObservacao={handleSaveObservacao}
                                viewingEntity={viewingLead ?? lead}
                            />
                        ),
                    },

                ]}
            />

        </Modal>
    );
}
