import { useMutation, useQueryClient } from "@tanstack/react-query";

import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { LeadsService, type LeadModule } from "@/services/leads.service";
import type { ILead, ILeadsResponse } from "@/types/ILead.type";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";

type UpdateLeadMutationVariables = {
  id: number;
  payload: Record<string, unknown>;
  model?: LeadModule;
};

export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();
  const { resolvedModule, resolvedOperator } = useResolvedOrderScope();

  return useMutation({
    mutationFn: async ({ id, payload, model }: UpdateLeadMutationVariables) => {
      if (!resolvedModule || !resolvedOperator) {
        throw new Error("Não foi possível resolver module/operator");
      }

      return LeadsService.update(
        model ?? resolvedModule,
        resolvedOperator,
        id,
        payload,
      );
    },

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["leads-mine"] });

      const previousMine = queryClient.getQueriesData<ILeadsResponse>({
        queryKey: ["leads-mine"],
      });

      queryClient.setQueriesData<ILeadsResponse>(
        { queryKey: ["leads-mine"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            leads: old.leads.map((lead: ILead) =>
              lead.id === id ? ({ ...lead, ...payload } as ILead) : lead,
            ),
          };
        },
      );

      return {
        previousMine,
        toastId: fb.updateLoading("Lead"),
      };
    },

    onError: (_err, _vars, context) => {
      context?.previousMine?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      if (context?.toastId) {
        fb.updateError("Lead", context.toastId);
      }
    },

    onSuccess: (_data, _vars, context) => {
      queryClient.invalidateQueries({ queryKey: ["leads-mine"] });

      if (context?.toastId) {
        fb.updateSuccess("Lead", context.toastId);
      }
    },
  });
}
