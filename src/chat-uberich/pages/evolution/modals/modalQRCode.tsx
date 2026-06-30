import { Modal, Spin, Typography } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

export default function ModalQRCode({
  showModal,
  setShowModal,
  qrCodeQuery,
  isQRCodeFetching,
  connectionStatus,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  qrCodeQuery: any;
  isQRCodeFetching: boolean;
  connectionStatus?: string;
}) {
  const handleClose = () => {
    setShowModal(false);
  };

  const isLoading =
    isQRCodeFetching || !qrCodeQuery || !qrCodeQuery.code;

  useEffect(() => {
    if (connectionStatus === "open" && showModal) {
      setShowModal(false);
    }
  }, [connectionStatus, showModal, setShowModal]);

  return (
    <Modal
      open={showModal}
      title="Habilitar conta"
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnHidden
      width={500}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 260,
          padding: "16px 0",
        }}
      >
        {isLoading ? (
          <>
            <Spin size="large" />
            <Typography.Text style={{ marginTop: 16 }}>
              Gerando QR Code...
            </Typography.Text>
          </>
        ) : (
          <>
            <QRCodeSVG value={qrCodeQuery.code} size={220} />
            <Typography.Text
              type="secondary"
              style={{ marginTop: 16, textAlign: "center" }}
            >
              Escaneie o QR Code para conectar a conta
            </Typography.Text>
          </>
        )}
      </div>
    </Modal>
  );
}