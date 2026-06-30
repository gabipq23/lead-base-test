import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type {
  ITriggers,
  ITriggersListResponse,
  IUpdateTriggers,
} from "@/types/ITriggers.type";

export function useUpdateTriggerMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["triggers"];

  return useMutation({
    mutationFn: (payload: IUpdateTriggers) => entity.service.update(payload),
    onMutate: async (newEntity: IUpdateTriggers) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousConfigs = queryClient.getQueryData<ITriggersListResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<ITriggersListResponse>([entity.key], (old) => {
        if (!old) return old;
        return {
          ...old,
          configs: old.configs.map((config: ITriggers) =>
            config.id === newEntity.id ? { ...config, ...newEntity } : config,
          ),
        };
      });

      return { previousConfigs, toastId: fb.updateLoading(entity.name) };
    },
    onError: (_err, _payload, context) => {
      queryClient.setQueryData([entity.key], context?.previousConfigs);
      if (context?.toastId) fb.updateError(entity.name, context.toastId);
    },
    onSuccess: (_data, _payload, context) => {
      if (context?.toastId) fb.updateSuccess(entity.name, context.toastId);
    },
  });
}
