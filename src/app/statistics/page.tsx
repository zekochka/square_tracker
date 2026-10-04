"use client";

import { useMemo, useState } from "react";
import { DataState } from "@/components/data-state";
import { StatsChart } from "@/components/stats-chart";
import { useSquares } from "@/features/squares/squares-context";
import { useTodayKey } from "@/features/squares/use-today-key";
import { formatDay, isValidDateKey, shiftDateKey } from "@/lib/date";
import { dailyCounts, summarizeDays } from "@/lib/statistics";

type Period = "week" | "month" | "custom";

export default function StatisticsPage() {
  const { entries } = useSquares();
  const todayKey = useTodayKey();
  const [period, setPeriod] = useState<Period>("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const to = period === "custom" ? customTo || todayKey || "" : todayKey || "";
  const from = period === "custom" ? customFrom || (todayKey ? shiftDateKey(todayKey, -6) : "") :
    todayKey ? shiftDateKey(todayKey, period === "week" ? -6 : -29) : "";
  const validRange = isValidDateKey(from) && isValidDateKey(to) && from <= to;
  const days = useMemo(() => validRange ? dailyCounts(entries, from, to) : [], [entries, from, to, validRange]);
  const summary = useMemo(() => summarizeDays(days), [days]);

  return (
    <DataState>
      <div className="page-eyebrow">В ЦИФРАХ</div>
      <h1 className="page-title">Статистика</h1>
      <p className="page-subtitle">Каждый квадрат — маленький шаг вперёд.</p>

      <section className="stats-section">
        <div className="period-tabs" role="group" aria-label="Период статистики">
          {([["week", "Неделя"], ["month", "Месяц"], ["custom", "Свой период"]] as const).map(([value, label]) => (
            <button key={value} className={period === value ? "period-tab selected" : "period-tab"}
              onClick={() => setPeriod(value)} aria-pressed={period === value}>{label}</button>
          ))}
        </div>

        {period === "custom" && <div className="date-range">
          <label>Дата от<input type="date" value={customFrom || (todayKey ? shiftDateKey(todayKey, -6) : "")}
            max={customTo || undefined} onChange={(event) => setCustomFrom(event.target.value)} /></label>
          <label>Дата до<input type="date" value={customTo || todayKey || ""}
            min={customFrom || undefined} onChange={(event) => setCustomTo(event.target.value)} /></label>
        </div>}
        {!validRange && <p className="form-error" role="alert">Дата начала должна быть раньше даты окончания.</p>}

        {validRange && <>
          <div className="stats-range-label">{formatDay(from)} — {formatDay(to, { day: "numeric", month: "long", year: "numeric" })}</div>
          <div className="stats-cards">
            <div className="stats-card"><span>Всего квадратов</span><strong>{summary.total}</strong></div>
            <div className="stats-card"><span>Среднее за день</span><strong>{summary.average.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}</strong></div>
            <div className="stats-card"><span>Лучший день</span><strong>{summary.best}</strong></div>
          </div>
          <div className="chart-card">
            <div className="chart-heading"><h2>Квадраты по дням</h2><span>за выбранный период</span></div>
            <StatsChart days={days} />
            {period !== "week" && <p className="chart-hint">Листай график в сторону, чтобы увидеть все дни →</p>}
          </div>
        </>}
      </section>
    </DataState>
  );
}
