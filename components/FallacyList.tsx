import type { Fallacy } from "@/types/steelman";
export default function FallacyList({ fallacies }: { fallacies: Fallacy[] }) {
  if (!fallacies.length)
    return <p className="ui text-sm" style={{ color: "var(--muted)" }}>✓ No clear named fallacies detected (this does not prove the argument is sound).</p>;
  return (
    <div className="space-y-2">
      {fallacies.map((f, i) => (
        <details key={i} className="border px-3 py-2" style={{ borderColor: "var(--rule)" }}>
          <summary className="ui cursor-pointer text-sm font-semibold">
            {f.name} <span className="font-normal" style={{ color: f.severity === "major" ? "var(--warn)" : "var(--muted)" }}>· {f.severity} · {Math.round(f.confidence * 100)}% confidence</span>
          </summary>
          <div className="mt-2 space-y-1 text-sm">
            <p><em>“{f.excerpt}”</em></p>
            <p>{f.explanation}</p>
            <p><strong>Why it matters:</strong> {f.whyItMatters}</p>
            <p><strong>Repair:</strong> {f.suggestedRepair}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
