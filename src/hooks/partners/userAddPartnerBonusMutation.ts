import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import type {
  IPartner,
  IPartnerResponse,
  IAddPartnerBonusPayload,
} from "@/types/IPartner.type";

interface IAddPartnerBonusVariables {
  partnerId: number;
  entity: IAddPartnerBonusPayload;
}

export function useAddPartnerBonusMutation() {
  const queryClient = useQueryClient();
  const entity = dictionaryQueryClient["partners"];

  return useMutation({
    mutationFn: async ({
      partnerId,
      entity: payload,
    }: IAddPartnerBonusVariables) => {
      const { partner } = await entity.service.addBonus(partnerId, payload);
      return partner;
    },
    onMutate: async ({
      partnerId,
      // entity: payload,
    }: IAddPartnerBonusVariables) => {
      await queryClient.cancelQueries({ queryKey: [entity.key] });

      const previousPartners = queryClient.getQueryData<IPartnerResponse>([
        entity.key,
      ]);

      queryClient.setQueryData<IPartnerResponse>([entity.key], (old) => {
        if (!old) return old;

        return {
          ...old,
          partners: old.partners.map((p: IPartner) => {
            if (p.partner_id === partnerId) {
              return {
                ...p,
                current_credit: p.current_credit ?? 0,
                bonus_credit: p.bonus_credit ?? 0,
              };
            }
            return p;
          }),
        };
      });

      return { previousPartners, toastId: fb.updateLoading(entity.name) };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData([entity.key], context?.previousPartners);
      if (context?.toastId) fb.updateError(entity.name, context?.toastId);
    },
    onSuccess: (_data, _variables, context) => {
      if (context?.toastId) fb.updateSuccess(entity.name, context?.toastId);
    },
  });
}
