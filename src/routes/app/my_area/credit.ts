import { createFileRoute } from "@tanstack/react-router";
import { CreditPage } from "@/pages/my_area/credit/credit";

export const Route = createFileRoute("/app/my_area/credit")({
  component: CreditPage,
});
