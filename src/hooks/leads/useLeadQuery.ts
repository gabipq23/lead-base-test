import { useQuery } from "@tanstack/react-query";

import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import {
  LeadsService,
  type LeadModule,
  type LeadQueryParams,
} from "@/services/leads.service";
import type { ILeadsResponse } from "@/types/ILead.type";

export function useLeadQuery({
  model,
  enabled = true,
  page = 1,
  per_page = 100,
  region,
  uf,
  city,
  provider,
  date_from,
  date_to,
}: {
  model?: LeadModule;
  enabled?: boolean;
  page?: number;
  per_page?: number;
  region?: string;
  uf?: string;
  city?: string;
  provider?: string;
  date_from?: string;
  date_to?: string;
} = {}) {
  const { resolvedModule } = useResolvedOrderScope(model);
  const queryParams: LeadQueryParams = {
    page,
    per_page,
    region,
    uf,
    city,
    provider,
    date_from,
    date_to,
  };

  return useQuery<ILeadsResponse>({
    queryKey: [
      "leads",
      resolvedModule,
      page,
      per_page,
      region,
      uf,
      city,
      provider,
      date_from,
      date_to,
    ],
    queryFn: async () => {
      const data = await LeadsService.getAll(
        resolvedModule,
        undefined,
        queryParams,
      );

      return data;
    },
    retry: 2,
    enabled,
  });
}
