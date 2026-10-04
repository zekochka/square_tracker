import type { SquareEntry } from "@/types/square";

export interface SquareRepository {
  list(): Promise<SquareEntry[]>;
  add(comment: string): Promise<SquareEntry>;
  update(id: string, comment: string): Promise<SquareEntry>;
  remove(id: string): Promise<void>;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" }).catch(() => {
    throw new Error("Нет связи с локальным сервером.");
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message = body && typeof body === "object" && "error" in body &&
      typeof body.error === "string" ? body.error : "Не удалось сохранить данные.";
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export class FileSquareRepository implements SquareRepository {
  list(): Promise<SquareEntry[]> {
    return request<SquareEntry[]>("/api/squares");
  }

  add(comment: string): Promise<SquareEntry> {
    return request<SquareEntry>("/api/squares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment, timezoneOffsetMinutes: new Date().getTimezoneOffset() }),
    });
  }

  update(id: string, comment: string): Promise<SquareEntry> {
    return request<SquareEntry>(`/api/squares/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
  }

  remove(id: string): Promise<void> {
    return request<void>(`/api/squares/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

export const squareRepository: SquareRepository = new FileSquareRepository();
