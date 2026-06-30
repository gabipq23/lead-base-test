import { useQuery } from "@tanstack/react-query";

import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";

interface UseCreditRequestsQueryProps {
  partnerId?: number;
  companyId?: number;
  page?: number;
  perPage?: number;
  enabled?: boolean;
}

export function useCreditRequestsQuery({
  partnerId,
  companyId,
  page = 1,
  perPage = 20,
  enabled = true,
}: UseCreditRequestsQueryProps = {}) {
  const entity = dictionaryQueryClient["credit-requests"];
  const { user } = useAuth();
  const { selectedCompanyId, selectedPartnerId } = useAdminScope();

  const isAdminUser = user?.user?.role === "ADMIN";
  const useAdminFilters = isAdminDomain && isAdminUser;

  const resolvedCompanyId = useAdminFilters ? selectedCompanyId : companyId;
  const resolvedPartnerId = useAdminFilters ? selectedPartnerId : partnerId;

  return useQuery({
    queryKey: [
      entity.key,
      resolvedPartnerId ?? null,
      resolvedCompanyId ?? null,
      page,
      perPage,
    ],
    queryFn: () =>
      entity.service.getAll({
        partner_id: resolvedPartnerId,
        company_id: resolvedCompanyId,
        page,
        per_page: perPage,
      }),
    enabled,
    retry: 2,
  });
}
