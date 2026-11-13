import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Australia Business Funding | CommercialKonnect",
  description: "Explore CommercialKonnect's proposed Australian business funding referral network and financing categories.",
};

const products = [
  { name: "Business loans & working capital", use: "Growth, payroll, stock and cash-flow gaps", range: "Illustrative A$5k–A$250k" },
  { name: "Equipment & asset finance", use: "Vehicles, machinery and essential equipment", range: "Illustrative A$20k–A$500k+" },
  { name: "Invoice & debtor finance", use: "Cash tied up in unpaid business invoices", range: "Facility depends on eligible receivables" },
  { name: "Commercial property finance", use: "Property acquisition, refinancing or development", range: "Illustrative A$500k–A$50m+" },
  { name: "Overdrafts & lines of credit", use: "Revolving short-term liquidity", range: "Illustrative A$10k–A$150k" },
];

export default function AustraliaMarketPage() {
  return (
    <main className="min-h-screen bg-[#091523] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:underline">
          <ArrowLeft size={16} /> Canada / BC primary market
        </Link>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-700 px-3 py-1 text-xs text-cyan-300">Secondary market · Australia</span>
          <span className="rounded-full border border-amber-700 px-3 py-1 text-xs text-amber-200">Market validation / pre-launch</span>
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">Business funding introductions for Australian businesses</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">A proposed, partner-led marketplace matching borrower-confirmed business funding needs with suitable Australian finance specialists. No lender network, referral service, or funding approvals are currently represented as live.</p>
        <section aria-labelledby="funding-products" className="mt-14">
          <h2 id="funding-products" className="text-2xl font-semibold">Five funding pathways</h2>
          <p className="mt-2 text-sm text-slate-400">Illustrative product categories and amounts from the supplied Commercial Broker’s Pipeline Blueprint; not lender offers or verified eligibility limits.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <article key={product.name} className="rounded-2xl border border-slate-700 bg-[#112337] p-6">
                <div className="flex items-start gap-3"><Building2 className="mt-1 shrink-0 text-cyan-400" size={21} /><div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="mt-2 text-slate-300">{product.use}</p>
                  <p className="mt-3 text-sm text-cyan-200">{product.range}</p>
                </div></div>
              </article>
            ))}
          </div>
        </section>
        <section aria-labelledby="approach" className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-[#112337] p-7">
            <ShieldCheck className="text-cyan-400" />
            <h2 id="approach" className="mt-4 text-xl font-semibold">Borrower permission first</h2>
            <p className="mt-3 leading-7 text-slate-300">The proposed workflow verifies borrowing purpose and consent before a human-reviewed introduction. CommercialKonnect does not lend, underwrite or guarantee finance.</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-[#112337] p-7">
            <CheckCircle2 className="text-cyan-400" />
            <h2 className="mt-4 text-xl font-semibold">Partner-led launch</h2>
            <p className="mt-3 leading-7 text-slate-300">Initial validation focuses on NSW construction businesses seeking working capital, followed by other sectors and states only after appropriate partner and legal review.</p>
          </div>
        </section>
        <div className="mt-12 rounded-2xl border border-cyan-900 bg-cyan-500/5 p-7">
          <h2 className="text-xl font-semibold">Australian network status</h2>
          <p className="mt-2 text-slate-300">Research and partnership discovery only. Finance assessments, lead resale and partner routing are not enabled. Australian legal, privacy, consent and contractual gates remain outstanding.</p>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 text-cyan-300 hover:underline">Return to primary market <ArrowRight size={16} /></Link>
        </div>
      </div>
    </main>
  );
}
