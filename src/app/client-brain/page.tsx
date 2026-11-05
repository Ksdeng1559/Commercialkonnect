"use client";

import { useMemo, useState } from "react";
import { assessBrokerFit, exampleBrains, type BorrowerAssessment, type FundingPurpose, type Province } from "@/lib/client-brain";

const purposes: FundingPurpose[] = ["working-capital","property-purchase","refinance","construction","equipment"];
const preview: BorrowerAssessment = {id:"synthetic-assessment",province:"BC",purpose:"property-purchase",industry:"manufacturing",amountCad:750000,consentToBrokerReferral:false};

export default function ClientBrainPage() {
  const [brokerId,setBrokerId] = useState(exampleBrains[0].clientId);
  const [lead,setLead] = useState<BorrowerAssessment>(preview);
  const brain = exampleBrains.find(x => x.clientId === brokerId) ?? exampleBrains[0];
  const result = useMemo(()=>assessBrokerFit(brain,lead),[brain,lead]);
  const inputClass = "w-full rounded-lg border border-slate-600 bg-[#091523] p-3 text-slate-100";
  return <main className="min-h-screen bg-[#091523] text-slate-100 p-6 md:p-12">
    <div className="max-w-5xl mx-auto space-y-8">
      <div><a href="/" className="text-cyan-400 text-sm">← Dashboard</a><p className="text-cyan-400 uppercase tracking-widest text-xs mt-7">CommercialKonnect · internal prototype</p><h1 className="text-4xl font-semibold mt-2">Client Brain & campaign fit</h1><p className="text-slate-400 mt-3">Synthetic profiles and synthetic lead only. No saved data, lender matching, outreach or referrals.</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-slate-700 bg-[#112337] p-6 space-y-5"><h2 className="text-xl font-semibold">Broker Client Brain</h2>
          <label className="block text-sm">Example broker<select className={inputClass+" mt-2"} value={brokerId} onChange={e=>setBrokerId(e.target.value)}>{exampleBrains.map(x=><option key={x.clientId} value={x.clientId}>{x.brokerName}</option>)}</select></label>
          <dl className="space-y-3 text-sm">{[["Status",brain.status+" · version "+brain.version],["Provinces",brain.provinces.join(", ")],["Specialties",brain.fundingPurposes.join(", ")],["Preferred funding",new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}).format(brain.minimumFundingCad??0)+" – "+new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}).format(brain.maximumFundingCad??0)],["Approved message",brain.approvedMessage]].map(([k,v])=><div key={k}><dt className="text-slate-400">{k}</dt><dd className="mt-1">{v}</dd></div>)}</dl>
        </section>
        <section className="rounded-2xl border border-slate-700 bg-[#112337] p-6 space-y-4"><h2 className="text-xl font-semibold">Synthetic borrower assessment</h2>
          <label className="block text-sm">Province<select className={inputClass+" mt-2"} value={lead.province} onChange={e=>setLead({...lead,province:e.target.value as Province})}>{(["BC","AB","ON"] as Province[]).map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="block text-sm">Financing purpose<select className={inputClass+" mt-2"} value={lead.purpose} onChange={e=>setLead({...lead,purpose:e.target.value as FundingPurpose})}>{purposes.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
          <label className="block text-sm">Industry<input className={inputClass+" mt-2"} value={lead.industry} onChange={e=>setLead({...lead,industry:e.target.value})}/></label>
          <label className="block text-sm">Funding requested (CAD)<input className={inputClass+" mt-2"} type="number" min="1" value={lead.amountCad} onChange={e=>setLead({...lead,amountCad:Number(e.target.value)})}/></label>
          <label className="flex gap-3 text-sm"><input type="checkbox" checked={lead.consentToBrokerReferral} onChange={e=>setLead({...lead,consentToBrokerReferral:e.target.checked})}/> Simulated permission to refer</label>
        </section>
      </div>
      <section className="rounded-2xl border border-cyan-800 p-6 bg-[#10283a]"><h2 className="text-xl font-semibold">Deterministic fit review</h2><p className="mt-3 font-semibold">{result.eligible?"All configured fit checks passed — still requires human review":"Hold — not eligible for introduction"}</p>{result.reasons.length>0&&<ul className="list-disc pl-5 mt-3 text-sm text-slate-300 space-y-1">{result.reasons.map(r=><li key={r}>{r}</li>)}</ul>}<p className="text-sm text-slate-400 mt-4">A positive match is not a financing approval or an instruction to share borrower information. This page performs no network requests and stores no records.</p></section>
    </div>
  </main>;
}
