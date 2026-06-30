import { createFileRoute } from "@tanstack/react-router";

import { MineLeadsPage } from "@/pages/leads/mine";

export const Route = createFileRoute("/app/mine-leads")({
    component: MineLeadsPage,
});