import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import PJChecker from "@/pages/tools/pjChecker/pjChecker";

export const Route = createFileRoute("/app/pj-checker")({
  component: PJChecker,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "pj-checker", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
