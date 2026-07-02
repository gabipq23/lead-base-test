import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import Base2bEmpresa from "@/pages/tools/base2bEmpresa/base2bEmpresa";

export const Route = createFileRoute("/app/base2b-busca-empresa")({
  component: Base2bEmpresa,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "base2b-busca-empresa", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
