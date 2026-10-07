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
            axisLine={{ stroke: "var(--border)", strokeWidth: 2 }}
            tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, fill: "var(--muted-foreground)" }}
          />
          <YAxis hide domain={[0, "dataMax + 200"]} />
          <Tooltip
            formatter={(v) => [formatPrice(Math.round(Number(v) * 100)), "Revenue"]}
            cursor={{ fill: "rgba(0,0,0,0.06)" }}
            contentStyle={{
              border: "2px solid var(--border)",
              borderRadius: 8,
              boxShadow: "var(--shadow)",
              background: "var(--secondary-background)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--main)"
            strokeWidth={3}
            fill="var(--blue)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
