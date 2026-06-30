import { useQuery } from "@tanstack/react-query";

import { dictionaryQueryClient } from "@/constants/dictionaryQueryClient.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
interface UseStatementQueryProps {
  enabled?: boolean;
  page?: number;
  perPage?: number;
}

export function useStatementQuery({
  enabled = true,
  page = 1,
  perPage = 20,
}: UseStatementQueryProps = {}) {
  const entity = dictionaryQueryClient.statements;
  const { user } = useAuth();
  const { selectedPartnerId } = useAdminScope();

  const isAdminUser = user?.user?.role === "ADMIN";
  const partnerId =
    isAdminDomain && isAdminUser ? selectedPartnerId : user?.user?.partner_id;

  return useQuery({
    queryKey: [entity.key, partnerId, page, perPage],
    queryFn: () =>
      entity.service.getByPartnerId(partnerId as number, {
        page,
        per_page: perPage,
      }),
    enabled: enabled && partnerId != null,
    retry: 2,
  });
}
