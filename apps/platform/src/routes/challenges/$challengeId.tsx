import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "../__root.tsx";

const ChallengeDetailPage = lazy(() =>
  import("./$challengeId.page.tsx").then((module) => ({ default: module.ChallengeDetailPage })),
);

export const challengeDetailRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/challenges/$challengeId",
  component: ChallengeDetailPage,
});
