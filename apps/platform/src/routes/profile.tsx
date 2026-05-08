import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "./__root.tsx";

const ProfilePage = lazy(() =>
  import("./profile.page.tsx").then((module) => ({ default: module.ProfilePage })),
);

export const profileRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/profile",
  component: ProfilePage,
});
