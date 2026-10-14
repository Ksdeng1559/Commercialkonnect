'use client';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, Bookmark, Check, X } from 'lucide-react';
import { money, type Project } from '@/lib/demo';
export default function ProjectBriefing({project, saved, onSave, onClose}: {project: Project; saved: boolean; onSave: () => void; onClose: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="briefing" aria-labelledby="brief-title" onCancel={onClose} onClick={e => {if (e.target === e.currentTarget) onClose();}}>
    <div className="briefing-content">
      <div className="section-heading"><span className="eyebrow">PROJECT INTELLIGENCE</span><button className="icon-button" onClick={onClose} aria-label="Close briefing"><X size={20}/></button></div>
      <span className="badge amber">Synthetic example · Unverified</span>
      <h2 id="brief-title">{project.name}</h2><p className="muted">{project.location} · {project.id}</p>
      <div className="brief-metrics"><div><small>Assumed project value</small><strong>{money(project.value)}</strong></div><div><small>Construction stage</small><strong>{project.stage}</strong></div></div>
      <h3>Opportunity signals</h3><div className="tags">{project.signals.map(s => <span key={s}>{s}</span>)}</div>
      <h3>Why this score?</h3><p className="muted">{project.score}/100 is an illustrative prioritization score, not a verified assessment.</p>
      {project.scoreFactors.map(f => <div className="score-factor" key={f.label}><div><span>{f.label}</span><span>{f.points}/{f.max}</span></div><progress value={f.points} max={f.max}/></div>)}
      <h3>Stakeholders to identify</h3><div className="role-list">{project.roles.map(role => <div key={role}><span>{role}</span><span className="badge neutral">Identity unverified</span></div>)}</div>
      <h3>Financing hypothesis</h3><p>{project.financing}</p><p className="muted">Validate budget, capital needs and borrower intent. No lender terms or funding commitment are represented.</p>
      <h3>Evidence & next step</h3><div className="evidence"><strong>No originating source attached</strong><p>Publisher: internal demo fixture · Fixture date: {project.observed} · License: synthetic data · Verification: none</p></div><p className="next-step"><ArrowUpRight size={17}/>{project.next}.</p>
      <p className="muted">Confirm source provenance and lawful contact eligibility before outreach. No real company or contact is represented.</p>
      <button className="primary full" aria-pressed={saved} onClick={onSave}>{saved ? <Check size={17}/> : <Bookmark size={17}/>} {saved ? 'Remove from shortlist' : 'Save to demo shortlist'}</button>
    </div>
  </dialog>;
}
