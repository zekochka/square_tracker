import { shiftDateKey } from "@/lib/date";
import type { SquareEntry } from "@/types/square";

export type DailyCount = { dateKey: string; count: number };

export function sortNewest(entries: SquareEntry[]): SquareEntry[] {
  return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function entriesForDay(entries: SquareEntry[], dateKey: string): SquareEntry[] {
  return sortNewest(entries.filter((entry) => entry.dateKey === dateKey));
}

export function groupEntriesByDay(entries: SquareEntry[]): Map<string, SquareEntry[]> {
  const groups = new Map<string, SquareEntry[]>();
  for (const entry of sortNewest(entries)) {
    const group = groups.get(entry.dateKey) ?? [];
    group.push(entry);
    groups.set(entry.dateKey, group);
  }
  return new Map([...groups].sort(([a], [b]) => b.localeCompare(a)));
}

export function dailyCounts(entries: SquareEntry[], from: string, to: string): DailyCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.dateKey, (counts.get(entry.dateKey) ?? 0) + 1);
  }

  const result: DailyCount[] = [];
  for (let day = from; day <= to; day = shiftDateKey(day, 1)) {
    result.push({ dateKey: day, count: counts.get(day) ?? 0 });
  }
  return result;
}

export function summarizeDays(days: DailyCount[]) {
  const total = days.reduce((sum, day) => sum + day.count, 0);
  return {
    total,
    average: days.length ? total / days.length : 0,
    best: days.reduce((max, day) => Math.max(max, day.count), 0),
  };
}
