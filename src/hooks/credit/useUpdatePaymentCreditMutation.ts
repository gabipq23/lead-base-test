import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import type { UpdateCreditRequestPaymentPayload } from "@/services/credit.service";

export function useUpdateCreditRequestPaymentMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["credit-requests"];

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
    } & UpdateCreditRequestPaymentPayload) =>
      entity.service.updatePayment(id, payload),

    onMutate: () => ({
      toastId: fb.updateLoading(entity.name),
    }),

    onError: (_err, _variables, context) => {
      if (context?.toastId) {
        fb.updateError(entity.name, context.toastId);
      }
    },

    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [entity.key],
      });

      if (context?.toastId) {
        fb.updateSuccess(entity.name, context.toastId);
      }
    },
  });
}
