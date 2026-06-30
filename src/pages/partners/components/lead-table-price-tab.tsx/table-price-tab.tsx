
import { useLeadTablePricesQuery } from "@/hooks/leads-table-price/useLeadsTablePriceQuery";

import { TableMain } from "./table";
import type { EntityType } from "../../config-page.const";

interface Props {
  partner: EntityType | null;
}

export function TablePriceTab({ partner }: Props) {
  const { data, isLoading } = useLeadTablePricesQuery({
    partnerId: partner?.partner_id,
    enabled: !!partner?.partner_id,
  });

  return (
    <TableMain
      partner={partner}
      data={data?.prices ?? []}
      isLoading={isLoading}
    />
  );
}