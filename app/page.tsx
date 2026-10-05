"use client";

import { useState } from "react";
import { MAX_CLAIM_LENGTH } from "@/lib/schema";
import type { Analysis } from "@/types/steelman";
import AnalysisView from "@/components/AnalysisView";
import LoadingState from "@/components/LoadingState";
import ErrorMessage from "@/components/ErrorMessage";

const EXAMPLES = [
  "Remote work makes employees less productive.",
  "Free will is an illusion.",
  "AI will eliminate most programming jobs.",
  "Social media has made society less connected.",
  "College degrees are becoming obsolete.",
];

export default function Home() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Analysis | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const r = await fetch("/api/steelman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim }),
      });

      const j = await r.json();

      if (!j.success) throw new Error(j.error);

      setData(j.data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: "var(--accent)" }}
          >
            AS
          </div>

          <span className="ui text-sm font-semibold tracking-wide">
            ARGUMENT STEELMAN ENGINE
          </span>
        </div>

        <span
          className="ui hidden text-xs sm:block"
          style={{ color: "var(--muted)" }}
        >
          ANALYSIS • STRESS TEST • STEELMAN
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-14 text-center">
        <div
          className="ui mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: "var(--rule)",
            color: "var(--muted)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          ARGUMENT ANALYSIS ENGINE
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Strengthen an argument.
          <br />
          <span style={{ color: "var(--accent)" }}>
            See exactly how it improves.
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-7"
          style={{ color: "var(--muted)" }}
        >
          Enter a claim and watch it evolve through critique, refinement,
          stress-testing, and steelmanning — with every improvement made
          visible.
        </p>
      </section>

      {/* Input */}
      <section className="mx-auto max-w-4xl px-6">
        <div
          className="border bg-white p-5 shadow-sm sm:p-7"
          style={{ borderColor: "var(--rule)" }}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="claim"
              className="ui text-sm font-semibold"
            >
              Your claim or argument
            </label>

            <span
              className="ui text-xs"
              style={{ color: "var(--muted)" }}
            >
              {claim.length}/{MAX_CLAIM_LENGTH}
            </span>
          </div>

          <textarea
            id="claim"
            rows={5}
            value={claim}
            maxLength={MAX_CLAIM_LENGTH}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="e.g. Artificial intelligence will eliminate most programming jobs."
            className="mt-3 w-full resize-none border bg-transparent p-4 text-base outline-none transition focus:ring-2"
            style={{
              borderColor: "var(--rule)",
            }}
          />

          <div className="mt-4">
            <p
              className="ui mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Try an example
            </p>

            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  onClick={() => setClaim(example)}
                  className="border px-3 py-2 text-left text-xs transition hover:bg-black hover:text-white"
                  style={{ borderColor: "var(--rule)" }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading || !claim.trim()}
            onClick={run}
            className="ui mt-6 w-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            {loading ? "Analyzing argument…" : "STEELMAN ARGUMENT →"}
          </button>
        </div>
      </section>

      {/* Small explanation */}
      {!data && !loading && !error && (
        <section className="mx-auto grid max-w-4xl grid-cols-1 gap-px px-6 pb-16 pt-10 sm:grid-cols-3">
          {[
            ["01", "Analyze", "Understand the claim and identify weaknesses."],
            ["02", "Strengthen", "Build progressively stronger versions."],
            ["03", "Steelman", "Produce the strongest defensible argument."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="border p-5"
              style={{ borderColor: "var(--rule)" }}
            >
              <span
                className="ui text-xs font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {number}
              </span>

              <h2 className="mt-3 text-base font-semibold">
                {title}
              </h2>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Results */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        {error && <ErrorMessage message={error} />}

        {loading && <LoadingState />}

        {data && !loading && (
          <AnalysisView
            a={data}
            onRegenerate={run}
            onReset={() => {
              setData(null);
              setClaim("");
              setError(null);
            }}
          />
        )}
      </section>
    </main>
  );
}