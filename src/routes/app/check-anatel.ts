import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import CheckAnatel from "@/pages/tools/checkAnatel/checkAnatel";

export const Route = createFileRoute("/app/check-anatel")({
  component: CheckAnatel,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "check-anatel", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
