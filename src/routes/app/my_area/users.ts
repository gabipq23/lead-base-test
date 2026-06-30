import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/pages/users/users";

export const Route = createFileRoute("/app/my_area/users")({
  component: UsersPage,
});
