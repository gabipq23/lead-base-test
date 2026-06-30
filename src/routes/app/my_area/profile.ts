import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/pages/my_area/profile/profile";

export const Route = createFileRoute("/app/my_area/profile")({
  component: ProfilePage,
});
