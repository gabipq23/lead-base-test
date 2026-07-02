import { Tooltip, type TableColumnsType } from "antd";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-container .ant-table-body,
      .ant-table-container .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
        scrollbar-gutter: stable;
      }
      /* Diminui fonte do header */
      .ant-table-thead > tr > th {
        font-size: 12px !important;
      }
      /* Diminui fonte do body */
      .ant-table-tbody > tr > td {
        font-size: 12px !important;
      }
      /* Cor de fundo do header */
      .ant-table-thead > tr > th {
        background: #e9e9e9 !important;
      }
      /* Cor de fundo do body */
      .ant-table-tbody > tr > td {
        background: #fff !important;
      }
      /* Destaca a linha ao passar o mouse (mantém o efeito padrão do Ant Design) */
      .ant-table-tbody > tr.ant-table-row:hover > td {
        background: #e9e9e9 !important;
      }
      .ant-table-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px;
      }
    `,
  };
});

export function useBase2bSocioFilterController() {
  const { styles } = useStyle();

  // Tabela para pesquisa por CPF (empresas que a pessoa é sócia)
  const cpfTableColumns: TableColumnsType<any> = [
    {
      title: "CNPJ",
      dataIndex: ["matriz", "base_cnpj"],
      width: 140,
      render: (_, record) => {
        const baseCnpj = record?.matriz?.base_cnpj;
        const ordemCnpj = record?.matriz?.ordem_cnpj;
        const dvCnpj = record?.matriz?.dv_cnpj;

        if (!baseCnpj || !ordemCnpj || !dvCnpj) return "-";

        const cnpj = `${baseCnpj}${ordemCnpj}${dvCnpj}`;
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
      },
    },
    {
      title: "Nome da Empresa",
      dataIndex: ["empresa", "name"],
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      render: (nome_empresa) => (
        <Tooltip
          placement="topLeft"
          title={nome_empresa}
          overlayStyle={{ fontSize: "12px" }}
        >
          {nome_empresa ? nome_empresa : "-"}
        </Tooltip>
      ),
    },
    {
      title: "Qualificação",
      dataIndex: ["socio", "qualificacao"],
      width: 160,
      render: (value) => value || "-",
    },
    {
      title: "Capital Social",
      dataIndex: ["empresa", "capital"],
      width: 160,
      render: (value) => {
        if (!value) return "-";
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      },
    },
    {
      title: "Porte",
      dataIndex: ["empresa", "porte"],
      width: 100,
      render: (porte) => {
        switch (porte) {
          case "00":
            return "Não informado";
          case "01":
            return "ME";
          case "03":
            return "EPP";
          case "05":
            return "Demais";
          default:
            return "-";
        }
      },
    },
    {
      title: "Natureza Jurídica",
      dataIndex: ["empresa", "natureza", "name"],
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (natureza_juridica) => (
        <Tooltip
          placement="topLeft"
          title={natureza_juridica}
          overlayStyle={{ fontSize: "12px" }}
        >
          {natureza_juridica ? natureza_juridica : "-"}
        </Tooltip>
      ),
    },
    {
      title: "Data Entrada",
      dataIndex: ["socio", "data_entrada"],
      width: 120,
      render: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString("pt-BR");
      },
    },
  ];

  // Tabela para pesquisa por CNPJ (sócios de uma empresa)
  const cnpjTableColumns: TableColumnsType<any> = [
    {
      title: "Nome do Sócio",
      dataIndex: "nome_socio",
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={value}
          overlayStyle={{ fontSize: "12px" }}
        >
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      width: 140,
      render: (value) => value || "-",
    },
    {
      title: "Qualificação",
      dataIndex: "qualificacao",
      width: 180,
      render: (value) => value || "-",
    },
    {
      title: "Empresa",
      dataIndex: "razao_social",
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={value}
          overlayStyle={{ fontSize: "12px" }}
        >
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj_completo",
      width: 170,
      render: (value) => {
        if (!value) return "-";

        return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
          5,
          8
        )}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
      },
    },
    {
      title: "Porte",
      dataIndex: "porte",
      width: 120,
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      width: 160,
    },
    {
      title: "UF",
      dataIndex: "uf",
      width: 80,
    },
    {
      title: "Situação",
      dataIndex: "situacao_cadastral",
      width: 140,
    },
  ];

  return {
    cpfTableColumns,
    cnpjTableColumns,
    styles: { customTable: styles.customTable },
  };
}
