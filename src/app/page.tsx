"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { DataState } from "@/components/data-state";
import { EntryDialog } from "@/components/entry-dialog";
import { EntryList } from "@/components/entry-list";
import { SquareField } from "@/components/square-field";
import { useSquares } from "@/features/squares/squares-context";
import { useTodayKey } from "@/features/squares/use-today-key";
import { formatDay } from "@/lib/date";
import { entriesForDay } from "@/lib/statistics";
import { squareWord } from "@/lib/words";

export default function TodayPage() {
  const { entries, add } = useSquares();
  const todayKey = useTodayKey();
  const [adding, setAdding] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const todayEntries = useMemo(() => todayKey ? entriesForDay(entries, todayKey) : [], [entries, todayKey]);
  const count = todayEntries.length;

  return (
    <DataState>
      {todayKey && <>
        <div className="page-eyebrow">СЕГОДНЯ · {formatDay(todayKey, { weekday: "long" }).toUpperCase()}</div>
        <h1 className="page-title">{formatDay(todayKey)}</h1>
        <p className="page-subtitle">Каждое полезное дело имеет значение.</p>

        <section className="today-card" aria-label="Результат за сегодня">
          <div className="today-card-top">
            <span className="section-kicker">МОЙ РЕЗУЛЬТАТ</span>
            <span className="today-card-date">{formatDay(todayKey, { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div className="count-line"><strong>{count}</strong><span>{squareWord(count)}</span></div>
          {count > 0 ? <SquareField count={count} animateLast={lastAddedId === todayEntries[0]?.id} /> :
            <div className="empty-squares" aria-hidden="true"><span /><span /><span /><span /><span /></div>}
          <div className="today-card-bottom">{count ? "Столько полезного уже сделано сегодня" : "Первый квадрат ждёт своего дела"}</div>
        </section>

        <section className="activity-section">
          <div className="section-heading"><h2>Действия за день</h2><span>{count}</span></div>
          {count ? <EntryList entries={todayEntries} /> : (
            <div className="empty-state">
              <span className="empty-state-mark" aria-hidden="true">□</span>
              <h3>Сегодня пока нет квадратов.</h3>
              <p>Сделал что-то полезное? Добавь первый.</p>
              <button className="text-button" onClick={() => setAdding(true)}>Добавить квадрат <Plus size={16} /></button>
            </div>
          )}
        </section>

        <button className="fab" type="button" onClick={() => setAdding(true)} aria-label="Добавить квадрат">
          <Plus size={28} strokeWidth={2.3} /><span>Добавить квадрат</span>
        </button>
        {adding && <EntryDialog onClose={() => setAdding(false)} onSave={async (comment) => {
          const entry = await add(comment);
          setLastAddedId(entry.id);
        }} />}
      </>}
    </DataState>
  );
}
