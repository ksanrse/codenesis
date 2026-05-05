import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/600.css";
import "@fontsource/geist-mono/cyrillic-400.css";
import "@fontsource/geist-mono/cyrillic-500.css";
import "@fontsource/geist-mono/cyrillic-600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-mosaic-component/react-mosaic-component.css";
import { App } from "./App.tsx";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
