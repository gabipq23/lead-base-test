import { createFileRoute, redirect } from "@tanstack/react-router";

import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { LeadsPage } from "@/pages/leads/leads";

export const Route = createFileRoute("/app/leads")({
  component: LeadsPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "orders", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
