import { useSyncExternalStore } from "react";
import { getActiveCollectionId, getAttempts } from "../lib/local-db.ts";

const EVENT = "foruntendo-db-change";

function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function useAttempts() {
  return useSyncExternalStore(subscribe, getAttempts, getAttempts);
}

export function useActiveCollectionId() {
  return useSyncExternalStore(subscribe, getActiveCollectionId, getActiveCollectionId);
}

export function useDatabaseSnapshot() {
  const attempts = useAttempts();
  const activeCollectionId = useActiveCollectionId();
  return { attempts, activeCollectionId };
}
