import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "./__root.tsx";

const ProfileRankPage = lazy(() =>
  import("./profile.rank.page.tsx").then((module) => ({ default: module.ProfileRankPage })),
);

export const profileRankRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/profile/rank",
  component: ProfileRankPage,
});
