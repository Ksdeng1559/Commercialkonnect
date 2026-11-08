import Link from "next/link";
import { ArrowLeft, BadgeDollarSign, CircleDollarSign, FileCheck2, FileClock, Gauge, Globe2, RefreshCw, Target } from "lucide-react";
import { getRevenueSnapshot } from "@/lib/billr";

export const dynamic = "force-dynamic";
const money = (value: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
const percent = (value: number, goal: number) => Math.min(100, Math.round((value / goal) * 100));

function Progress({ value, goal }: { value: number; goal: number }) {
  const progress = percent(value, goal);
  return <div><div className="mb-2 flex justify-between text-xs text-slate-400"><span>{progress}% complete</span><span>{money(goal)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${progress}%` }} /></div></div>;
}

export default async function RevenuePage() {
  const data = await getRevenueSnapshot();
  const remaining = Math.max(0, data.sprint.cashGoal - data.collected);
  const websiteProgress = Math.min(100, Math.round((data.websitesSold / data.sprint.websiteGoal) * 100));
  const cards = [
    { label: "Cash collected", value: money(data.collected), icon: CircleDollarSign, accent: "text-emerald-300" },
    { label: "Outstanding", value: money(data.outstanding), icon: FileClock, accent: "text-amber-300" },
    { label: "Recurring revenue", value: money(data.mrr), icon: RefreshCw, accent: "text-cyan-300" },
    { label: "Websites sold", value: `${data.websitesSold} / ${data.sprint.websiteGoal}`, icon: Globe2, accent: "text-violet-300" },
  ];
  return <main className="min-h-screen bg-[#091523] px-5 py-8 text-slate-100 md:px-10 lg:px-14"><div className="mx-auto max-w-[1500px]">
    <header className="flex flex-wrap items-start justify-between gap-5"><div><Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300"><ArrowLeft size={16}/>Mission Control</Link><p className="text-sm uppercase tracking-[.22em] text-cyan-400">Klick2Client revenue sprint</p><h1 className="mt-2 text-3xl font-semibold md:text-4xl">60-day revenue command center</h1><p className="mt-3 text-slate-400">November 8, 2026–January 6, 2027 · C$20,000 cash + C$2,500 MRR</p></div><div className={`rounded-full border px-4 py-2 text-sm ${data.connected ? "border-emerald-700 text-emerald-300" : "border-amber-700 text-amber-300"}`}>● {data.connected ? "Billr connected" : "Billr setup required"}</div></header>
    <section className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <article key={card.label} className="rounded-2xl border border-slate-800 bg-[#112337] p-6"><card.icon className={card.accent} size={23}/><p className="mt-6 text-sm text-slate-400">{card.label}</p><p className="mt-2 text-3xl font-semibold">{card.value}</p></article>)}</section>
    <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
      <article className="rounded-2xl border border-slate-800 bg-[#112337] p-6 md:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-sm text-slate-400">Primary sprint target</p><h2 className="mt-1 text-2xl font-semibold">{money(data.collected)} collected</h2></div><Target className="text-cyan-400" size={28}/></div><div className="mt-7"><Progress value={data.collected} goal={data.sprint.cashGoal}/></div><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-slate-950/40 p-4"><p className="text-xs text-slate-500">Remaining</p><p className="mt-1 text-lg font-semibold">{money(remaining)}</p></div><div className="rounded-xl bg-slate-950/40 p-4"><p className="text-xs text-slate-500">Invoiced</p><p className="mt-1 text-lg font-semibold">{money(data.invoiced)}</p></div><div className="rounded-xl bg-slate-950/40 p-4"><p className="text-xs text-slate-500">Overdue</p><p className="mt-1 text-lg font-semibold text-rose-300">{money(data.overdue)}</p></div></div></article>
      <article className="rounded-2xl border border-slate-800 bg-[#112337] p-6 md:p-8"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Offer velocity</h2><Gauge className="text-violet-300"/></div><div className="mt-6"><div className="flex justify-between text-sm"><span className="text-slate-400">C$750 websites</span><strong>{data.websitesSold}</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-violet-400" style={{ width: `${websiteProgress}%` }}/></div></div><div className="mt-7 space-y-4 text-sm"><div className="flex justify-between"><span className="text-slate-400">Open proposals</span><strong>{data.openProposals}</strong></div><div className="flex justify-between"><span className="text-slate-400">Proposal value</span><strong>{money(data.proposalValue)}</strong></div><div className="flex justify-between"><span className="text-slate-400">Won value</span><strong>{money(data.wonValue)}</strong></div></div></article>
    </section>
    <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <article className="overflow-hidden rounded-2xl border border-slate-800 bg-[#112337]"><div className="flex items-center justify-between p-6"><div><h2 className="text-lg font-semibold">Recent invoices</h2><p className="mt-1 text-sm text-slate-400">Payment truth comes from Billr</p></div><FileCheck2 className="text-cyan-400"/></div>{data.recentInvoices.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-950/40 text-slate-400"><tr><th className="px-6 py-3">Client</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Due</th><th className="px-6 py-3 text-right">Amount</th></tr></thead><tbody>{data.recentInvoices.map((invoice) => <tr key={invoice.id} className="border-t border-slate-800"><td className="px-6 py-4 font-medium">{invoice.client}</td><td className="px-6 py-4 capitalize text-slate-300">{invoice.status}</td><td className="px-6 py-4 text-slate-400">{invoice.dueDate}</td><td className="px-6 py-4 text-right">{money(invoice.amount)}</td></tr>)}</tbody></table></div> : <div className="border-t border-slate-800 px-6 py-10 text-center text-sm text-slate-400">No live invoices yet. Connect Billr, then create the first C$750 website estimate.</div>}</article>
      <article className="rounded-2xl border border-slate-800 bg-[#112337] p-6"><BadgeDollarSign className="text-emerald-300"/><h2 className="mt-5 text-lg font-semibold">Today’s money moves</h2><ol className="mt-5 space-y-4 text-sm text-slate-300"><li className="rounded-xl bg-slate-950/40 p-4"><strong>1.</strong> Contact 20 qualified BC prospects.</li><li className="rounded-xl bg-slate-950/40 p-4"><strong>2.</strong> Run two website demonstrations.</li><li className="rounded-xl bg-slate-950/40 p-4"><strong>3.</strong> Send one Billr estimate and request payment.</li></ol><p className="mt-5 text-xs leading-5 text-slate-500">{data.message}</p></article>
    </section>
  </div></main>;
}
