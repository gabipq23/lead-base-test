import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type { ITriggers, ITriggersListResponse } from "@/types/ITriggers.type";

export function useDeleteTriggerMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["triggers"];

  return useMutation({
    mutationFn: ({ id }: { id: number }) => entity.service.deleteById(id),
    onMutate: async ({ id }: { id: number }) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousConfigs = queryClient.getQueryData<ITriggersListResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<ITriggersListResponse>([entity.key], (old) => {
        if (!old) return old;
        return {
          ...old,
          configs: old.configs.filter((config: ITriggers) => config.id !== id),
        };
      });

      return { previousConfigs, toastId: fb.deleteLoading(entity, 1) };
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData([entity.key], context?.previousConfigs);
      if (context?.toastId) fb.deleteError(entity, context.toastId);
    },
    onSuccess: (_, _payload, context) => {
      if (context?.toastId) fb.deleteSuccess(entity, 1, context.toastId);
    },
  });
}
