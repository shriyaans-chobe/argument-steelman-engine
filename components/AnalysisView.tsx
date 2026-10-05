"use client";

import type { Analysis } from "@/types/steelman";
import FallacyList from "./FallacyList";

function toText(a: Analysis) {
  return [
    `Claim: ${a.claim}`,
    `Type: ${a.claimType}`,
    `Interpretation: ${a.interpretation}`,
    ...a.stages.map(
      (s) =>
        `\nStage ${s.stage} (${s.title}) — ${s.score.total}/12\n` +
        `${s.argument}\n` +
        `Weaknesses: ${s.weaknesses.join("; ")}\n` +
        `Objections: ${s.anticipatedObjections.join("; ")}\n` +
        `Improvements: ${s.improvements.join("; ")}\n` +
        `Fallacies: ${
          s.fallacies.map((f) => f.name).join(", ") || "none detected"
        }`,
    ),
  ].join("\n");
}

const labels = ["BASELINE", "STRENGTHENED", "STEELMAN"];

function ScoreBar({
  score,
  dark = false,
}: {
  score: number;
  dark?: boolean;
}) {
  return (
    <div
      className="mt-3 h-1.5 overflow-hidden rounded-full"
      style={{
        background: dark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.09)",
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${(score / 12) * 100}%`,
          background: dark ? "#fff" : "var(--accent)",
        }}
      />
    </div>
  );
}

function Note({
  label,
  children,
  number,
}: {
  label: string;
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <div className="relative border-l-2 pl-4" style={{ borderColor: "var(--accent)" }}>
      {number && (
        <span
          className="ui absolute -left-[17px] top-0 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          {number}
        </span>
      )}

      <p
        className="ui text-[10px] font-bold tracking-[0.18em]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>

      <div className="mt-2 text-sm leading-6">{children}</div>
    </div>
  );
}

export default function AnalysisView({
  a,
  onRegenerate,
  onReset,
}: {
  a: Analysis;
  onRegenerate: () => void;
  onReset: () => void;
}) {
  const scores = a.stages.map((s) => s.score.total);
  const best = Math.max(...scores);
  const gain = scores[scores.length - 1] - scores[0];

  return (
    <article className="mt-16 overflow-hidden">

      {/* =========================================================
          INTRO / EDITORIAL HEADER
      ========================================================= */}

      <header
        className="relative border-y py-12"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="absolute right-0 top-0 select-none text-[8rem] font-black leading-none opacity-[0.035]">
          01
        </div>

        <div className="ui flex items-center gap-3 text-[10px] font-bold tracking-[0.22em]">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          ARGUMENT ANALYSIS
        </div>

        <div className="mt-6 max-w-5xl">
          <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.045em] md:text-7xl">
            Watch an argument
            <br />
            <span style={{ color: "var(--accent)" }}>become stronger.</span>
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <p
            className="max-w-xl text-base leading-7"
            style={{ color: "var(--muted)" }}
          >
            The engine doesn't simply produce a stronger conclusion. It
            challenges the original reasoning, exposes weaknesses, and rebuilds
            the argument through successive stages.
          </p>

          <div className="ui text-right">
            <p
              className="text-[10px] font-bold tracking-[0.18em]"
              style={{ color: "var(--muted)" }}
            >
              ANALYSIS
            </p>
            <p className="mt-1 text-3xl font-black">01</p>
          </div>
        </div>
      </header>

      {/* =========================================================
          CLAIM BOARD
      ========================================================= */}

      <section className="relative py-12">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="ui text-[10px] font-bold tracking-[0.2em]">
              THE CLAIM
            </p>
            <p
              className="mt-1 ui text-xs"
              style={{ color: "var(--muted)" }}
            >
              What we're investigating
            </p>
          </div>

          <span
            className="ui border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--rule)" }}
          >
            {a.claimType.replace("_", " ")}
          </span>
        </div>

        <div
          className="relative overflow-hidden rounded-sm border bg-[#faf9f5] p-8 md:p-12"
          style={{
            borderColor: "var(--rule)",
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="absolute right-5 top-4 rotate-3 text-[10px] font-semibold opacity-30">
            ORIGINAL
          </div>

          <div className="max-w-4xl">
            <p className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              “{a.claim}”
            </p>
          </div>

          <div className="mt-10 grid gap-8 border-t pt-7 md:grid-cols-[140px_1fr]" style={{ borderColor: "var(--rule)" }}>
            <p className="ui text-[10px] font-bold tracking-[0.18em]">
              INTERPRETATION
            </p>

            <p className="max-w-3xl text-sm leading-7">
              {a.interpretation}
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p
            className="ui mb-3 text-[10px] font-bold tracking-[0.18em]"
            style={{ color: "var(--muted)" }}
          >
            INITIAL LOGICAL CHECK
          </p>
          <FallacyList fallacies={a.originalAnalysis.fallacies} />
        </div>
      </section>

      {/* =========================================================
          ARGUMENT TRAJECTORY
      ========================================================= */}

      <section className="py-10">

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="ui text-[10px] font-bold tracking-[0.2em]">
              THE TRAJECTORY
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">
              Argument strength
            </h3>
          </div>

          <div className="text-right">
            <span
              className="ui text-[10px] font-bold tracking-[0.15em]"
              style={{ color: "var(--muted)" }}
            >
              NET IMPROVEMENT
            </span>
            <p className="mt-1 text-3xl font-black">
              {gain >= 0 ? "+" : ""}
              {gain}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-10">

          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px md:block"
            style={{ background: "var(--rule)" }}
          />

          <div className="grid gap-8 md:grid-cols-3">
            {a.stages.map((s, index) => {
              const strongest = s.score.total === best;
              const dark = index === 2;

              return (
                <div key={s.stage} className="relative">
                  <div className="mb-5 flex items-center gap-4">
                    <div
                      className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border text-xs font-black"
                      style={{
                        borderColor: dark
                          ? "var(--accent)"
                          : "var(--ink)",
                        background: dark ? "var(--accent)" : "white",
                        color: dark ? "white" : "var(--ink)",
                      }}
                    >
                      0{index + 1}
                    </div>

                    <div>
                      <p
                        className="ui text-[10px] font-bold tracking-[0.16em]"
                        style={{ color: "var(--muted)" }}
                      >
                        STAGE {index + 1}
                      </p>
                      <h4 className="font-bold">
                        {labels[index] ?? s.title}
                      </h4>
                    </div>
                  </div>

                  <div
                    className="rounded-sm border p-6"
                    style={{
                      borderColor: strongest
                        ? "var(--accent)"
                        : "var(--rule)",
                      background: dark ? "var(--ink)" : "white",
                      color: dark ? "white" : "var(--ink)",
                    }}
                  >
                    {strongest && (
                      <div
                        className="ui mb-5 inline-block px-2 py-1 text-[9px] font-bold tracking-wider text-white"
                        style={{ background: "var(--accent)" }}
                      >
                        STRONGEST VERSION
                      </div>
                    )}

                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black">
                        {s.score.total}
                      </span>
                      <span className="ui mb-2 text-xs opacity-50">
                        / 12
                      </span>
                    </div>

                    <ScoreBar score={s.score.total} dark={dark} />

                    <div className="mt-7 grid grid-cols-3 gap-3 border-t pt-5" style={{ borderColor: dark ? "rgba(255,255,255,.15)" : "var(--rule)" }}>
                      <div>
                        <p className="ui text-[9px] opacity-50">RIGOR</p>
                        <p className="mt-1 text-xl font-bold">
                          {s.score.logicalRigor.score}
                        </p>
                      </div>

                      <div>
                        <p className="ui text-[9px] opacity-50">RELEVANCE</p>
                        <p className="mt-1 text-xl font-bold">
                          {s.score.relevance.score}
                        </p>
                      </div>

                      <div>
                        <p className="ui text-[9px] opacity-50">RESIST.</p>
                        <p className="mt-1 text-xl font-bold">
                          {s.score.resistanceToRebuttal.score}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          STAGES — ARGUMENT / COUNTERARGUMENT / IMPROVEMENT
      ========================================================= */}

      <section className="py-12">

        <div className="mb-10">
          <p className="ui text-[10px] font-bold tracking-[0.2em]">
            THE WORKING BOARD
          </p>

          <h3 className="mt-2 text-4xl font-black tracking-tight">
            How the argument evolved
          </h3>

          <p
            className="mt-3 max-w-2xl text-sm leading-6"
            style={{ color: "var(--muted)" }}
          >
            Each stage preserves the original position while responding to the
            strongest pressure against it.
          </p>
        </div>

        <div className="space-y-16">
          {a.stages.map((s, index) => (
            <section key={s.stage} className="relative">

              {/* Stage heading */}
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="text-6xl font-black leading-none"
                    style={{ color: "var(--rule)" }}
                  >
                    0{index + 1}
                  </span>

                  <div>
                    <p className="ui text-[10px] font-bold tracking-[0.2em]">
                      {labels[index]}
                    </p>
                    <h4 className="mt-1 text-2xl font-bold">
                      {s.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className="ui text-[9px] font-bold tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    SCORE
                  </p>
                  <p className="text-3xl font-black">
                    {s.score.total}
                    <span className="text-sm opacity-40">/12</span>
                  </p>
                </div>
              </div>

              {/* Argument */}
              <div
                className="relative rounded-sm border bg-[#faf9f5] p-7 md:p-9"
                style={{
                  borderColor: "var(--rule)",
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.025) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="absolute right-5 top-5 text-[9px] font-bold tracking-widest opacity-25">
                  ARGUMENT / {String(index + 1).padStart(2, "0")}
                </div>

                <p
                  className="ui text-[10px] font-bold tracking-[0.18em]"
                  style={{ color: "var(--muted)" }}
                >
                  THE ARGUMENT
                </p>

                <p className="mt-5 max-w-4xl text-xl font-semibold leading-8 md:text-2xl">
                  {s.argument}
                </p>
              </div>

              {/* Investigation */}
              <div className="relative mt-6 ml-4 border-l pl-7 md:ml-10 md:pl-10" style={{ borderColor: "var(--rule)" }}>

                <div className="space-y-7">

                  <Note label="WEAKNESS" number="W">
                    <ul className="space-y-2">
                      {s.weaknesses.map((x, i) => (
                        <li key={i}>→ {x}</li>
                      ))}
                    </ul>
                  </Note>

                  <Note label="COUNTERARGUMENT" number="C">
                    <ul className="space-y-2">
                      {s.anticipatedObjections.map((x, i) => (
                        <li key={i}>→ {x}</li>
                      ))}
                    </ul>
                  </Note>

                  <Note label="IMPROVEMENT" number="I">
                    <ul className="space-y-2">
                      {s.improvements.map((x, i) => (
                        <li key={i}>→ {x}</li>
                      ))}
                    </ul>
                  </Note>

                </div>
              </div>

              {/* Divider between stages */}
              {index < a.stages.length - 1 && (
                <div className="mt-14 flex items-center gap-4">
                  <div
                    className="h-px flex-1"
                    style={{ background: "var(--rule)" }}
                  />
                  <span
                    className="ui text-[9px] font-bold tracking-[0.2em]"
                    style={{ color: "var(--muted)" }}
                  >
                    ARGUMENT REVISED
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: "var(--rule)" }}
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </section>

      {/* =========================================================
          LOGICAL CHECK
      ========================================================= */}

      <section
        className="border-y py-10"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="ui text-[10px] font-bold tracking-[0.2em]">
              LOGICAL CHECK
            </p>
            <h3 className="mt-2 text-3xl font-black">
              Fallacy scan
            </h3>
          </div>

          <p
            className="max-w-md text-right text-xs leading-5"
            style={{ color: "var(--muted)" }}
          >
            Fallacy detection is separate from argument scoring. A clean scan
            does not prove that an argument is true.
          </p>
        </div>

        <div className="mt-8 divide-y" style={{ borderColor: "var(--rule)" }}>
          {a.stages.map((s, index) => (
            <div
              key={s.stage}
              className="flex items-center justify-between gap-5 py-5"
            >
              <div className="flex items-center gap-4">
                <span className="ui text-xs font-bold opacity-40">
                  0{index + 1}
                </span>
                <span className="font-semibold">
                  {labels[index]}
                </span>
              </div>

              <span
                className="ui text-xs font-semibold"
                style={{
                  color:
                    s.fallacies.length === 0
                      ? "var(--muted)"
                      : "var(--accent)",
                }}
              >
                {s.fallacies.length === 0
                  ? "NO FALLACIES DETECTED"
                  : `${s.fallacies.length} DETECTED`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FOOTER ACTIONS
      ========================================================= */}

      <section className="flex flex-wrap items-center justify-between gap-5 py-10">

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-sm px-5 py-3 text-sm font-bold text-white transition hover:opacity-85"
            style={{ background: "var(--accent)" }}
            onClick={() => navigator.clipboard.writeText(toText(a))}
          >
            Copy analysis
          </button>

          <button
            className="rounded-sm border px-5 py-3 text-sm font-semibold transition hover:bg-black/5"
            style={{ borderColor: "var(--ink)" }}
            onClick={onRegenerate}
          >
            Regenerate
          </button>

          <button
            className="px-4 py-3 text-sm font-semibold underline"
            onClick={onReset}
          >
            New claim
          </button>
        </div>

        <div className="max-w-md text-right">
          <p className="ui text-[9px] font-bold tracking-[0.15em]">
            ANALYTICAL AID / NOT AUTHORITY
          </p>

          <p
            className="mt-2 text-xs leading-5"
            style={{ color: "var(--muted)" }}
          >
            AI-generated analysis can be wrong. Fallacy labels are probabilistic
            and evidence claims should be independently verified.
          </p>
        </div>
      </section>
    </article>
  );
}