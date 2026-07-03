import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { CrmDashboardPage } from "@/pages/dashboard/dashboard";

export const Route = createFileRoute("/app/dashboard")({
  component: CrmDashboardPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "dashboard", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
