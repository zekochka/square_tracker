"use client";

import { useEffect, useState } from "react";
import { localDateKey } from "@/lib/date";

export function useTodayKey(): string | null {
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTodayKey(localDateKey(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    const onVisible = () => { if (document.visibilityState === "visible") update(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return todayKey;
}
