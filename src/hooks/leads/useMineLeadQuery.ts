import { useQuery } from "@tanstack/react-query";

import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import {
  LeadsService,
  type LeadModule,
  type LeadQueryParams,
} from "@/services/leads.service";
import type { ILeadsResponse } from "@/types/ILead.type";

function resolveOperatorSlug(companyName?: string | null) {
  return companyName?.split(" ")[0]?.toLowerCase().trim();
}

export function useMineLeadQuery({
  model = "telecom",
  operatorSlug,
  enabled = true,
  page = 1,
  per_page = 100,
}: {
  model?: LeadModule;
  operatorSlug?: string;
  enabled?: boolean;
  page?: number;
  per_page?: number;
} = {}) {
  const { user } = useAuth();
  const { selectedCompanyId, selectedPartnerId } = useAdminScope();

  const companyId = isAdminDomain
    ? selectedCompanyId
    : (user?.user.company_id ?? undefined);
  const partnerId = isAdminDomain
    ? selectedPartnerId
    : (user?.user.partner_id ?? undefined);

  const { data: companiesData } = useCompanyQuery({
    enabled: companyId != null || isAdminDomain,
  });

  const resolvedCompany = companiesData?.companies.find(
    (company) => company.company_id === companyId,
  );

  const slug =
    operatorSlug?.trim().toLowerCase() ||
    resolveOperatorSlug(resolvedCompany?.company_name);

  const queryParams: LeadQueryParams = {
    page,
    per_page,
    ...(companyId != null ? { company_id: companyId } : {}),
    ...(partnerId != null ? { partner_id: partnerId } : {}),
  };

  return useQuery<ILeadsResponse>({
    queryKey: [
      "leads-mine",
      model,
      slug ?? null,
      queryParams.company_id ?? null,
      queryParams.partner_id ?? null,
      page,
      per_page,
    ],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Não foi possível resolver a operadora do lead");
      }

      return LeadsService.getMine(model, slug, queryParams);
    },
    retry: 2,
    enabled: enabled && !!slug && (companyId != null || partnerId != null),
  });
}
