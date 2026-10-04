"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DataState } from "@/components/data-state";
import { EntryList } from "@/components/entry-list";
import { SquareField } from "@/components/square-field";
import { useSquares } from "@/features/squares/squares-context";
import { formatDay, isValidDateKey } from "@/lib/date";
import { entriesForDay } from "@/lib/statistics";
import { squareWord } from "@/lib/words";

export default function HistoryDayPage() {
  const { date } = useParams<{ date: string }>();
  const { entries } = useSquares();
  const valid = isValidDateKey(date);
  const dayEntries = valid ? entriesForDay(entries, date) : [];

  return (
    <DataState>
      <Link href="/history" className="back-link"><ArrowLeft size={18} /> Вся история</Link>
      {valid ? <>
        <div className="page-eyebrow">ДЕНЬ В ИСТОРИИ</div>
        <h1 className="page-title">{formatDay(date)}</h1>
        <p className="page-subtitle">{formatDay(date, { weekday: "long" })}, {date.slice(0, 4)} г.</p>
        <section className="day-summary">
          <div className="count-line"><strong>{dayEntries.length}</strong><span>{squareWord(dayEntries.length)} за день</span></div>
          <SquareField count={dayEntries.length} />
        </section>
        <div className="section-heading"><h2>Действия</h2><span>{dayEntries.length}</span></div>
        {dayEntries.length ? <EntryList entries={dayEntries} /> : <div className="empty-state"><h3>В этот день нет квадратов</h3><p>Возможно, они были удалены.</p></div>}
      </> : <div className="empty-state"><h3>Такой даты нет</h3><p>Вернись к истории и выбери день.</p></div>}
    </DataState>
  );
}
