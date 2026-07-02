import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";

import CheckOperadora from "@/pages/tools/checkOperadora/checkOperadora";

export const Route = createFileRoute("/app/check-operadora")({
  component: CheckOperadora,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "check-operadora", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
