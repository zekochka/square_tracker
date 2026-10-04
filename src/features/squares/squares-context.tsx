"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { squareRepository } from "@/repositories/square-repository";
import { sortNewest } from "@/lib/statistics";
import type { SquareEntry } from "@/types/square";

type SquaresContextValue = {
  entries: SquareEntry[];
  ready: boolean;
  error: string | null;
  add: (comment: string) => Promise<SquareEntry>;
  update: (id: string, comment: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  retry: () => Promise<void>;
};

const SquaresContext = createContext<SquaresContextValue | null>(null);

export function SquaresProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<SquareEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retry = useCallback(async () => {
    try {
      setEntries(await squareRepository.list());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось загрузить данные.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void squareRepository.list().then((saved) => {
      if (active) {
        setEntries(saved);
        setError(null);
      }
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : "Не удалось загрузить данные.");
    }).finally(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, [retry]);

  const add = useCallback(async (comment: string) => {
    const entry = await squareRepository.add(comment);
    setEntries((current) => sortNewest([entry, ...current]));
    setError(null);
    return entry;
  }, []);

  const update = useCallback(async (id: string, comment: string) => {
    const entry = await squareRepository.update(id, comment);
    setEntries((current) => current.map((item) => item.id === id ? entry : item));
    setError(null);
  }, []);

  const remove = useCallback(async (id: string) => {
    await squareRepository.remove(id);
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setError(null);
  }, []);

  const value = useMemo(() => ({ entries, ready, error, add, update, remove, retry }),
    [entries, ready, error, add, update, remove, retry]);

  return <SquaresContext.Provider value={value}>{children}</SquaresContext.Provider>;
}

export function useSquares() {
  const context = useContext(SquaresContext);
  if (!context) throw new Error("useSquares must be used inside SquaresProvider");
  return context;
}
