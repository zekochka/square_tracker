export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function shiftDateKey(key: string, days: number): string {
  const date = dateFromKey(key);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

export function formatDay(key: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("ru-RU", options ?? { day: "numeric", month: "long" }).format(dateFromKey(key));
}

export function formatShortDay(key: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(dateFromKey(key));
}

export function displayTime(time: string): string {
  return time.slice(0, 5);
}

export function isValidDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  return localDateKey(dateFromKey(key)) === key;
}
