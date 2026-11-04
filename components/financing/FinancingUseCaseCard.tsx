"use client";

import { useState } from "react";

export const FUNDING_USE_CASES = [
  { code: "UC01", label: "Purchasing stock, inventory or equipment" },
  { code: "UC02", label: "Marketing" },
  { code: "UC03", label: "Hiring staff" },
  { code: "UC04", label: "Operational expenses" },
  { code: "UC05", label: "Expansion" },
  { code: "UC06", label: "Renovation or unexpected repairs" },
  { code: "UC07", label: "Growth and cash flow support" },
] as const;

type FundingCode = (typeof FUNDING_USE_CASES)[number]["code"];

type Props = {
  initialValues?: string[];
  onChange?: (codes: FundingCode[]) => void;
  disabled?: boolean;
};

export function FinancingUseCaseCard({ initialValues = [], onChange, disabled = false }: Props) {
  const [selected, setSelected] = useState<FundingCode[]>(() =>
    FUNDING_USE_CASES.map((item) => item.code).filter((code) => initialValues.includes(code))
  );

  function toggle(code: FundingCode) {
    const next = selected.includes(code) ? selected.filter((value) => value !== code) : [...selected, code];
    setSelected(next);
    onChange?.(next);
  }

  return (
    <section aria-labelledby="funding-purpose-title" className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 id="funding-purpose-title" className="text-xl font-semibold text-slate-900">
        What will you use the financing for?
      </h2>
      <p className="mt-1 text-sm text-slate-600">Select all that apply. Selection does not establish lender eligibility.</p>
      <fieldset disabled={disabled} className="mt-4 grid gap-3 md:grid-cols-2">
        <legend className="sr-only">Funding purposes</legend>
        {FUNDING_USE_CASES.map(({ code, label }) => (
          <label key={code} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm text-slate-800">
            <input type="checkbox" name="funding_purposes" value={code} checked={selected.includes(code)}
              onChange={() => toggle(code)} className="mt-0.5 h-4 w-4 accent-blue-700" />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <p aria-live="polite" className="mt-3 text-xs text-slate-500">{selected.length} selected</p>
    </section>
  );
}
