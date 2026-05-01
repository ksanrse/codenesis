import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "../components/layout/Navbar.tsx";

export const routeTree = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
