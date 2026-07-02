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

export function useZapCheckerFilterController() {
  const { styles } = useStyle();

  const tableColumns: TableColumnsType<any> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      width: 100,
      render: (value) => (
        <img
          src={value}
          alt="Avatar"
          style={{ width: 36, height: 36, borderRadius: "50%" }}
        />
      ),
    },
    // {
    //   title: "DDD",
    //   dataIndex: "ddd",
    //   width: 60,
    // },
    {
      title: "Número",
      dataIndex: "numero",
      width: 100,
      render: (value) => (value ? formatPhoneNumber(value) : "-"),
    },
    // {
    //   title: "Anatel",
    //   dataIndex: "anatel",
    //   width: 100,
    // },
    // {
    //   title: "Tipo",
    //   dataIndex: "tipo",
    //   width: 100,
    // },
    {
      title: "Whatsapp",
      dataIndex: "existe_no_whatsapp",
      width: 100,
      render: (value) => (value ? "Sim" : "Não"),
    },
    {
      title: "Tipo",
      dataIndex: "is_comercial",
      width: 100,
      render: (is_comercial) => {
        if (is_comercial === true) return "Business";
        if (is_comercial === false) return "Messenger";
        return "-";
      },
    },

    {
      title: "Título",
      dataIndex: "titulo",
      width: 160,
      render: (titulo) => (titulo ? titulo : "-"),
    },
    {
      title: "Recado",
      dataIndex: "recado",
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (recado) => (
        <Tooltip
          placement="topLeft"
          title={recado}
          overlayStyle={{ fontSize: "12px" }}
        >
          {recado || "-"}
        </Tooltip>
      ),
    },
  ];

  return {
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
