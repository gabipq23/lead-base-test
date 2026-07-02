import { formatPhoneNumber } from "@/utils/number.utils";
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
        margin-top: 16px; /* opcional: dá um espaçamento
        colorText: "#660099",
        colorTextActive: "#550088", */
      }
    `,
  };
});

export function usePJCheckerFilterController() {
  const { styles } = useStyle();

  const tableColumns: TableColumnsType<any> = [
    {
      title: "DDD",
      dataIndex: "ddd",
      width: 60,
    },
    {
      title: "Número",
      dataIndex: "numero",
      width: 120,
      render: (value) => (value ? formatPhoneNumber(value) : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
    },
    {
      title: "Anatel",
      dataIndex: "anatel",
      width: 100,
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      width: 100,
    },
    {
      title: "UF",
      dataIndex: "uf",
      width: 50,
    },
    {
      title: "Município",
      dataIndex: "municipio",
      width: 140,
    },
    {
      title: "PJ",
      dataIndex: "pj",
      width: 100,
      render: (value) => (value ? "Sim" : "Não"),
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      width: 160,
    },
    {
      title: "Razão Social",
      dataIndex: "razaoSocial",
      width: 170,
    },
    {
      title: "MEI",
      dataIndex: "mei",
      width: 60,
      render: (value) => (value ? "Sim" : "Não"),
    },

    {
      title: "Porte",
      dataIndex: "porte",
      width: 100,
    },
    {
      title: "RFB",
      dataIndex: "rfb",
      width: 100,
    },
    {
      title: "CS",
      dataIndex: "cs",
      width: 100,
    },
    {
      title: "QSA",
      dataIndex: "socios",
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (socios) => {
        if (!Array.isArray(socios) || socios.length === 0) return "-";
        const list = socios
          .map(
            (socio) =>
              `${socio.nome}${socio.isADM ? " (ADM)" : ""} - ${socio.cpf}`
          )
          .join("; ");
        return (
          <Tooltip
            placement="topLeft"
            title={
              <div style={{ whiteSpace: "pre-line", fontSize: "12px" }}>
                {list}
              </div>
            }
            overlayStyle={{ fontSize: "12px" }}
          >
            <div>
              {socios.slice(0, 1).map((socio, idx) => (
                <div key={idx}>
                  {socio.nome || "-"}
                  {socio.isADM ? " (ADM)" : ""} - CPF: {socio.cpf || "-"}
                </div>
              ))}
              {socios.length > 1 && (
                <div style={{ color: "#888", fontSize: 12 }}>
                  +{socios.length - 1} outros
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return {
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
