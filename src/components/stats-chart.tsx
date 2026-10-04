"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDay, formatShortDay } from "@/lib/date";
import type { DailyCount } from "@/lib/statistics";

export function StatsChart({ days }: { days: DailyCount[] }) {
  const minWidth = days.length > 14 ? days.length * 23 : 0;
  const maximum = days.reduce((max, day) => Math.max(max, day.count), 1);

  return (
    <div className="chart-scroll" role="img" aria-label={`График количества квадратов по дням: ${days.map((day) => `${formatShortDay(day.dateKey)} — ${day.count}`).join(", ")}`}>
      <div className="chart-inner" style={{ minWidth: minWidth ? `${minWidth}px` : undefined }}>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={days} margin={{ top: 16, right: 8, left: -25, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#e9e9e6" strokeDasharray="3 5" />
            <XAxis dataKey="dateKey" tickFormatter={days.length <= 14 ? (key: string) => String(Number(key.slice(-2))) : formatShortDay} axisLine={false} tickLine={false}
              tick={{ fill: "#8e8e89", fontSize: 11 }} dy={10} interval={days.length > 14 ? 4 : 0} />
            <YAxis allowDecimals={false} domain={[0, maximum]} tickCount={Math.min(5, maximum + 1)}
              axisLine={false} tickLine={false} tick={{ fill: "#8e8e89", fontSize: 11 }} />
            <Tooltip cursor={{ fill: "#f3f3f1" }} content={({ active, payload, label }) => active && payload?.length ? (
              <div className="chart-tooltip"><strong>{formatDay(String(label))}</strong><span>{payload[0].value} квадратов</span></div>
            ) : null} />
            <Bar dataKey="count" fill="#1b1b1b" radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
