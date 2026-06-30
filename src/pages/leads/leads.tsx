import { Typography } from "antd";
import { useEffect, useState } from "react";

import { useLeadQuery } from "@/hooks/leads/useLeadQuery";
import { TableMain } from "./components/table";

export function LeadsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [search, setSearch] = useState("");
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
    const { data, isLoading, isFetching, refetch } = useLeadQuery({
        model: "telecom",
        page,
        per_page: pageSize,
    });
    useEffect(() => {
        if (!isFetching) {
            setLastUpdatedAt(new Date());
        }
    }, [isFetching]);
    const pagination = data?.pagination;

    return (
        <div className="py-6 min-h-[calc(100vh-140px)]">
            <Typography.Title level={3} style={{ marginBottom: 4 }}>
                Leads ao vivo
            </Typography.Title>


            <TableMain
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
                onRefresh={() => refetch()}
                lastUpdatedAt={lastUpdatedAt}
            />

        </div>
    );
}