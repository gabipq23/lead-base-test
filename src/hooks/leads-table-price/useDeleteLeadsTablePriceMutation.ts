import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import type { ILeadPrice, ILeadPriceResponse } from "@/types/ILeadPrice.type";

export function useDeleteLeadTablePriceMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["leads-table-price"];

  return useMutation({
    mutationFn: (id: number) => entity.service.delete(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: [entity.key],
      });

      const previousData = queryClient.getQueryData<ILeadPriceResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<ILeadPriceResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          prices: old.prices.filter((item: ILeadPrice) => item.id !== id),
        };
      });

      return {
        previousData,
        toastId: fb.deleteLoading(entity, 1),
      };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData([entity.key], context?.previousData);

      if (context?.toastId) {
        fb.deleteError(entity, context.toastId);
      }
    },

    onSuccess: (_data, _id, context) => {
      if (context?.toastId) {
        fb.deleteSuccess(entity, 1, context.toastId);
      }
    },
  });
}
