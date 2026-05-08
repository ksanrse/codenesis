import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "../__root.tsx";

const CollectionsPage = lazy(() =>
  import("./index.page.tsx").then((module) => ({ default: module.CollectionsPage })),
);

export const collectionsRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/collections",
  component: CollectionsPage,
});
