import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";

export function useCreateCreditRequestMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["credit-requests"];

  return useMutation({
    mutationFn: (payload: any) => entity.service.create(payload),

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
