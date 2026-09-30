"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyRevenue } from "@/lib/data";
import { formatPrice } from "@/components/ui/price";

export function RevenueSparkline({ days }: { days: DailyRevenue[] }) {
  const chartData = days.map((d) => ({
    date: new Date(`${d.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
    revenue: d.revenueCents / 100,
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--color-muted)" }}
          />
          <YAxis hide domain={[0, "dataMax + 200"]} />
          <Tooltip
            formatter={(v) => [formatPrice(Math.round(Number(v) * 100)), "Revenue"]}
            contentStyle={{
              border: "1px solid var(--color-line)",
              borderRadius: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              background: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-caramel)"
            strokeWidth={2}
            fill="var(--color-caramel)"
            fillOpacity={0.12}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
