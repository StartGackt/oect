"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { ComplaintItem } from "@/components/oect/complaintDomain";

const STORAGE_KEY = "oect-cases-v3";

export function useComplaintsStore(initialCases: ComplaintItem[]): [ComplaintItem[], Dispatch<SetStateAction<ComplaintItem[]>>] {
  const [cases, setCasesState] = useState<ComplaintItem[]>(initialCases);

  useEffect(() => {
    const loadStoredCases = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
        return;
      }

      try {
        const parsed = JSON.parse(stored) as ComplaintItem[];
        if (Array.isArray(parsed) && parsed.length > 0) setCasesState(parsed);
      } catch {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setCasesState(JSON.parse(event.newValue) as ComplaintItem[]);
      } catch {
        // Ignore malformed updates and retain the latest valid state.
      }
    };

    loadStoredCases();
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [initialCases]);

  const setCases = useCallback<Dispatch<SetStateAction<ComplaintItem[]>>>((update) => {
    setCasesState((currentCases) => {
      const nextCases = typeof update === "function" ? update(currentCases) : update;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCases));
      return nextCases;
    });
  }, []);

  return [cases, setCases];
}
