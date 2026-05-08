import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { routeTree } from "./__root.tsx";

const SettingsPage = lazy(() =>
  import("./settings.page.tsx").then((module) => ({ default: module.SettingsPage })),
);

export const settingsRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/settings",
  component: SettingsPage,
});
