import { Card, Typography } from "antd";
import { entityPage, useListEntity } from "./config-page.const";
import { TableMain } from "./components/table";
import { useAdminScope } from "@/context/admin-scope-provider";
import { useAuth } from "@/context/auth-provider";

export function TriggersPage() {
    const { data, isLoading } = useListEntity();
    const { selectedSegmentId, selectedCompanyId, selectedPartnerId } = useAdminScope();
    const { isGlobalAdmin } = useAuth();

    return (
        <div className="py-6 min-h-[calc(100vh-140px)]">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
                {entityPage.plural}
            </Typography.Title>
            {isGlobalAdmin ? (
                (!selectedSegmentId || !selectedCompanyId || !selectedPartnerId) ? (
                    <Card style={{ marginBottom: 16 }}>
                        <Typography.Paragraph>
                            Selecione um segmento, uma empresa e um parceiro usando os seletores no topo da página.
                        </Typography.Paragraph>
                    </Card>) :
                    (<TableMain data={data?.configs || []} isLoading={isLoading} />
                    )
            ) : (
                <TableMain data={data?.configs || []} isLoading={isLoading} />
            )}
        </div>
    );
}