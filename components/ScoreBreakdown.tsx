import type { Stage } from "@/types/steelman";
export default function ScoreBreakdown({ score }: { score: Stage["score"] }) {
  const rows = [["Logical rigor", score.logicalRigor], ["Relevance", score.relevance], ["Rebuttal resistance", score.resistanceToRebuttal]] as const;
  return (
    <div className="ui text-sm">
      {rows.map(([label, d]) => (
        <div key={label} className="py-1">
          <div className="flex justify-between"><span>{label}</span><span className="tabular-nums">{d.score} / 4</span></div>
          <div className="h-1" style={{ background: "var(--rule)" }}><div className="h-1" style={{ width: `${d.score * 25}%`, background: "var(--accent)" }} /></div>
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>{d.reason}</p>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t pt-2 font-semibold" style={{ borderColor: "var(--ink)" }}><span>Total</span><span className="tabular-nums">{score.total} / 12</span></div>
    </div>
  );
}
