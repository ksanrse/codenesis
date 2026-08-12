import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/600.css";
import { mount } from "svelte";
import App from "./App.svelte";
import "./styles/globals.css";

const target = document.getElementById("root");

if (!target) {
  throw new Error("Корневой элемент #root не найден");
}

mount(App, { target });
