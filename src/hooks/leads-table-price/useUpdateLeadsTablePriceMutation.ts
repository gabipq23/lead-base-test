import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import type {
  ILeadPrice,
  ILeadPriceResponse,
  IUpdateLeadPrice,
} from "@/types/ILeadPrice.type";

export function useUpdateLeadTablePriceMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["leads-table-price"];

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUpdateLeadPrice }) =>
      entity.service.update(id, payload),

    onMutate: async ({ id, payload }) => {
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
          prices: old.prices.map((item: ILeadPrice) =>
            item.id === id ? { ...item, ...payload } : item,
          ),
        };
      });

      return {
        previousData,
        toastId: fb.updateLoading(entity.name),
      };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData([entity.key], context?.previousData);

      if (context?.toastId) {
        fb.updateError(entity.name, context.toastId);
      }
    },

    onSuccess: (_data, _variables, context) => {
      if (context?.toastId) {
        fb.updateSuccess(entity.name, context.toastId);
      }
    },
  });
}
