import { Card, Tag, Table, Typography, type TableColumnsType } from "antd";
import { useState, type JSX } from "react";
import { useStatementQuery } from "@/hooks/statement/useStatementQuery";
import { useStyle } from "@/style/tableStyle";
import type { StatementItem } from "@/services/statement.service";
import { useAdminScope } from "@/context/admin-scope-provider";
import { isAdminDomain } from "@/constants/app-setting/config.const";
import { useAuth } from "@/context/auth-provider";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string) {
  return value ? value : "-";
}

export function StatementPage(): JSX.Element {
  const { styles } = useStyle();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, isFetching } = useStatementQuery({
    page,
    perPage: pageSize,
  });
  const { selectedPartnerId } = useAdminScope();
  const { isGlobalAdmin } = useAuth();

  const isAdmin = isAdminDomain && isGlobalAdmin;

  const statements = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const currentPageSize = data?.per_page ?? pageSize;

  const columns: TableColumnsType<StatementItem> = [
    {
      title: "Data",
      dataIndex: "created_at",
      width: 170,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Usuário",
      dataIndex: "user",
      width: 140,
      render: (value: { user_name: string } | null | undefined) => value?.user_name ?? "-",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      width: 160,
      render: (type: StatementItem["type"]) => {
        const color = type === "ADICIONAR" ? "green" : type === "REMOVER" ? "red" : type === "BONUS" ? "blue" : type === "REEMBOLSAR" ? "orange" : "gray";
        return <Tag color={color}>{type === "ADICIONAR" ? "Recarga de créditos" : type === "REMOVER" ? "Consumo de créditos" : type === "BONUS" ? "Bônus" : type === "REEMBOLSAR" ? "Reembolso" : "Outro"}</Tag>;
      },
    },
    {
      title: "Valor",
      dataIndex: "amount",
      width: 140,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Saldo anterior",
      dataIndex: "balance_before",
      width: 140,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Saldo atual",
      dataIndex: "balance_after",
      width: 140,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      ellipsis: true,
    },

  ];
  const statementTable = (
    <Table
      rowKey="id"
      loading={isLoading || isFetching}
      columns={columns}
      dataSource={statements}
      className={styles.customTable}
      scroll={{ x: "max-content", y: 800 }}
      pagination={{
        current: currentPage,
        pageSize: currentPageSize,
        total,
        locale: { items_per_page: "" },
        pageSizeOptions: [20, 50, 100, 200],
        showSizeChanger: true,
        showTotal: (value) => `Total de ${value} movimentações`,
        onChange: setPage,
        onShowSizeChange: (_, size) => {
          setPageSize(size);
          setPage(1);
        },
      }}
    />
  );
  return (
    <div className="flex flex-col gap-3">
      <Typography.Title level={3} style={{ marginBottom: 0 }}>
        Extratos
      </Typography.Title>
      {isAdmin ?
        (selectedPartnerId ? (
          <>

            <div className="flex ">

              {statementTable}

            </div></>
        ) :
          (<>
            <Card className="border-neutral-200 shadow-sm">
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                Selecione um segmento, uma empresa e um parceiro usando os seletores no topo da página.
              </Typography.Paragraph>
            </Card></>)

        )
        :
        (<>
          <div className="flex ">
            {statementTable}

          </div></>)
      }

    </div>
  );
}