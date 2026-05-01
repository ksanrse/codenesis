import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routes/__root.tsx";
import { challengesRoute } from "./routes/challenges/index.tsx";
import { challengeDetailRoute } from "./routes/challenges/$challengeId.tsx";
import { collectionRoute } from "./routes/collections/$collectionId.tsx";
import { collectionsRoute } from "./routes/collections/index.tsx";
import { indexRoute } from "./routes/index.tsx";
import { profileRankRoute } from "./routes/profile.rank.tsx";
import { profileRoute } from "./routes/profile.tsx";
import { settingsRoute } from "./routes/settings.tsx";

const hashHistory = createHashHistory();

const routeTreeWithChildren = routeTree.addChildren([
  indexRoute,
  challengesRoute,
  challengeDetailRoute,
  collectionsRoute,
  collectionRoute,
  profileRoute,
  profileRankRoute,
  settingsRoute,
]);

const router = createRouter({
  routeTree: routeTreeWithChildren,
  history: hashHistory,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return <RouterProvider router={router} />;
}
