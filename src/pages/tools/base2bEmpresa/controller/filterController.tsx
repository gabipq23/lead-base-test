
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

export function useBase2bEmpresaFilterController() {
  const { styles } = useStyle();

  const formatPhone = (phone: string) => {
    if (!phone || phone.length < 10) return phone;

    const ddd = phone.slice(0, 2);
    const number = phone.slice(2);

    if (number.length === 9 && number.startsWith("9")) {
      return `(${ddd}) ${number.slice(0, 1)} ${number.slice(1, 5)}-${number.slice(5)}`;
    }

    if (number.length === 8) {
      return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
    }
    return phone;
  };

  const tableColumns: TableColumnsType<any> = [
    {
      title: "CNPJ",
      dataIndex: "base_cnpj",
      width: 140,
      render: (_, record) => {
        if (!record.base_cnpj) return "-";
        const cnpj = `${record.base_cnpj}${record.ordem_cnpj}${record.dv_cnpj}`;
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
      },
    },
    {
      title: "Razão Social",
      dataIndex: ["empresa", "name"],
      width: 280,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip
          placement="topLeft"
          title={name}
          overlayStyle={{ fontSize: "12px" }}
        >
          {name || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Sócios",
      dataIndex: ["empresa", "socios"],
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (socios) => {
        if (!socios || socios.length === 0) return "-";

        const getDocumento = (socio: any) => {
          const tipo = socio?.tipo;
          if (tipo === 1) {
            return socio.cpf_cnpj || "N/A";
          } else if (tipo === 2) {
            return socio.cpf_completo || socio.cpf_cnpj;
          }
          return socio.cpf_completo || socio.cpf_cnpj;
        };

        const getDocumentoLabel = (socio: any) => {
          const tipo = socio?.tipo;
          return tipo === 1 ? "CNPJ" : "CPF";
        };

        const formatSocio = (socio: any) => {
          const isSocioAdmin =
            socio?.qualificacao?.name === "Sócio-Administrador";
          const documento = getDocumento(socio);
          const label = getDocumentoLabel(socio);
          return `${socio.name} ${isSocioAdmin ? "⭐" : ""} - ${label}: ${documento}`;
        };

        if (socios.length === 1) {
          const socio = socios[0];
          const isSocioAdmin =
            socio?.qualificacao?.name === "Sócio-Administrador";
          const documento = getDocumento(socio);
          const label = getDocumentoLabel(socio);
          return (
            <div style={{ fontSize: "11px" }}>
              <div>
                {socio.name} {isSocioAdmin && "⭐"}
              </div>
              <div style={{ color: "#666", fontSize: "10px" }}>
                {label}: {documento}
              </div>
            </div>
          );
        }

        return (
          <Tooltip
            title={
              <div>
                {socios.map((socio: any, index: number) => (
                  <div key={index}>{formatSocio(socio)}</div>
                ))}
              </div>
            }
            placement="topLeft"
            overlayStyle={{ fontSize: "12px" }}
          >
            <div style={{ fontSize: "11px" }}>
              <div>
                {(() => {
                  const firstSocio = socios[0];
                  const isSocioAdmin =
                    firstSocio?.qualificacao?.name === "Sócio-Administrador";
                  return `${firstSocio.name} ${isSocioAdmin ? "⭐" : ""}`;
                })()}
              </div>
              <div style={{ color: "#666", fontSize: "10px" }}>
                {getDocumentoLabel(socios[0])}: {getDocumento(socios[0])}
              </div>
              {socios.length > 1 && (
                <div style={{ color: "#888", fontSize: 10 }}>
                  +{socios.length - 1} outros
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "CNAE",
      dataIndex: ["cnae_principal", "name"],
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip
          placement="topLeft"
          title={name}
          overlayStyle={{ fontSize: "12px" }}
        >
          {name || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Porte",
      dataIndex: ["empresa", "porte"],
      width: 80,
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
      title: "RFB",
      dataIndex: "situacao_cadastral",
      width: 100,
      render: (situacao) => {
        switch (situacao) {
          case 1:
            return "Nula";
          case 2:
            return "Ativa";
          case 3:
            return "Suspensa";
          case 4:
            return "Inapta";
          case 8:
            return "Baixada";
          default:
            return "-";
        }
      },
    },
    {
      title: "Natureza Jurídica ",
      dataIndex: ["empresa", "natureza", "name"],
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip
          placement="topLeft"
          title={name}
          overlayStyle={{ fontSize: "12px" }}
        >
          {name || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Capital Social",
      dataIndex: ["empresa", "capital"],
      width: 120,
      render: (value) => {
        if (!value) return "-";
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      },
    },
    {
      title: "UF",
      dataIndex: "uf",
      width: 50,
    },
    {
      title: "Município",
      dataIndex: ["municipio", "name"],
      width: 130,
    },
    {
      title: "CEP",
      dataIndex: "cep",
      width: 100,
      render: (value) => {
        if (!value) return "-";
        return `${value.slice(0, 5)}-${value.slice(5, 8)}`;
      },
    },
    {
      title: "Número",
      dataIndex: "numero",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 210,
    },

    {
      title: "Telefones",
      dataIndex: "telefone_1",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const phones = [];
        if (record.ddd_1 && record.telefone_1) {
          phones.push(`${record.ddd_1}${record.telefone_1}`);
        }
        if (record.ddd_2 && record.telefone_2) {
          phones.push(`${record.ddd_2}${record.telefone_2}`);
        }
        if (record.ddd_fax && record.fax) {
          phones.push(`${record.ddd_fax}${record.fax}`);
        }

        if (phones.length === 0) {
          return <span>-</span>;
        }
        if (phones.length === 1) {
          return <span>{formatPhone(phones[0])}</span>;
        }
        return (
          <Tooltip
            title={phones.map(formatPhone).join("; ")}
            placement="topLeft"
            overlayStyle={{ fontSize: "12px" }}
          >
            <span>
              {formatPhone(phones[0])}{" "}
              <span style={{ color: "#888" }}>
                {phones.length > 1 && (
                  <div style={{ color: "#888", fontSize: 12 }}>
                    +{phones.length - 1} outros
                  </div>
                )}
              </span>
            </span>
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
