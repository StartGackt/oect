"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { ComplaintItem } from "@/components/oect/complaintDomain";

const STORAGE_KEY = "oect-cases-v3";

let globalCases: ComplaintItem[] | null = null;
const listeners = new Set<Dispatch<SetStateAction<ComplaintItem[]>>>();

export function useComplaintsStore(initialCases: ComplaintItem[]): [ComplaintItem[], Dispatch<SetStateAction<ComplaintItem[]>>] {
  const [cases, setCasesState] = useState<ComplaintItem[]>(globalCases || initialCases);

  useEffect(() => {
    listeners.add(setCasesState);

    if (globalCases === null) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
        globalCases = initialCases;
      } else {
        try {
          const parsed = JSON.parse(stored) as ComplaintItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            globalCases = parsed;
          } else {
            globalCases = initialCases;
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
          }
        } catch {
          globalCases = initialCases;
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
        }
      }
      setCasesState(globalCases);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as ComplaintItem[];
        globalCases = parsed;
        listeners.forEach((listener) => listener(parsed));
      } catch {
        // Ignore malformed updates and retain the latest valid state.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(setCasesState);
      window.removeEventListener("storage", handleStorage);
    };
  }, [initialCases]);

  const setCases = useCallback<Dispatch<SetStateAction<ComplaintItem[]>>>((update) => {
    const nextCases = typeof update === "function" ? update(globalCases || initialCases) : update;
    globalCases = nextCases;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCases));
    listeners.forEach((listener) => listener(nextCases));
  }, [initialCases]);

  return [cases, setCases];
}
