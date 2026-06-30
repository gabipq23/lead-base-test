import { createFileRoute } from "@tanstack/react-router";

import { StatementPage } from "@/pages/my_area/statement/statement";

export const Route = createFileRoute("/app/statement")({
  component: StatementPage,
});
