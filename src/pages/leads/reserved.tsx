import { Card, Typography } from "antd";
import { useMemo, useState } from "react";

import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { useMineLeadQuery } from "@/hooks/leads/useMineLeadQuery";

import { TableReservedLeads } from "./components/table-reserved-leads";

export function ReservedLeadsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [search, setSearch] = useState("");

    const { isGlobalAdmin } = useAuth();
    const { selectedSegmentId, selectedCompanyId, selectedPartnerId } = useAdminScope();

    const isAdmin = isAdminDomain && isGlobalAdmin;

    const { data: companiesData } = useCompanyQuery({
        enabled: isAdmin && !!selectedSegmentId,
    });

    const selectedCompany = companiesData?.companies.find(
        (company) => company.company_id === selectedCompanyId,
    );

    const operatorSlug = useMemo(() => {
        return selectedCompany?.company_name?.split(" ")[0]?.toLowerCase().trim();
    }, [selectedCompany?.company_name]);

    const { data, isLoading, isFetching, refetch } = useMineLeadQuery({
        model: "telecom",
        operatorSlug,
        page,
        per_page: pageSize,
        enabled: isAdmin ? !!selectedSegmentId && !!selectedCompanyId && !!selectedPartnerId : true,
    });

    const title = isAdmin ? "Leads Reservados" : "Meus Leads";


    const pagination = data?.pagination;

    return (
        <div className="py-6 min-h-[calc(100vh-140px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {title}
            </Typography.Title>

            {(!selectedSegmentId || !selectedCompanyId || !selectedPartnerId) ? (
                <Card className="border-neutral-200 shadow-sm">
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                        Selecione um segmento, uma empresa e uma operadora usando os seletores no topo da página.
                    </Typography.Paragraph>
                </Card>
            ) : (
                <div className="mt-4">
                    <TableReservedLeads
                        data={data?.leads ?? []}
                        isLoading={isLoading || isFetching}
                        currentPage={pagination?.page ?? page}
                        pageSize={pagination?.per_page ?? pageSize}
                        total={pagination?.total ?? 0}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPage(1);
                        }}
                        searchText={search}
                        onSearchChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        onRefresh={() => refetch()} showReservationInfo
                    />
                </div>
            )}
        </div>
    );
}