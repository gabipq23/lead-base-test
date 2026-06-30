import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { TriggersPage } from "@/pages/triggers/triggers";

export const Route = createFileRoute("/app/triggers")({
  component: TriggersPage,
  beforeLoad: () => {
    if (!can(getStoredUserRole(), "triggers", "view")) {
      throw redirect({ to: "/app" });
    }
  },
});
