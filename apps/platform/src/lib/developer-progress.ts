import { writable } from "svelte/store";

export const developerSkillProgress = writable<Record<string, number>>({});

if (typeof window !== "undefined") {
  window.addEventListener("codenesis-dev-progress-change", (event) => {
    const detail = (event as CustomEvent<{ skillProgress?: Record<string, number> }>).detail;
    developerSkillProgress.set(detail?.skillProgress ?? {});
  });
}
