"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DataState } from "@/components/data-state";
import { SquareField } from "@/components/square-field";
import { useSquares } from "@/features/squares/squares-context";
import { formatDay } from "@/lib/date";
import { groupEntriesByDay } from "@/lib/statistics";
import { squareWord } from "@/lib/words";

const PAGE_SIZE = 14;

export default function HistoryPage() {
  const { entries } = useSquares();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const days = useMemo(() => [...groupEntriesByDay(entries)], [entries]);

  return (
    <DataState>
      <div className="page-eyebrow">ВСЕ ДНИ</div>
      <h1 className="page-title">История</h1>
      <p className="page-subtitle">Все полезные дела остаются здесь.</p>

      {days.length ? <>
        <div className="section-heading history-heading"><h2>По дням</h2><span>{days.length}</span></div>
        <div className="history-list">
          {days.slice(0, visible).map(([dateKey, dayEntries]) => (
            <Link href={`/history/${dateKey}`} className="history-card" key={dateKey}>
              <div className="history-card-top">
                <div><span className="history-date">{formatDay(dateKey)}</span><span className="history-weekday">{formatDay(dateKey, { weekday: "long" })}</span></div>
                <ArrowUpRight size={20} className="history-arrow" aria-hidden="true" />
              </div>
              <SquareField count={dayEntries.length} small />
              <div className="history-card-count"><strong>{dayEntries.length}</strong> {squareWord(dayEntries.length)}</div>
            </Link>
          ))}
        </div>
        {visible < days.length && <button className="secondary-button load-more" onClick={() => setVisible((value) => value + PAGE_SIZE)}>Показать ещё</button>}
      </> : <div className="empty-state history-empty"><span className="empty-state-mark" aria-hidden="true">□</span><h3>История пока пуста</h3><p>Первый квадрат появится здесь после добавления.</p><Link href="/" className="text-button">Перейти к сегодняшнему дню</Link></div>}
    </DataState>
  );
}
