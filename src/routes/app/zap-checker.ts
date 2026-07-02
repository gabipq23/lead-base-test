import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import ZapChecker from "@/pages/tools/zapChecker/zapChecker";

export const Route = createFileRoute("/app/zap-checker")({
  component: ZapChecker,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "zap-checker", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
