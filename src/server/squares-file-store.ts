import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { isValidDateKey } from "@/lib/date";
import { sortNewest } from "@/lib/statistics";
import type { SquareEntry } from "@/types/square";

const dataDirectory = join(process.cwd(), "data");
const filePath = join(dataDirectory, "squares.json");
let pendingWrite: Promise<unknown> = Promise.resolve();

function isSquareEntry(value: unknown): value is SquareEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<SquareEntry>;
  return typeof entry.id === "string" && typeof entry.comment === "string" &&
    typeof entry.dateKey === "string" && isValidDateKey(entry.dateKey) &&
    typeof entry.time === "string" && /^\d{2}:\d{2}:\d{2}$/.test(entry.time) &&
    typeof entry.createdAt === "string" && !Number.isNaN(Date.parse(entry.createdAt));
}

async function readEntries(): Promise<SquareEntry[]> {
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw cause;
  }
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isSquareEntry)) {
    throw new Error("Некорректный файл с квадратами.");
  }
  return sortNewest(parsed);
}

async function writeEntries(entries: SquareEntry[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, JSON.stringify(entries, null, 2) + "\n", "utf8");
    await rename(temporaryPath, filePath);
  } catch (cause) {
    await unlink(temporaryPath).catch(() => undefined);
    throw cause;
  }
}

function serialize<T>(work: () => Promise<T>): Promise<T> {
  const result = pendingWrite.then(work, work);
  pendingWrite = result.then(() => undefined, () => undefined);
  return result;
}

function localDateAndTime(now: Date, timezoneOffsetMinutes: number) {
  const local = new Date(now.getTime() - timezoneOffsetMinutes * 60_000);
  const dateKey = `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`;
  const time = [local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds()]
    .map((part) => String(part).padStart(2, "0")).join(":");
  return { dateKey, time };
}

export async function listSquares(): Promise<SquareEntry[]> {
  await pendingWrite;
  return readEntries();
}

export function addSquare(comment: string, timezoneOffsetMinutes: number): Promise<SquareEntry> {
  return serialize(async () => {
    const now = new Date();
    const entry: SquareEntry = {
      id: randomUUID(),
      comment: comment.trim(),
      ...localDateAndTime(now, timezoneOffsetMinutes),
      createdAt: now.toISOString(),
    };
    const entries = await readEntries();
    await writeEntries(sortNewest([entry, ...entries]));
    return entry;
  });
}

export function updateSquare(id: string, comment: string): Promise<SquareEntry | null> {
  return serialize(async () => {
    const entries = await readEntries();
    const entry = entries.find((item) => item.id === id);
    if (!entry) return null;
    const updated = { ...entry, comment: comment.trim() };
    await writeEntries(entries.map((item) => item.id === id ? updated : item));
    return updated;
  });
}

export function removeSquare(id: string): Promise<boolean> {
  return serialize(async () => {
    const entries = await readEntries();
    if (!entries.some((item) => item.id === id)) return false;
    await writeEntries(entries.filter((item) => item.id !== id));
    return true;
  });
}
