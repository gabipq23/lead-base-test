import { createFileRoute, redirect } from "@tanstack/react-router";

import { can, getStoredUserRole } from "@/helpers/access-control.helper";
import { ReservedLeadsPage } from "@/pages/leads/reserved";

export const Route = createFileRoute("/app/reserved-leads")({
    component: ReservedLeadsPage,
    beforeLoad: () => {
        if (!can(getStoredUserRole(), "reserved-leads", "view")) {
            throw redirect({ to: "/app" });
        }
    },
});