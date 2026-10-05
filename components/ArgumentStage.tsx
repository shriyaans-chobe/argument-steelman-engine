"use client";
import type { Stage } from "@/types/steelman";
import ScoreBreakdown from "./ScoreBreakdown";
import FallacyList from "./FallacyList";

const List = ({ title, items }: { title: string; items: string[] }) => (
  <section className="mt-5">
    <h4 className="ui text-sm font-semibold">{title}</h4>
    <ul className="mt-1 list-disc pl-5 text-[15px]">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
  </section>
);

export default function ArgumentStage({ s, defaultOpen }: { s: Stage; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="border-t py-5" style={{ borderColor: "var(--ink)" }}>
      <summary className="ui flex cursor-pointer items-baseline justify-between">
        <span className="text-lg font-semibold">Stage {s.stage}: {s.title}</span>
        <span className="tabular-nums text-lg">{s.score.total} / 12</span>
      </summary>
      <section className="mt-4">
        <div className="flex items-center justify-between">
          <h4 className="ui text-sm font-semibold">Argument</h4>
          <button className="ui text-xs underline" onClick={() => navigator.clipboard.writeText(s.argument)}>Copy</button>
        </div>
        <p className="mt-1 max-w-[70ch]">{s.argument}</p>
      </section>
      <List title={s.stage === 1 ? "What limits this draft?" : "What was weak in the previous stage?"} items={s.weaknesses} />
      <List title="What could the opposing side say?" items={s.anticipatedObjections} />
      <List title="How was it improved?" items={s.improvements} />
      {s.requiresExternalEvidence && <List title="Needs external evidence" items={s.evidenceRequirements} />}
      <section className="mt-5"><h4 className="ui mb-2 text-sm font-semibold">Logical fallacies ({s.fallacies.length} detected)</h4><FallacyList fallacies={s.fallacies} /></section>
      <section className="mt-5"><h4 className="ui mb-1 text-sm font-semibold">Score</h4><ScoreBreakdown score={s.score} /></section>
    </details>
  );
}
