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
}: {
  model?: LeadModule;
  enabled?: boolean;
  page?: number;
  per_page?: number;
} = {}) {
  const { resolvedModule } = useResolvedOrderScope(model);
  const queryParams: LeadQueryParams = { page, per_page };

  return useQuery<ILeadsResponse>({
    queryKey: ["leads", resolvedModule, page, per_page],
    queryFn: async () => {
      const data = await LeadsService.getAll(
        resolvedModule,
        undefined,
        queryParams,
      );
      console.log("[useLeadQuery] response", data);
      return data;
    },
    retry: 2,
    enabled,
  });
}
