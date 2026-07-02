import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip, Typography } from "antd";
import { useZapCheckerFilterController } from "./controller/filterController";
import { PatternFormat, type PatternFormatProps } from "react-number-format";

import { useZapCheckerController } from "./controller/dataController";
import { appSetting } from "@/constants/app-setting/config.const";
const PhoneInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="(##) #####-####"
    customInput={Input}
    placeholder="Telefone"
    size="middle"
    className="h-8"
    style={{
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    }}
  />
);
export default function ZapChecker() {
  const queryClient = new QueryClient();
  const [form] = Form.useForm();

  const { tableColumns, styles } = useZapCheckerFilterController();
  const { checkZap, isLoadingZapChecker, zapChecker } =
    useZapCheckerController();

  const handleSubmit = (values: any) => {
    const phoneLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    checkZap(phoneLimpo);
  };

  const handleClear = () => {
    form.resetFields();
  };
  const color = appSetting?.primaryColor;
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col py-6 min-h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-2 justify-between  ">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              Zap Checker
            </Typography.Title>
            <div className=" flex flex-col gap-1  text-[14px]  text-neutral-500">
              <p>
                Verifique se um número de telefone está registrado no WhatsApp.
              </p>
              <p>
                Para consultas em massa ou integração do serviço via API em
                outras plataformas acesse{" "}
                <a
                  href="https://zapchecker.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: color,
                    textDecoration: "underline"
                  }}
                >
                  https://zapchecker.online
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
                <div className="flex ">
                  <Form.Item name="numero">
                    <PhoneInput format="(##) #####-####" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoadingZapChecker}
                      style={{
                        backgroundColor: color,
                        color: "white",
                        borderColor: "#000000",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        height: "32px",
                      }}
                    >
                      <SearchOutlined /> Consultar
                    </Button>
                  </Form.Item>
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
          {zapChecker && (
            <div className="hidden md:block overflow-y-auto ">
              {(() => {
                const dataSource = Array.isArray(zapChecker)
                  ? zapChecker
                  : zapChecker
                    ? [zapChecker]
                    : [];

                if (dataSource.length === 0) {
                  return (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-gray-500 text-lg">
                        Não encontramos resultado para essa pesquisa
                      </p>
                    </div>
                  );
                }

                return (
                  <Table<any>
                    scroll={{ y: 800 }}
                    rowKey={(_, index) => index?.toString() || "0"}
                    dataSource={dataSource}
                    loading={isLoadingZapChecker}
                    className={styles.customTable}
                    columns={tableColumns}
                    pagination={false}
                  />
                );
              })()}
            </div>
          )}
        </div>
      </QueryClientProvider>
    </>
  );
}
