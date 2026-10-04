"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { displayTime } from "@/lib/date";
import { useSquares } from "@/features/squares/squares-context";
import type { SquareEntry } from "@/types/square";
import { EntryDialog } from "@/components/entry-dialog";

export function EntryList({ entries }: { entries: SquareEntry[] }) {
  const { update, remove } = useSquares();
  const [editing, setEditing] = useState<SquareEntry | null>(null);
  const [deleting, setDeleting] = useState<SquareEntry | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirmDelete() {
    if (!deleting || busy) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await remove(deleting.id);
      setDeleting(null);
    } catch (cause) {
      setDeleteError(cause instanceof Error ? cause.message : "Не удалось удалить квадрат.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="entry-list">
        {entries.map((entry) => (
          <article className="entry-row" key={entry.id}>
            <span className="entry-square" aria-hidden="true" />
            <div className="entry-content">
              <p className={entry.comment ? "entry-comment" : "entry-comment entry-comment-empty"}>
                {entry.comment || "Без комментария"}
              </p>
              <time className="entry-time" dateTime={entry.createdAt} title={`Создано в ${entry.time}`}>{displayTime(entry.time)}</time>
            </div>
            <div className="entry-actions">
              <button type="button" className="icon-button" onClick={() => setEditing(entry)} aria-label={`Изменить комментарий, ${entry.time}`}>
                <Pencil size={17} />
              </button>
              <button type="button" className="icon-button" onClick={() => { setDeleting(entry); setDeleteError(null); }} aria-label={`Удалить квадрат, ${entry.time}`}>
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing && <EntryDialog entry={editing} onClose={() => setEditing(null)}
        onSave={(comment) => update(editing.id, comment)} />}

      {deleting && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}>
          <section className="dialog-card confirm-dialog" role="alertdialog" aria-modal="true"
            aria-labelledby="delete-title" aria-describedby="delete-description">
            <button type="button" className="icon-button dialog-close" onClick={() => setDeleting(null)} aria-label="Закрыть"><X size={20} /></button>
            <h2 id="delete-title">Удалить квадрат?</h2>
            <p id="delete-description" className="dialog-description">Он исчезнет из этого дня и статистики. Отменить удаление нельзя.</p>
            {deleteError && <p className="form-error" role="alert">{deleteError}</p>}
            <div className="confirm-actions">
              <button type="button" className="secondary-button" onClick={() => setDeleting(null)}>Отмена</button>
              <button type="button" className="danger-button" onClick={confirmDelete} disabled={busy}>{busy ? "Удаляем…" : "Удалить"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
