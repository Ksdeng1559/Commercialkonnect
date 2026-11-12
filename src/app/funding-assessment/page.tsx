"use client";

import { useMemo, useState } from "react";

type Assessment = {
  company: string;
  province: string;
  industry: string;
  project: string;
  budget: string;
  employees: string;
  timeline: string;
  innovation: boolean;
};

const initial: Assessment = {
  company: "", province: "British Columbia", industry: "Manufacturing",
  project: "", budget: "250000", employees: "10", timeline: "3–6 months", innovation: false,
};

export default function FundingAssessmentPage() {
  const [form, setForm] = useState<Assessment>(initial);
  const [reviewed, setReviewed] = useState(false);
  const set = (key: keyof Assessment, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setReviewed(false);
  };
  const assessment = useMemo(() => {
    const budget = Number(form.budget);
    const employees = Number(form.employees);
    const missing = [
      ...(!form.company.trim() ? ["Registered business name"] : []),
      ...(!form.project.trim() ? ["Project scope and expected productivity benefit"] : []),
      ...(!Number.isFinite(budget) || budget <= 0 ? ["Valid project budget"] : []),
      ...(!Number.isInteger(employees) || employees < 0 ? ["Valid employee count"] : []),
    ];
    return { missing, budget, employees };
  }, [form]);
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wider">CommercialKonnect · Funding Advisory</p>
        <h1 className="text-3xl font-bold">AI Modernization Funding Readiness</h1>
        <p className="text-sm text-gray-600">Internal demonstration only. This form does not submit or store information. It does not establish grant eligibility or program availability.</p>
      </header>
      <form className="grid gap-5 rounded-xl border p-6" onSubmit={(e) => { e.preventDefault(); setReviewed(true); }}>
        <label className="grid gap-1">Business legal name<input className="rounded border p-2" value={form.company} onChange={(e) => set("company", e.target.value)} /></label>
        <label className="grid gap-1">Province<select className="rounded border p-2" value={form.province} onChange={(e) => set("province", e.target.value)}>{["British Columbia","Alberta","Ontario","Other"].map((p) => <option key={p}>{p}</option>)}</select></label>
        <label className="grid gap-1">Industry<select className="rounded border p-2" value={form.industry} onChange={(e) => set("industry", e.target.value)}>{["Manufacturing","Wholesale / Distribution","Construction","Professional Services","Other"].map((p) => <option key={p}>{p}</option>)}</select></label>
        <label className="grid gap-1">AI adoption or automation project<textarea className="rounded border p-2" rows={4} value={form.project} onChange={(e) => set("project", e.target.value)} placeholder="Describe technology, expected productivity improvements and implementation activities" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">Estimated project budget (CAD)<input type="number" min="1" className="rounded border p-2" value={form.budget} onChange={(e) => set("budget", e.target.value)} /></label>
          <label className="grid gap-1">Number of employees<input type="number" min="0" className="rounded border p-2" value={form.employees} onChange={(e) => set("employees", e.target.value)} /></label>
        </div>
        <label className="grid gap-1">Implementation timeline<select className="rounded border p-2" value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>{["Immediately","0–3 months","3–6 months","6–12 months","12+ months"].map((p) => <option key={p}>{p}</option>)}</select></label>
        <label className="flex items-start gap-3"><input type="checkbox" checked={form.innovation} onChange={(e) => set("innovation", e.target.checked)} />Project includes new technical development or experimental innovation (not merely purchasing existing software)</label>
        <button type="submit" className="rounded bg-slate-900 px-5 py-3 font-semibold text-white">Generate preliminary screening</button>
      </form>
      {reviewed && <section aria-live="polite" className="space-y-4 rounded-xl border p-6">
        <h2 className="text-xl font-bold">Preliminary screening result</h2>
        {assessment.missing.length > 0 ? <p>Incomplete intake: {assessment.missing.join("; ")}. Complete these items before referring to the grant writer.</p> : <>
          <p><strong>Case:</strong> {form.company} · {form.industry} · {form.province}</p>
          <p><strong>Budget:</strong> {assessment.budget.toLocaleString("en-CA", {style:"currency",currency:"CAD",maximumFractionDigits:0})} · <strong>Employees:</strong> {assessment.employees} · <strong>Timeline:</strong> {form.timeline}</p>
          <p><strong>Disposition:</strong> Ready for professional eligibility screening — not grant-qualified.</p>
          <p><strong>Review pathways:</strong> Government AI adoption programs (confirm open intake and eligible expenses), repayable government contributions, BDC or equipment financing{form.innovation ? ", and innovation-focused programs where genuine technical uncertainty can be documented" : ""}.</p>
          <p><strong>Grant-writer checklist:</strong> Confirm applicant entity, financial statements, detailed eligible-cost budget, supplier quotes, productivity baseline, project dates, matching funds, program rules and restrictions on stacking assistance.</p>
          <button type="button" className="rounded border px-4 py-2" onClick={() => { const text = [
            "CommercialKonnect — preliminary funding assessment",
            "Business: " + form.company, "Province: " + form.province, "Industry: " + form.industry,
            "Project: " + form.project, "Budget CAD: " + form.budget,
            "Employees: " + form.employees, "Timeline: " + form.timeline,
            "Experimental innovation: " + (form.innovation ? "Yes" : "No"),
            "Status: Awaiting grant-writer eligibility verification; no funding guarantee."
          ].join("\n"); void navigator.clipboard?.writeText(text); }}>Copy referral briefing</button>
        </>}
      </section>}
    </main>
  );
}
