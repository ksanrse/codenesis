import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Navbar } from "../components/layout/Navbar.tsx";

export const routeTree = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<div className="container">Загрузка...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
