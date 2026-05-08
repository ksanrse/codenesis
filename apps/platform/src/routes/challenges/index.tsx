import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "../__root.tsx";

const ChallengesPage = lazy(() =>
  import("./index.page.tsx").then((module) => ({ default: module.ChallengesPage })),
);

export const challengesRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/challenges",
  component: ChallengesPage,
});
