import { createFileRoute } from "@tanstack/react-router";

import { StatementPage } from "@/pages/my_area/statement/statement";

export const Route = createFileRoute("/app/my_area/statement")({
  component: StatementPage,
});
