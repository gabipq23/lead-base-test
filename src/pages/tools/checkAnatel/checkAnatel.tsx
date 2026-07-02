import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip, Typography } from "antd";
import { useCheckAnatelFilterController } from "./controller/filterController";

import { useState } from "react";
import { PatternFormat, type PatternFormatProps } from "react-number-format";
import { useCheckAnatelController } from "./controller/dataController";
import { customLocale } from "@/chat-uberich/utils/customLocale";
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
export default function CheckAnatel() {
  const queryClient = new QueryClient();
  const { tableColumns, styles } = useCheckAnatelFilterController();
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const { checkAnatel, isLoadingCheckAnatel } = useCheckAnatelController(phone);
  const handleSubmit = (values: any) => {
    const phoneLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    setPhone(phoneLimpo);
  };

  const handleClear = () => {
    form.resetFields();
    setPhone("");
  };
  const color = appSetting?.primaryColor;
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col py-6 min-h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-2 justify-between  ">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              Check Anatel
            </Typography.Title>

            <div className=" flex flex-col gap-1  text-[14px]  text-neutral-500">
              <p>
                Digite o número de telefone que você quer descobrir se é válido.
              </p>
              <p>
                Para consultas em massa ou integração do serviço via API em
                outras plataformas, acesse
                <a
                  href="https://checkanatel.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: color,
                    textDecoration: "underline"
                  }}
                >
                  https://checkanatel.online
                </a>{" "}
                com os mesmos dados de login e senha que você utiliza nesta
                plataforma.
              </p>
            </div>
          </div>
          <div className="mt-2">
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
              <Form onFinish={handleSubmit} form={form}>
                <div className="flex ">
                  <Form.Item name="numero">
                    <PhoneInput format="(##) #####-####" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoadingCheckAnatel}
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
                        <Button onClick={handleClear} className="w-6 h-6">
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
            {phone && (
              <div className="hidden md:block overflow-y-auto ">
                {(() => {
                  if (checkAnatel) {
                    return (
                      <Table<any>
                        scroll={{ y: 800 }}
                        rowKey="id"
                        dataSource={[checkAnatel]}
                        loading={isLoadingCheckAnatel}
                        className={styles.customTable}
                        columns={tableColumns}
                        pagination={false}
                      />
                    );
                  } else if (!isLoadingCheckAnatel && phone) {
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
