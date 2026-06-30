import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredUserRole } from "@/helpers/access-control.helper";

export const Route = createFileRoute("/app/my_area/")({
  beforeLoad: () => {
    const role = getStoredUserRole();

    throw redirect({
      to: role === "ADMIN" ? "/app/my_area/credit" : "/app/my_area/profile",
    });
  },
});
