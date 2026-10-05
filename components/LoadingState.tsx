"use client";
import { useEffect, useState } from "react";
const STEPS = ["Interpreting claim","Analyzing fallacies","Building baseline","Identifying weaknesses","Strengthening argument","Testing against objections","Generating steelman","Final fallacy check"];
export default function LoadingState() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="ui mt-10 border-l-2 pl-5" style={{ borderColor: "var(--rule)" }} role="status">
      {STEPS.map((s, n) => (
        <p key={s} className="py-0.5 text-sm" style={{ color: n === i ? "var(--accent)" : n < i ? "var(--ink)" : "var(--muted)", fontWeight: n === i ? 600 : 400 }}>
          {n < i ? "✓ " : n === i ? "… " : "  "}{s}
        </p>
      ))}
      <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>Progress display only; the analysis runs as one request and can take up to a minute.</p>
    </div>
  );
}
