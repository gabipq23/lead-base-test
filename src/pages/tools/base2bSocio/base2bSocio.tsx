import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip, Typography } from "antd";
import { useBase2bSocioFilterController } from "./controller/filterController";
import { PatternFormat, type PatternFormatProps, } from "react-number-format";
import { useState } from "react";
import { useBase2bSocioController } from "./controller/dataController";
import { customLocale } from "@/chat-uberich/utils/customLocale";
import { appSetting } from "@/constants/app-setting/config.const";


const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
    className="h-8"
  />
);
const CPFInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="###.###.###-##"
    customInput={Input}
    placeholder="CPF"
    size="middle"
    className="h-8"
  />
);
export default function Base2bSocio() {
  const queryClient = new QueryClient();
  const [cnpj, setCnpj] = useState("");
  const [cpf, setCpf] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { cpfTableColumns, cnpjTableColumns, styles } =
    useBase2bSocioFilterController();

  const {
    base2bSociosCPF,
    isLoadingSociosCPF,
    base2bSociosCNPJ,
    isLoadingSociosCNPJ,
  } = useBase2bSocioController(cpf, cnpj);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSubmit = (values: any) => {
    const cnpjLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    const cpfLimpo = values.cpf?.replace(/[^\d]/g, "") || "";

    // Resetar paginação ao fazer nova consulta
    setCurrentPage(1);
    setPageSize(50);

    if (cpfLimpo) {
      setCpf(cpfLimpo);
      setCnpj("");
    } else if (cnpjLimpo) {
      const cnpjBasico = cnpjLimpo.slice(0, 8); // Pega apenas os 8 primeiros dígitos
      setCnpj(cnpjBasico);
      setCpf(""); //
    }
  };

  const handleClear = () => {
    form.resetFields();
    setCnpj("");
    setCpf("");
    setCurrentPage(1);
    setPageSize(50);
  };

  const color = appSetting?.primaryColor;
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col py-6 min-h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-2 justify-between  ">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              Base2B / Busca-Sócio
            </Typography.Title>
            {/* <div className=" flex gap-1 items-center text-[14px]  text-neutral-500">
              <p>
                Consulte por CPF para encontrar empresas vinculadas ao
                documento, ou por CNPJ para listar todos os sócios da empresa.
              </p>
            </div> */}

            <div className=" flex flex-col gap-1  text-[14px]  text-neutral-500">
              <p>
                Consulte as informações disponíveis de uma empresa a partir do
                CNPJ ou CPF.
              </p>
              <p>
                Para mais alternativas de consulta, buscas em massa e
                enriquecimento de dados acesse{" "}
                <a
                  href="https://base2b.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: color,
                    textDecoration: "underline"
                  }}
                >
                  https://base2b.online
                </a>{" "}
                com os mesmos dados de login e senha que você utiliza nesta
                plataforma.
              </p>
            </div>
          </div>
          <div className=" flex mt-3 flex-col gap-4">
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    activeBorderColor: color,
                    hoverBorderColor: color,
                  },
                },
              }}
            >
              <Form form={form} onFinish={handleSubmit}>
                <div className="flex gap-2">
                  <Form.Item name="numero">
                    <CNPJInput format="##.###.###/####-##" />
                  </Form.Item>
                  <div className="flex gap-2">
                    <Form.Item name="cpf">
                      <CPFInput format="###.###.###-##" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoadingSociosCPF || isLoadingSociosCNPJ}
                        style={{
                          backgroundColor: color,
                          color: "white",
                          borderColor: "#000000",

                          height: "32px",
                        }}
                      >
                        <SearchOutlined /> Consultar
                      </Button>
                    </Form.Item>
                  </div>

                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorBorder: color,
                          colorText: color,
                          colorPrimary: color,
                          colorPrimaryHover: color,
                        },
                      },
                    }}
                  >
                    <div className="ml-2">
                      <Tooltip
                        title="Limpar consulta"
                        placement="top"
                        overlayStyle={{ fontSize: "12px" }}
                      >
                        <Button className="w-6 h-6" onClick={handleClear}>
                          X
                        </Button>
                      </Tooltip>
                    </div>
                  </ConfigProvider>
                </div>
              </Form>
            </ConfigProvider>
          </div>
          <ConfigProvider
            locale={customLocale}
            theme={{
              token: {
                colorPrimary: color,
                colorPrimaryHover: color,
                colorLink: color,
                colorPrimaryBg: "transparent",
              },
            }}
          >
            {(cpf || cnpj) && (
              <div className="overflow-y-auto ">
                {(() => {
                  const sociosCPF = base2bSociosCPF?.data?.empresas;
                  const sociosCNPJ = base2bSociosCNPJ?.data?.socios;

                  const hasData =
                    (Array.isArray(sociosCPF) && sociosCPF.length > 0) ||
                    (Array.isArray(sociosCNPJ) && sociosCNPJ.length > 0);
                  const isLoading = isLoadingSociosCPF || isLoadingSociosCNPJ;

                  if (hasData) {
                    return (
                      <Table<any>
                        scroll={{ y: 800 }}
                        rowKey={(_, index) => index?.toString() || "0"}
                        dataSource={
                          base2bSociosCPF?.data?.empresas ??
                          base2bSociosCNPJ?.data?.socios ??
                          []
                        }
                        loading={isLoading}
                        className={styles.customTable}
                        columns={
                          base2bSociosCPF?.data?.empresas
                            ? cpfTableColumns
                            : base2bSociosCNPJ?.data?.socios
                              ? cnpjTableColumns
                              : cpfTableColumns
                        }
                        pagination={{
                          current: currentPage,
                          pageSize: pageSize,
                          total:
                            base2bSociosCPF?.data?.total_count ??
                            base2bSociosCNPJ?.data?.count ??
                            0,
                          showSizeChanger: true,
                          pageSizeOptions: ["50", "100", "200", "500"],
                          showLessItems: true,
                          onChange: handlePageChange,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} registros`,
                        }}
                      />
                    );
                  } else if (!isLoading && (cpf || cnpj)) {
                    return (
                      <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500 text-lg">
                          Não encontramos resultado para essa pesquisa
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </ConfigProvider>
        </div>
      </QueryClientProvider>
    </>
  );
}
