"use client";

import { useSquares } from "@/features/squares/squares-context";

export function DataState({ children }: { children: React.ReactNode }) {
  const { ready, error, retry } = useSquares();
  if (!ready) return <div className="state-card" role="status">Загружаем квадраты…</div>;
  if (error) return <div className="state-card" role="alert"><p>{error}</p><button className="text-button" onClick={() => void retry()}>Повторить</button></div>;
  return <>{children}</>;
}
