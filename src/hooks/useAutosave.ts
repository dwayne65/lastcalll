import { useEffect, useRef, useState } from "react";

interface AutosaveData {
  [key: string]: unknown;
}

export function useAutosave(
  data: AutosaveData,
  intervalMs = 30000,
  storageKey = "content-editor-autosave"
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(dataRef.current));
        localStorage.setItem(`${storageKey}-time`, new Date().toISOString());
        setLastSaved(new Date());
      } catch {
        // Storage full or unavailable
      }
    };

    timeoutRef.current = setInterval(save, intervalMs);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [intervalMs, storageKey]);

  const loadSaved = (): AutosaveData | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const time = localStorage.getItem(`${storageKey}-time`);
        if (time) setLastSaved(new Date(time));
        return JSON.parse(raw);
      }
    } catch {}
    return null;
  };

  const clearSaved = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}-time`);
    setLastSaved(null);
  };

  return { lastSaved, loadSaved, clearSaved };
}
