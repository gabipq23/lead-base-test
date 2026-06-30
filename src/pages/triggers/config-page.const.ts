import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useCreateTriggerMutation } from "@/hooks/triggers/useCreateTriggerMutation";
import { useDeleteTriggerMutation } from "@/hooks/triggers/useDeleteTriggerMutation";
import { useUpdateTriggerMutation } from "@/hooks/triggers/useUpdateTriggerMutation";
import { useTriggersQuery } from "@/hooks/triggers/useTriggersQuery";
import type { ITriggers, TriggersType } from "@/types/ITriggers.type";

export const entityPage = dictionaryQueryClient.triggers;
export const useCreateEntity = useCreateTriggerMutation;
export const useUpdateEntity = useUpdateTriggerMutation;
export const useDeleteEntity = useDeleteTriggerMutation;
export const useListEntity = useTriggersQuery;
export type EntityType = ITriggers;

export type FormValues = {
  type: TriggersType;
  enabled: boolean;
  delay_minutes: number;
  message: string;
  company_id?: number | null;
  partner_id?: number | null;
};

export const triggerTypeOptions: { label: string; value: TriggersType }[] = [
  { label: "Clique em Mensagem", value: "BUTTON_CLICKED_MESSAGE" },
  { label: "Clique em Ligar", value: "BUTTON_CLICKED_CALL" },
  { label: "Pedido Finalizado", value: "ORDER_COMPLETED" },
  { label: "Pedido Criado", value: "ORDER_CREATED" },
  { label: "Suporte Solicitado", value: "SUPPORT_REQUESTED" },
  { label: "Fale Conosco", value: "CONTACT_US_REQUESTED" },
  { label: "Acompanhamento de Pedido", value: "OPEN_ORDER_FOLLOW_UP" },
];

export const triggerTypeLabelMap: Record<TriggersType, string> =
  Object.fromEntries(
    triggerTypeOptions.map((option) => [option.value, option.label]),
  ) as Record<TriggersType, string>;
