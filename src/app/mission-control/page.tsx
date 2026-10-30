"use client";

import { useRef, useState } from "react";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  ArrowDownToLine,
  ArrowRight,
  Building2,
  Check,
  CircleDot,
  FileText,
  Globe,
  Layers,
  LoaderCircle,
  Search,
  Sparkles,
  Upload,
  Waypoints,
} from "lucide-react";
import {
  demoCompanies,
  formats,
  parseImport,
  reviewOpportunity,
  stages,
  type Company,
  type ContentFormat,
  type Dossier,
  type Stage,
} from "@/lib/mission-control";

type Tab =
  | "Research desk"
  | "Opportunity board"
  | "Content studio"
  | "Connections";
type Opportunity = {
  stage: Stage;
  interestConfirmed: boolean;
  note: string;
  website: string;
  phone: string;
  enrichmentSource: string;
};
type Draft = {
  id: string;
  content: string;
  format: ContentFormat;
  createdAt: string;
  model: string;
  companyId: string;
};
type Enrichment = {
  summary: string;
  emails: string[];
  phones: string[];
  signals: string[];
  observedAt: string;
};
type Connection = {
  enrichment: boolean;
  leadSniper: boolean;
  research: boolean;
  content: boolean;
};
const tabs: Tab[] = [
  "Research desk",
  "Opportunity board",
  "Content studio",
  "Connections",
];
const blank: Opportunity = {
  stage: "Research",
  interestConfirmed: false,
  note: "",
  website: "",
  phone: "",
  enrichmentSource: "",
};
const input =
  "w-full rounded-xl border border-slate-700 bg-[#0b1726] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-400";
const button =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-slate-700 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";
const gold =
  button + " bg-amber-300 text-slate-950 border-amber-300 hover:bg-amber-200";
