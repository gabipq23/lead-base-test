import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import Base2bSocio from "@/pages/tools/base2bSocio/base2bSocio";

export const Route = createFileRoute("/app/base2b-busca-socio")({
  component: Base2bSocio,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "base2b-busca-socio", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
