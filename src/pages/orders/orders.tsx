import { Typography } from "antd";
import { useEffect, useState } from "react";

import {
  entityPage,
  getOrderCategoryLabelByModel,
  getOrderColumnsByModel,
  resolveOrderModel,
  resolveOrderCategory,
  resolveOrderClientType,
  resolvePartnerCategory,
  segmentComponents,
  segmentRegistry,
  useListEntity,
} from "./config-page.const";
import { useResolvedOrderScope } from "@/hooks/orders/useResolvedOrderScope";
import { useLeadQuery } from "@/hooks/leads/useLeadQuery";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { usePartnerQuery } from "@/hooks/partners/usePartnerQuery";
import { TableMain as CommonTableMain } from "./common/components/table";
import { OrdersService } from "@/services/orders.service";

interface OrdersPageProps {
  model?: string;
  category?: string;
  clientType?: string;
}

export function OrdersPage({ model, category, clientType }: OrdersPageProps) {
  const resolvedModel = resolveOrderModel(model);
  const { hasCategories } = segmentRegistry[resolvedModel];
  const resolvedCategory = hasCategories ? resolveOrderCategory(category, resolvedModel) : undefined;
  const resolvedClientType = resolveOrderClientType(clientType);
  const { resolvedPartnerId, resolvedCompanyId } = useResolvedOrderScope(resolvedModel);

  const leadsQuery = useLeadQuery({ model: resolvedModel, enabled: true });
  console.log("[OrdersPage] leadsQuery", leadsQuery);

  const { data: companiesData } = useCompanyQuery();
  const { data: partnersData } = usePartnerQuery({
    partnerId: resolvedPartnerId,
    enabled: resolvedPartnerId != null,
  });

  const partnerCategories = partnersData?.partners?.[0]?.category ?? [];
  const effectiveCategory = hasCategories
    ? resolvePartnerCategory(
      resolvedCategory,
      partnerCategories,
      resolvedModel,
    )
    : undefined;
  const columns = getOrderColumnsByModel(resolvedModel, companiesData?.companies ?? []);
  const { FormModal: FormModalComponent, ViewModal: ViewModalComponent } =
    segmentComponents[resolvedModel];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [idSearch, setIdSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string | null>("");
  const [dateTo, setDateTo] = useState<string | null>("");
  const { data, isLoading } = useListEntity({
    model: resolvedModel,
    filters: {
      ...(effectiveCategory ? { category: effectiveCategory } : {}),
      ...(resolvedClientType ? { client_type: resolvedClientType } : {}),
      ...(search ? { search } : {}),
      ...(region ? { region } : {}),
      ...(status ? { status } : {}),
      ...(idSearch ? { id: idSearch } : {}),
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),

    },
    page,
    per_page: pageSize,
  });

  useEffect(() => {
    if (leadsQuery.data !== undefined) {
      console.log("[useLeadQuery] response", leadsQuery.data);
    }
  }, [leadsQuery.data]);

  useEffect(() => {
    if (leadsQuery.error) {
      console.error("[useLeadQuery] error", leadsQuery.error);
    }
  }, [leadsQuery.error]);

  const clientTypeLabel = resolvedClientType ? ` ${resolvedClientType}` : "";
  const titleLabel = hasCategories
    ? ` - ${getOrderCategoryLabelByModel(effectiveCategory ?? "", resolvedModel)}${clientTypeLabel}`
    : "";

  return (
    <div className="py-6 min-h-[calc(100vh-140px)]">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        {entityPage.plural}{titleLabel}
      </Typography.Title>
      <CommonTableMain
        data={data?.orders || []}
        searchText={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        regionText={region}
        onRegionChange={(value) => {
          setRegion(value);
          setPage(1);
        }}
        statusText={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        idText={idSearch}
        onIdChange={(value) => {
          setIdSearch(value);
          setPage(1);
        }}
        dateFrom={dateFrom}
        onDateFromChange={(value) => {
          setDateFrom(value);
          setPage(1);
        }}
        dateTo={dateTo}
        onDateToChange={(value) => {
          setDateTo(value);
          setPage(1);
        }}
        isLoading={isLoading}
        columns={columns}
        FormModalComponent={FormModalComponent}
        ViewModalComponent={ViewModalComponent}
        currentPage={page}
        pageSize={pageSize}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        companies={companiesData?.companies ?? []}
        onExportAll={async () => {
          const response = await OrdersService.getAllOrderExport<{ orders: any[] }>(
            resolvedModel,
            {
              ...(effectiveCategory ? { category: effectiveCategory } : {}),
              ...(resolvedClientType ? { client_type: resolvedClientType } : {}),
              ...(resolvedCompanyId != null ? { company_id: resolvedCompanyId } : {}),
              ...(resolvedPartnerId != null ? { partner_id: resolvedPartnerId } : {}),
            } as any,
          );
          return response.orders;
        }}
      />
    </div>
  );
}
