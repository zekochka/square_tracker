"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { SquareEntry } from "@/types/square";

export function EntryDialog({ entry, onClose, onSave }: {
  entry?: SquareEntry;
  onClose: () => void;
  onSave: (comment: string) => Promise<void>;
}) {
  const [comment, setComment] = useState(entry?.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(comment);
      setComment("");
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить квадрат.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="entry-dialog-title">
        <button type="button" className="icon-button dialog-close" onClick={onClose} aria-label="Закрыть"><X size={20} /></button>
        <div className="dialog-symbol" aria-hidden="true" />
        <h2 id="entry-dialog-title">{entry ? "Изменить комментарий" : "За что квадрат?"}</h2>
        <p className="dialog-description">{entry ? "Сам квадрат и время создания останутся прежними." : "Одно полезное действие — один чёрный квадрат."}</p>
        <form onSubmit={submit}>
          <label htmlFor="square-comment" className="field-label">Комментарий <span>необязательно</span></label>
          <textarea id="square-comment" value={comment} onChange={(event) => setComment(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            } }}
            placeholder="Например, сделал лабораторную" maxLength={500} rows={3} autoFocus />
          <div className="field-hint">{comment.length}/500 · Enter — сохранить, Shift + Enter — новая строка</div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button full-width" disabled={saving}>
            {saving ? "Сохраняем…" : entry ? "Сохранить изменения" : "Добавить квадрат"}
          </button>
        </form>
      </section>
    </div>
  );
}