function download(name: string, content: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function call<T>(
  action: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const r = await fetch(
    `/api/mission-control${body ? "" : `?action=${encodeURIComponent(action)}`}`,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...body }),
        }
      : { cache: "no-store" },
  );
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Request failed.");
  return data as T;
}
export default function MissionControl() {
  const [tab, setTab] = useState<Tab>("Research desk");
  const [companies, setCompanies] = useState<Company[]>(demoCompanies);
  const [selectedId, setSelectedId] = useState(demoCompanies[0].id);
  const [search, setSearch] = useState("");
  const [enrichments, setEnrichments] = useState<Record<string, Enrichment>>(
    {},
  );
  const [dossiers, setDossiers] = useState<Record<string, Dossier>>({});
  const [reviewed, setReviewed] = useState<Record<string, string[]>>({});
  const [opportunities, setOpportunities] = useState<
    Record<string, Opportunity>
  >({});
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [format, setFormat] = useState<ContentFormat>("Social post");
  const [industry, setIndustry] = useState("BC business owners");
  const [region, setRegion] = useState("British Columbia");
  const [topic, setTopic] = useState(
    "Planning working capital for business growth",
  );
  const [attested, setAttested] = useState(false);
  const [connections, setConnections] = useState<Connection | null>(null);
  const [contentReviewed, setContentReviewed] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const selected = companies.find((c) => c.id === selectedId);
  const dossier = selected ? dossiers[selected.id] : undefined;
  const checked = selected ? (reviewed[selected.id] ?? []) : [];
  const opportunity = selected ? (opportunities[selected.id] ?? blank) : blank;
  const visible = companies.filter((c) =>
    `${c.name} ${c.city} ${c.industry}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const evidence =
    dossier?.evidence.filter((e) => checked.includes(e.id)) ?? [];
  const latest = drafts[0];
  const hasAuth = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const update = (patch: Partial<Opportunity>) => {
    if (selected)
      setOpportunities((o) => ({
        ...o,
        [selected.id]: { ...(o[selected.id] ?? blank), ...patch },
      }));
  };
  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setError("");
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setBusy("");
    }
  }
  function mergeCompanies(rows: Company[]) {
    if (!rows.length) throw new Error("No businesses were returned.");
    setCompanies((current) => {
      const merged = new Map(
        current
          .filter((company) => !company.demo)
          .map((company) => [company.id, company]),
      );
      rows.forEach((company) => merged.set(company.id, company));
      return [...merged.values()];
    });
    setSelectedId(rows[0].id);
    setContentReviewed(false);
  }
  async function importFile(f: File) {
    await run("Importing", async () => {
      if (!attested)
        throw new Error(
          "Confirm this is a real, permitted LeadSniper export first.",
        );
      if (f.size > 2_000_000)
        throw new Error("Import a file smaller than 2 MB.");
      const rows = parseImport(await f.text(), f.name);
      mergeCompanies(rows);
      setMessage(
        `Imported ${rows.length} business records. All need research and verification.`,
      );
    });
  }
  async function research() {
    if (!selected) return;
    await run("Researching", async () => {
      const result = await call<Dossier>("research", { company: selected });
      setDossiers((d) => ({ ...d, [selected.id]: result }));
      setReviewed((r) => ({ ...r, [selected.id]: [] }));
      setOpportunities((o) => ({
        ...o,
        [selected.id]: { ...(o[selected.id] ?? blank), stage: "Research" },
      }));
      setContentReviewed(false);
      setMessage(
        result.evidence.length
          ? `Found ${result.evidence.length} references. Check company identity and dates before selecting them.`
          : "No research sources returned. Nothing has been verified.",
      );
    });
  }
  function move(stage: Stage) {
    const reason = reviewOpportunity(
      stage,
      checked.length,
      opportunity.interestConfirmed,
    );
    if (reason) {
      setError(reason);
      return;
    }
    if (stage === "Opportunity" && !opportunity.note.trim()) {
      setError(
        "Record the owner conversation and financing interest in the opportunity note.",
      );
      return;
    }
    update({ stage });
    setMessage(
      `Moved to ${stage}. Workspace changes stay in this browser tab until exported.`,
    );
    setError("");
  }
  async function generate() {
    if (!selected) return;
    await run("Generating", async () => {
      const result = await call<Omit<Draft, "companyId">>("generate", {
        format,
        industry,
        region,
        topic,
        evidence,
        reviewed: contentReviewed,
      });
      setDrafts((d) => [{ ...result, companyId: selected.id }, ...d]);
      setMessage(
        "Draft generated. Review claims, sources and wording before publication.",
      );
    });
  }
  function exportWorkspace() {
    download(
      "commercialkonnect-mission-control.json",
      JSON.stringify(
        {
          version: 1,
          exportedAt: new Date().toISOString(),
          companies,
          dossiers,
          enrichments,
          reviewed,
          opportunities,
          drafts,
        },
        null,
        2,
      ),
    );
  }
  return (
    <main className="min-h-screen bg-[#091320] text-slate-100 lg:flex">
      <aside className="lg:w-64 shrink-0 border-b lg:border-r border-slate-800 bg-[#0d1a2a] p-6 lg:min-h-screen flex flex-col">
        <a href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="rounded-lg bg-amber-300 p-1.5 text-slate-950">
            <Waypoints size={20} />
          </span>
          CommercialKonnect
        </a>
        <p className="mt-2 text-[10px] uppercase tracking-[.24em] text-slate-500">
          Intelligence to opportunity
        </p>
        <nav
          aria-label="Mission Control"
          className="flex lg:flex-col gap-2 mt-8 overflow-x-auto"
        >
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError("");
              }}
              className={`flex items-center gap-3 text-left whitespace-nowrap rounded-xl px-4 py-3 text-sm ${tab === t ? "bg-amber-300/10 text-amber-200" : "text-slate-400 hover:bg-slate-800"}`}
            >
              <span className="text-xs opacity-60">0{i + 1}</span>
              {t}
            </button>
          ))}
        </nav>
        <div className="lg:mt-auto pt-8 space-y-4">
          <div className="rounded-xl border border-slate-700 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Source system
            </p>
            <p className="mt-2 text-sm font-medium">LeadSniper 3.0</p>
            <p className="mt-1 text-xs text-slate-400">
              GMB business research pool
            </p>
          </div>
          <a
            href="/client-brain"
            className="block text-xs text-slate-400 hover:text-amber-200"
          >
            Open Client Brain →
          </a>
          {hasAuth ? (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className={button}>Sign in to connect</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <UserButton />
                  <OrganizationSwitcher hidePersonal />
                </div>
              </SignedIn>
            </>
          ) : (
            <p className="text-xs text-slate-500">
              Provider actions need configured workspace sign-in.
            </p>
          )}
        </div>
      </aside>
      <section className="min-w-0 flex-1 p-5 md:p-9 xl:p-11">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[.2em] text-amber-200">
              <CircleDot size={12} /> CommercialKonnect.ca
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">
              Mission Control
            </h1>
            <p className="text-slate-400 mt-3 text-sm">
              Draw from your business database. Find the signal. Build the
              opportunity.
            </p>
          </div>
          <button onClick={exportWorkspace} className={button}>
            <ArrowDownToLine size={16} />
            Export workspace
          </button>
        </header>
        <div className="mt-7 rounded-xl border border-amber-700/40 bg-amber-400/5 px-4 py-3 text-xs text-amber-100/80">
          {companies.some((c) => c.demo)
            ? "Illustrative businesses · live research is disabled for sample records. "
            : "Imported business records · identity, source rights, and financing interest need review. "}
          Workspace changes remain in memory; export before closing. Content is
          saved as drafts only.
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          {[
            {
              label: "Business research pool",
              value: companies.length,
              sub: companies.some((c) => c.demo)
                ? "Illustrative records"
                : "Imported from LeadSniper",
              icon: Building2,
            },
            {
              label: "Researched businesses",
              value: Object.keys(dossiers).length,
              sub: "Source references collected",
              icon: Search,
            },
            {
              label: "Owner-confirmed opportunities",
              value: Object.values(opportunities).filter(
                (o) => o.stage === "Opportunity",
              ).length,
              sub: "Reviewed interest, not approvals",
              icon: Layers,
            },
            {
              label: "Content drafts",
              value: drafts.length,
              sub: "Ready for editorial review",
              icon: FileText,
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-[#112237] border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex justify-between gap-3">
                <span className="text-xs text-slate-400">{m.label}</span>
                <m.icon size={17} className="text-amber-200" />
              </div>
              <p className="text-3xl font-semibold mt-3">{m.value}</p>
              <p className="text-[11px] text-slate-500 mt-2">{m.sub}</p>
            </div>
          ))}
        </div>
        {(error || message || busy) && (
          <div
            role={error ? "alert" : "status"}
            aria-live="polite"
            className={`mt-5 rounded-xl p-4 text-sm border ${error ? "border-red-800 bg-red-950/30 text-red-200" : "border-slate-700 bg-slate-800/60 text-slate-200"}`}
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                {busy}…
              </span>
            ) : (
              error || message
            )}
          </div>
        )}
        {tab === "Connections" ? (
          <section className="mt-7 rounded-2xl border border-slate-700 bg-[#112237] p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                One hub. Three connected functions.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                CommercialKonnect owns the workspace. LeadSniper supplies
                businesses. Research providers supply evidence. OmniRoute
                supplies text models.
              </p>
            </div>
            {[
              [
                "LeadSniper 3.0",
                "GMB-derived business database. CSV/JSON imports work now; a permitted, organization-scoped feed can be configured server-side.",
                connections?.leadSniper,
              ],
              [
                "LeadSniper enrichment",
                "Reuses LeadSniper’s comprehensive company/contact enrichment endpoint when configured for your workspace.",
                connections?.enrichment,
              ],
              [
                "Research & enrichment",
                "Tavily search supplies dated source references. Verify business details and record the supporting source in the research desk.",
                connections?.research,
              ],
              [
                "OmniRoute",
                "Generates CommercialKonnect drafts from your reviewed references. Provider credentials stay on the server.",
                connections?.content,
              ],
            ].map(([title, desc, configured]) => (
              <div
                key={String(title)}
                className="border-t border-slate-700 pt-5 flex flex-wrap justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="max-w-2xl text-sm text-slate-400 mt-2">
                    {desc}
                  </p>
                </div>
                <span className="text-xs text-amber-200">
                  {connections
                    ? configured
                      ? "Configured · not health-tested"
                      : "Not configured"
                    : "Not checked"}
                </span>
              </div>
            ))}
            <button
              disabled={!!busy}
              className={gold}
              onClick={() =>
                run("Checking configuration", async () => {
                  setConnections(await call<Connection>("status"));
                  setMessage(
                    "Configuration checked. This does not verify provider availability.",
                  );
                })
              }
            >
              Check configuration
            </button>
            <p className="text-xs text-slate-500">
              No live WordPress, Astro, Chatwoot or Atomic CRM publishing is
              configured in this first slice. Export reviewed drafts for your
              existing production workflow.
            </p>
          </section>
        ) : (
          <div className="mt-7 grid xl:grid-cols-[minmax(260px,330px)_1fr] gap-5">
            <section className="bg-[#112237] border border-slate-800 rounded-2xl p-5 self-start">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Business pool</h2>
                <span className="text-xs text-slate-500">
                  {visible.length} records
                </span>
              </div>
              <label className="block mt-4">
                <span className="sr-only">Search businesses</span>
                <input
                  className={input}
                  placeholder="Search company, city, industry"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto">
                {visible.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      setContentReviewed(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left border ${c.id === selectedId ? "border-amber-300/60 bg-amber-300/5" : "border-slate-800 hover:border-slate-600"}`}
                  >
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {c.city} · {c.industry}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider mt-2 text-amber-200/80">
                      {c.demo
                        ? "Illustrative"
                        : (opportunities[c.id]?.stage ?? "Research")}
                    </p>
                  </button>
                ))}
                {!visible.length && (
                  <p className="text-sm text-slate-500 py-5">
                    No matching businesses.
                  </p>
                )}
              </div>
              <div className="border-t border-slate-700 mt-5 pt-4 space-y-3">
                <label className="flex items-start gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={attested}
                    onChange={(e) => setAttested(e.target.checked)}
                    className="mt-0.5 accent-amber-300"
                  />
                  I’m importing real records that I’m permitted to use for this
                  research.
                </label>
                <input
                  ref={file}
                  type="file"
                  accept=".csv,.json"
                  className="hidden"
                  aria-label="LeadSniper business export"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) void importFile(f);
                  }}
                />
                <button
                  className={button + " w-full"}
                  disabled={!!busy || !attested}
                  onClick={() => file.current?.click()}
                >
                  <Upload size={15} />
                  Import LeadSniper export
                </button>
                <button
                  className={button + " w-full"}
                  disabled={!!busy}
                  onClick={() =>
                    run("Loading LeadSniper", async () => {
                      const r = await call<{ companies: Company[] }>(
                        "companies",
                      );
                      mergeCompanies(r.companies);
                      setMessage(
                        "Loaded the configured LeadSniper feed. Records still need review.",
                      );
                    })
                  }
                >
                  Load connected feed
                </button>
                <p className="text-[11px] text-slate-500">
                  CSV from LeadSniper’s Export button, or an array of business
                  records in JSON. Up to 1,000 records / 2 MB.
                </p>
              </div>
            </section>
            <div className="min-w-0 space-y-5">
              {tab === "Research desk" && selected && (
                <>
                  <section className="rounded-2xl bg-[#112237] border border-slate-800 p-6">
                    <div className="flex justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-xs text-amber-200 uppercase tracking-widest">
                          Company intelligence
                        </p>
                        <h2 className="text-2xl font-semibold mt-2">
                          {selected.name}
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                          {selected.industry} · {selected.city}
                        </p>
                      </div>
                      <button
                        disabled={!!busy || selected.demo}
                        onClick={research}
                        className={gold}
                      >
                        <Search size={16} />
                        Research business
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">
                          Imported website · unverified
                        </p>
                        {selected.website ? (
                          <a
                            href={selected.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-amber-100 break-all"
                          >
                            {selected.website} ↗
                          </a>
                        ) : (
                          <p className="mt-2 text-slate-400">Not supplied</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">
                          Imported business phone · unverified
                        </p>
                        <p className="mt-2">
                          {selected.phone || "Not supplied"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-5">
                      Financing need:{" "}
                      {opportunity.interestConfirmed
                        ? "Owner interest recorded by operator"
                        : "Unknown"}
                      . A directory listing or growth signal does not confirm
                      borrowing intent.
                    </p>
                  </section>
                  <section className="rounded-2xl bg-[#112237] border border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Evidence review</h2>
                      <span className="text-xs text-amber-200">
                        {checked.length} reviewed
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Check identity, publication date, and relevance. Selecting
                      a source records your review, not independent
                      verification.
                    </p>
                    {!dossier ? (
                      <div className="text-center py-10">
                        <Globe className="mx-auto text-slate-600" size={28} />
                        <p className="mt-3 text-sm text-slate-400">
                          Research a business to collect its source references.
                        </p>
                      </div>
                    ) : dossier.evidence.length === 0 ? (
                      <p className="py-8 text-sm text-slate-400">
                        No sources returned.
                      </p>
                    ) : (
                      <div className="mt-5 space-y-3">
                        {dossier.evidence.map((e) => (
                          <article
                            key={e.id}
                            className="p-4 border border-slate-700 rounded-xl"
                          >
                            <label className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={checked.includes(e.id)}
                                onChange={(event) => {
                                  setReviewed((r) => ({
                                    ...r,
                                    [selected.id]: event.target.checked
                                      ? [...(r[selected.id] ?? []), e.id]
                                      : (r[selected.id] ?? []).filter(
                                          (id) => id !== e.id,
                                        ),
                                  }));
                                  setContentReviewed(false);
                                  if (!event.target.checked)
                                    update({ stage: "Review" });
                                }}
                                className="mt-1 accent-amber-300"
                              />
                              <span className="min-w-0">
                                <span className="block text-sm font-medium">
                                  {e.title}
                                </span>
                                <span className="block mt-2 text-xs text-slate-400 leading-6">
                                  {e.snippet}
                                </span>
                              </span>
                            </label>
                            <a
                              href={e.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-amber-200 mt-3 block break-all"
                            >
                              {e.url} ↗
                            </a>
                            <p className="text-[10px] text-slate-500 mt-2">
                              Observed {new Date(e.observedAt).toLocaleString()}{" "}
                              · publisher date requires review
                            </p>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                  <section className="rounded-2xl bg-[#112237] border border-slate-800 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">
                      Enrichment & next action
                    </h2>
                    <button
                      className={button}
                      disabled={!!busy || selected.demo}
                      onClick={() =>
                        run("Enriching through LeadSniper", async () => {
                          const result = await call<Enrichment>("enrich", {
                            company: selected,
                          });
                          setEnrichments((r) => ({
                            ...r,
                            [selected.id]: result,
                          }));
                          setMessage(
                            "LeadSniper enrichment returned. Treat contacts and growth signals as candidates until independently reviewed.",
                          );
                        })
                      }
                    >
                      <Sparkles size={15} />
                      Enrich through LeadSniper
                    </button>
                    {enrichments[selected.id] && (
                      <div className="p-4 rounded-xl border border-slate-700 text-sm space-y-3">
                        <p className="text-xs text-amber-200">
                          Provider-supplied candidates · unverified
                        </p>
                        <p className="text-slate-300">
                          {enrichments[selected.id].summary ||
                            "No company summary returned."}
                        </p>
                        <p className="text-xs text-slate-400">
                          Business email candidates:{" "}
                          {enrichments[selected.id].emails.join(", ") ||
                            "None returned"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Phone candidates:{" "}
                          {enrichments[selected.id].phones.join(", ") ||
                            "None returned"}
                        </p>
                        {enrichments[selected.id].signals.map((signal, i) => (
                          <p key={i} className="text-xs text-slate-400">
                            Possible signal: {signal}
                          </p>
                        ))}
                        <p className="text-[11px] text-slate-500">
                          These enrichment claims are not eligible content
                          references until you independently research and review
                          their sources.
                        </p>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="text-xs text-slate-400">
                        Reviewed company website
                        <input
                          className={input + " mt-2"}
                          value={opportunity.website}
                          onChange={(e) => update({ website: e.target.value })}
                          placeholder="https://…"
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Reviewed business phone
                        <input
                          className={input + " mt-2"}
                          value={opportunity.phone}
                          onChange={(e) => update({ phone: e.target.value })}
                        />
                      </label>
                    </div>
                    <label className="block text-xs text-slate-400">
                      Supporting source URL
                      <input
                        className={input + " mt-2"}
                        value={opportunity.enrichmentSource}
                        onChange={(e) =>
                          update({ enrichmentSource: e.target.value })
                        }
                        placeholder="Company-owned contact page or other primary source"
                      />
                    </label>
                    <p className="text-xs text-slate-500">
                      Operator-entered enrichment remains unverified. Keep
                      supporting sources with your export.
                    </p>
                    <label className="block text-xs text-slate-400">
                      Opportunity hypothesis / owner conversation note
                      <textarea
                        className={input + " mt-2 min-h-24"}
                        value={opportunity.note}
                        onChange={(e) => update({ note: e.target.value })}
                        placeholder="Observed trigger, possible use of funds, and next question to confirm…"
                      />
                    </label>
                    <label className="flex gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={opportunity.interestConfirmed}
                        onChange={(e) =>
                          update({
                            interestConfirmed: e.target.checked,
                            ...(!e.target.checked
                              ? { stage: "Review" as Stage }
                              : {}),
                          })
                        }
                        className="accent-amber-300"
                      />
                      The owner or authorized representative expressed financing
                      interest; I recorded the conversation above.
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {stages.map((s) => (
                        <button
                          key={s}
                          className={opportunity.stage === s ? gold : button}
                          onClick={() => move(s)}
                          disabled={!!busy || selected.demo}
                        >
                          {s === opportunity.stage && <Check size={14} />} {s}
                        </button>
                      ))}
                    </div>
                    <button
                      className={button}
                      onClick={() => setTab("Content studio")}
                    >
                      Create content from reviewed research{" "}
                      <ArrowRight size={15} />
                    </button>
                  </section>
                </>
              )}
              {tab === "Opportunity board" && (
                <section className="rounded-2xl border border-slate-800 bg-[#112237] p-5">
                  <h2 className="text-xl font-semibold">
                    From business records to opportunities
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Operator review and confirmed interest determine stage. No
                    automated financing score.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {stages.map((stage) => (
                      <div
                        key={stage}
                        className="bg-[#0b1726] p-4 rounded-xl border border-slate-800"
                      >
                        <h3 className="text-sm text-amber-200">{stage}</h3>
                        <div className="mt-4 space-y-3">
                          {companies
                            .filter(
                              (c) =>
                                (opportunities[c.id]?.stage ?? "Research") ===
                                stage,
                            )
                            .map((c) => (
                              <button
                                key={c.id}
                                onClick={() => {
                                  setSelectedId(c.id);
                                  setTab("Research desk");
                                }}
                                className="w-full text-left rounded-lg bg-[#162b40] p-3"
                              >
                                <p className="text-sm">{c.name}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {c.city} {c.demo ? "· illustrative" : ""}
                                </p>
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {tab === "Content studio" && (
                <>
                  <section className="rounded-2xl border border-slate-800 bg-[#112237] p-6 space-y-5">
                    <div>
                      <p className="text-xs text-amber-200 uppercase tracking-wider">
                        CommercialKonnect content studio
                      </p>
                      <h2 className="text-2xl font-semibold mt-2">
                        Turn research into useful content.
                      </h2>
                      <p className="text-sm text-slate-400 mt-3">
                        Create educational content for the audience you want to
                        attract. Researched businesses remain internal
                        prospects.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="text-xs text-slate-400">
                        Format
                        <select
                          className={input + " mt-2"}
                          value={format}
                          onChange={(e) =>
                            setFormat(e.target.value as ContentFormat)
                          }
                        >
                          {formats.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs text-slate-400">
                        Audience
                        <input
                          className={input + " mt-2"}
                          maxLength={200}
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Region
                        <input
                          className={input + " mt-2"}
                          maxLength={200}
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Topic
                        <input
                          className={input + " mt-2"}
                          maxLength={300}
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="rounded-xl border border-slate-700 p-4 text-sm">
                      <p>
                        {evidence.length} reviewed source
                        {evidence.length === 1 ? "" : "s"} selected from{" "}
                        {selected?.name ?? "your research"}.
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Select references in the Research desk. Check any
                        product terms against current lender/program sources
                        before publication.
                      </p>
                    </div>
                    <label className="flex items-start gap-3 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        className="mt-1 accent-amber-300"
                        checked={contentReviewed}
                        onChange={(e) => setContentReviewed(e.target.checked)}
                      />
                      I reviewed these sources and will check the draft for
                      unsupported claims, personal details, and financing
                      accuracy before publishing.
                    </label>
                    <button
                      className={gold}
                      disabled={
                        !!busy ||
                        !evidence.length ||
                        !contentReviewed ||
                        selected?.demo ||
                        !topic.trim() ||
                        !industry.trim() ||
                        !region.trim()
                      }
                      onClick={generate}
                    >
                      <Sparkles size={16} />
                      Generate draft through OmniRoute
                    </button>
                  </section>
                  {latest && (
                    <section className="rounded-2xl border border-slate-700 bg-[#112237] p-6">
                      <div className="flex justify-between gap-3 items-start">
                        <div>
                          <h2 className="text-lg font-semibold">
                            Latest draft · {latest.format}
                          </h2>
                          <p className="text-xs text-slate-500 mt-2">
                            {latest.model} ·{" "}
                            {new Date(latest.createdAt).toLocaleString()} ·
                            unpublished
                          </p>
                        </div>
                        <button
                          className={button}
                          onClick={() =>
                            download(
                              "commercialkonnect-content-draft.md",
                              `<!-- DRAFT: human editorial review required. -->\n\n${latest.content}`,
                              "text/markdown",
                            )
                          }
                        >
                          <ArrowDownToLine size={15} />
                          Markdown
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-300 leading-7 mt-6">
                        {latest.content}
                      </pre>
                      <p className="mt-5 text-xs text-amber-200">
                        Review before using on WordPress, Astro, social channels
                        or in a PDF.
                      </p>
                    </section>
                  )}
                  {drafts.length > 1 && (
                    <section className="rounded-2xl border border-slate-800 p-5">
                      <h3 className="text-sm text-slate-400">Earlier drafts</h3>
                      <div className="mt-3 space-y-2">
                        {drafts.slice(1).map((d) => (
                          <button
                            key={d.id}
                            className={button + " w-full justify-between"}
                            onClick={() =>
                              download(
                                `commercialkonnect-${d.id}.md`,
                                d.content,
                                "text/markdown",
                              )
                            }
                          >
                            <span>
                              {d.format} ·{" "}
                              {new Date(d.createdAt).toLocaleString()}
                            </span>
                            <ArrowDownToLine size={14} />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <footer className="mt-8 text-[11px] text-slate-600 flex flex-wrap justify-between gap-3">
          <span>
            CommercialKonnect · Mission Control / LeadSniper 3.0 · Source
            database
          </span>
          <span>
            Research → Evidence review → Opportunity → Content → Lead
            acquisition
          </span>
        </footer>
      </section>
    </main>
  );
}
