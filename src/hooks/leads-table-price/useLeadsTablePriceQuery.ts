import { useQuery } from "@tanstack/react-query";
import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";

export function useLeadTablePricesQuery({
  partnerId,
  companyId,
  enabled = true,
}: {
  partnerId?: number;
  companyId?: number;
  enabled?: boolean;
}) {
  const entity = dictionaryQueryClient["leads-table-price"];

  return useQuery({
    queryKey: [entity.key, partnerId ?? null, companyId ?? null],
    queryFn: () =>
      entity.service.getAll({
        ...(partnerId != null ? { partner_id: partnerId } : {}),
        ...(companyId != null ? { company_id: companyId } : {}),
      }),
    enabled: enabled && (partnerId != null || companyId != null),
    retry: 2,
  });
}
