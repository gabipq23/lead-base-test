import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useQuery } from "@tanstack/react-query";
import type { ITriggersFilters } from "@/types/ITriggers.type";

export function useTriggersQuery() {
  const entity = dictionaryQueryClient["triggers"];
  const { user } = useAuth();
  const { selectedCompanyId, selectedPartnerId } = useAdminScope();

  const companyId = user?.user.company_id;
  const partnerId = user?.user.partner_id;

  const filters: ITriggersFilters = isAdminDomain
    ? {
        ...(selectedCompanyId != null ? { company_id: selectedCompanyId } : {}),
        ...(selectedPartnerId != null ? { partner_id: selectedPartnerId } : {}),
      }
    : {
        ...(companyId != null ? { company_id: companyId } : {}),
        ...(partnerId != null ? { partner_id: partnerId } : {}),
      };

  return useQuery({
    queryKey: [
      entity.key,
      filters.company_id ?? null,
      filters.partner_id ?? null,
    ],
    queryFn: () => entity.service.getAll(filters),
    retry: 2,
  });
}
