import { useMemo } from "react";

import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";
import { messageQueryFeedback as fb } from "@/helpers/MessageQueryFeedback.helper";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import { useLeadTablePricesQuery } from "@/hooks/leads-table-price/useLeadsTablePriceQuery";
import { useStatementQuery } from "@/hooks/statement/useStatementQuery";
import { LeadsService, type LeadModule } from "@/services/leads.service";
import type { ILead } from "@/types/ILead.type";
import type { ILeadPrice } from "@/types/ILeadPrice.type";

const FALLBACK_PRICE = 10;

function resolveLeadPrice(
  _lead: ILead,
  prices: ILeadPrice[],
  partnerId?: number,
  companyId?: number,
) {
  const serviceName = "lead";

  const partnerSpecific = prices.find(
    (price) =>
      partnerId != null &&
      price.partner_id === partnerId &&
      price.service_name === serviceName,
  );

  if (partnerSpecific) {
    return partnerSpecific.price;
  }

  const companySpecific = prices.find(
    (price) =>
      companyId != null &&
      price.company_id === companyId &&
      price.service_name === serviceName,
  );

  if (companySpecific) {
    return companySpecific.price;
  }

  return FALLBACK_PRICE;
}

export function useReserveLeadsMutation({
  module = "telecom",
  selectedLeads = [],
}: {
  module?: LeadModule;
  selectedLeads?: ILead[];
} = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCompanyId, selectedPartnerId } = useAdminScope();
  const { resolvedModule, resolvedOperator } = useResolvedOrderScope(module);

  const isAdminUser = user?.user?.role === "ADMIN";
  const useAdminFilters = isAdminDomain && isAdminUser;

  const partnerId = useAdminFilters
    ? (selectedPartnerId ?? undefined)
    : (user?.user?.partner_id ?? undefined);
  const companyId = useAdminFilters
    ? (selectedCompanyId ?? undefined)
    : (user?.user?.company_id ?? undefined);

  const { data: statementData, isLoading: isStatementLoading } =
    useStatementQuery({
      enabled: partnerId != null,
    });

  const { data: priceData, isLoading: isPricesLoading } =
    useLeadTablePricesQuery({
      partnerId,
      companyId,
      enabled: partnerId != null || companyId != null,
    });

  const availableBalance =
    (statementData?.current_credit ?? 0) + (statementData?.bonus_credit ?? 0);

  const totalCost = useMemo(
    () =>
      selectedLeads.reduce(
        (sum, lead) =>
          sum +
          resolveLeadPrice(lead, priceData?.prices ?? [], partnerId, companyId),
        0,
      ),
    [selectedLeads, priceData?.prices, partnerId, companyId],
  );

  const canReserve =
    !!resolvedModule &&
    !!resolvedOperator &&
    selectedLeads.length > 0 &&
    !isStatementLoading &&
    !isPricesLoading &&
    availableBalance >= totalCost;

  const reserveMutation = useMutation({
    mutationFn: async (leadIds: number[]) => {
      if (!resolvedModule || !resolvedOperator) {
        throw new Error(
          "Não foi possível resolver a operadora para reservar o lead.",
        );
      }

      const selected = selectedLeads.filter((lead) =>
        leadIds.includes(lead.id),
      );
      const computedTotal = selected.reduce(
        (sum, lead) =>
          sum +
          resolveLeadPrice(lead, priceData?.prices ?? [], partnerId, companyId),
        0,
      );

      if (computedTotal > availableBalance) {
        throw new Error(
          "Saldo insuficiente para reservar os leads selecionados.",
        );
      }

      if (leadIds.length === 1) {
        return LeadsService.reserve(
          resolvedModule,
          resolvedOperator,
          leadIds[0],
        );
      }

      return LeadsService.reserveMany(resolvedModule, resolvedOperator, {
        lead_ids: leadIds,
      });
    },
    onMutate: () => ({
      toastId: fb.updateLoading("Reserva de leads"),
    }),
    onError: (_error, _variables, context) => {
      if (context?.toastId) {
        fb.updateError("Reserva de leads", context.toastId);
      }
    },
    onSuccess: async (_data, _variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["leads"] }),
        queryClient.invalidateQueries({ queryKey: ["leads-mine"] }),
        queryClient.invalidateQueries({ queryKey: ["statements"] }),
        queryClient.invalidateQueries({ queryKey: ["partners"] }),
      ]);

      if (context?.toastId) {
        fb.updateSuccess("Reserva de leads", context.toastId);
      }

      message.success("Leads reservados com sucesso.");
    },
  });

  return {
    reserveLeads: reserveMutation.mutateAsync,
    isPending: reserveMutation.isPending,
    canReserve,
    totalCost,
    availableBalance,
    isLoadingContext: isStatementLoading || isPricesLoading,
  };
}
