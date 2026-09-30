import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  hintTone = "muted",
}: {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "muted" | "matcha" | "strawberry";
}) {
  const tones = { muted: "text-muted", matcha: "text-matcha", strawberry: "text-strawberry" };
  return (
    <Card className="p-5">
      <p className="font-mono text-[11px] tracking-wide uppercase text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className={`mt-1 font-mono text-[11px] ${tones[hintTone]}`}>{hint}</p>}
    </Card>
  );
}
