import { createFileRoute } from "@tanstack/react-router";
import { MyAreaPage } from "@/pages/my_area/my_area";

export const Route = createFileRoute("/app/my_area")({
  component: MyAreaPage,
});
