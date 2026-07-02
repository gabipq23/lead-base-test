import { Button, ConfigProvider, Tooltip, type TableColumnsType } from "antd";
import { createStyles } from "antd-style";

import { CopyOutlined } from "@ant-design/icons";
import { useState } from "react";
import { formatPhoneNumber } from "@/utils/number.utils";
import { formatDateTimeBR } from "@/utils/formatDateTimeBR";

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

export function useCheckAnatelFilterController() {
  const { styles } = useStyle();
  const [tooltipTitle, setTooltipTitle] = useState("Copiar dados");

  const copyDataToClipboard = (record: any) => {
    const formattedData = `Telefone: ${record.numero ? formatPhoneNumber(record.numero) : "-"}
Tipo: ${record.tipo || "-"}
Operadora de Origem: ${record.operadora_original || "-"}
Operadora Atual: ${record.operadora_atual || "-"}
Data Portabilidade: ${record.data_portabilidade ? formatDateTimeBR(record.data_portabilidade) : "-"}
UF: ${record.uf || "-"}
M: ${record.m || "-"}`;

    navigator.clipboard
      .writeText(formattedData)
      .then(() => {
        setTooltipTitle("Copiado!");
        setTimeout(() => setTooltipTitle("Copiar dados"), 2000);
      })
      .catch((err) => {
        console.error("Erro ao copiar dados:", err);
      });
  };

  const tableColumns: TableColumnsType<any> = [
    // {
    //   title: "DDD",
    //   dataIndex: "ddd",
    //   width: 60,
    // },
    {
      title: "Número",
      dataIndex: "numero",
      width: 120,
      render: (value) => (value ? formatPhoneNumber(value) : "-"),
    },
    // {
    //   title: "Anatel",
    //   dataIndex: "anatel",
    //   width: 100,
    // },
    {
      title: "Tipo",
      dataIndex: "tipo",
      width: 100,
      render: (value) => (value ? value : "-"),
    },
    // {
    //   title: "Operadora de Origem",
    //   dataIndex: "operadora_original",
    //   width: 150,
    //   render: (value) => (value ? value : "-"),
    // },
    // {
    //   title: "Operadora Atual",
    //   dataIndex: "operadora_atual",
    //   width: 120,
    //   render: (value) => (value ? value : "-"),
    // },
    // {
    //   title: "Portado",
    //   dataIndex: "portado",
    //   width: 100,
    // },
    // {
    //   title: "Data Portabilidade",
    //   dataIndex: "data_portabilidade",
    //   width: 140,
    //   render: (value, record) => {
    //     // Se operadora_atual for null, undefined ou string vazia, não renderiza nada
    //     if (!record.operadora_atual || record.operadora_atual === "") {
    //       return "-";
    //     }
    //     return value ? formatDateTimeBR(value) : "-";
    //   },
    // },
    // {
    //   title: "Município de Registro",
    //   dataIndex: "municipioRegistro",
    //   width: 160,
    // },
    {
      title: "UF",
      dataIndex: "UF",
      render: (uf) => (uf ? uf : "-"),
      width: 100,
    },
    {
      title: "M",
      dataIndex: "M",
      render: (value) => (value ? value : "-"),
      width: 100,
    },

    {
      title: "",
      dataIndex: "acao",
      width: 40,
      render: (_, record) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorBorder: "#660099",
                colorText: "#660099",
                colorPrimary: "#660099",
                colorPrimaryHover: "#883fa2",
              },
            },
          }}
        >
          <div className="flex gap-4">
            <Tooltip
              title={tooltipTitle}
              placement="top"
              overlayStyle={{ fontSize: "12px" }}
            >
              <Button
                className="w-6 h-6"
                onClick={() => copyDataToClipboard(record)}
              >
                <CopyOutlined />
              </Button>
            </Tooltip>
          </div>
        </ConfigProvider>
      ),
    },
  ];

  return {
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
