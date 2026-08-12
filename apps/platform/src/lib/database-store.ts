import { readable } from "svelte/store";
import { getAttempts, type ChallengeAttempt } from "./local-db.ts";

export const attempts = readable<ChallengeAttempt[]>(getAttempts(), (set) => {
  if (typeof window === "undefined") return () => undefined;
  const refresh = () => set(getAttempts());
  window.addEventListener("codenesis-db-change", refresh);
  return () => window.removeEventListener("codenesis-db-change", refresh);
});
