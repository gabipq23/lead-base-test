import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import type { ICreateLeadPrice } from "@/types/ILeadPrice.type";

export function useCreateLeadTablePriceMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["leads-table-price"];

  return useMutation({
    mutationFn: (payload: ICreateLeadPrice) => entity.service.create(payload),

    onMutate: () => ({
      toastId: fb.createLoading(entity.name),
    }),

    onError: (_err, _variables, context) => {
      if (context?.toastId) {
        fb.createError(entity.name, context.toastId);
      }
    },

    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [entity.key],
      });

      if (context?.toastId) {
        fb.createSuccess(entity.name, context.toastId);
      }
    },
  });
}
