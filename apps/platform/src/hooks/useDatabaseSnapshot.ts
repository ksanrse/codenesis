import { useEffect, useState } from "react";
import { getActiveCollectionId, getAttempts } from "../lib/local-db.ts";

export function useDatabaseSnapshot() {
  const [snapshot, setSnapshot] = useState(() => ({
    activeCollectionId: getActiveCollectionId(),
    attempts: getAttempts(),
  }));

  useEffect(() => {
    const refresh = () => {
      setSnapshot({
        activeCollectionId: getActiveCollectionId(),
        attempts: getAttempts(),
      });
    };

    window.addEventListener("foruntendo-db-change", refresh);
    return () => window.removeEventListener("foruntendo-db-change", refresh);
  }, []);

  return snapshot;
}
