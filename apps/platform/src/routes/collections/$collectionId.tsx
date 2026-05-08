import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "../__root.tsx";

const CollectionPage = lazy(() =>
  import("./$collectionId.page.tsx").then((module) => ({ default: module.CollectionPage })),
);

export const collectionRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/collections/$collectionId",
  component: CollectionPage,
});
