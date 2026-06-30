import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAuth } from "@/context/auth-provider";
import type { ICreateTriggers } from "@/types/ITriggers.type";

export function useCreateTriggerMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["triggers"];
  const { isGlobalAdmin } = useAuth();

  return useMutation({
    mutationFn: (payload: ICreateTriggers) => {
      if (isGlobalAdmin) {
        return entity.service.create(payload);
      }

      // GESTOR: nunca envia company_id/partner_id, vem do token no back
      const { ...payloadWithoutScope } = payload;

      return entity.service.create(payloadWithoutScope);
    },
    onMutate: () => ({
      toastId: fb.createLoading(entity.name),
    }),
    onError: (_err, _payload, context) => {
      if (context?.toastId) fb.createError(entity.name, context.toastId);
    },
    onSuccess: (_data, _payload, context) => {
      queryClient.invalidateQueries({ queryKey: [entity.key] });
      if (context?.toastId) fb.createSuccess(entity.name, context.toastId);
    },
  });
}
