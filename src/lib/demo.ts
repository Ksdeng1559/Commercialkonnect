export const pipelineStages = ['Discovered', 'Reviewing', 'Qualified', 'On hold'] as const;
export type PipelineStage = typeof pipelineStages[number];
export type Project = {
  id: string; name: string; location: string; type: string; stage: string;
  value: number; score: number; lead: string; signals: string[];
  roles: string[]; next: string; financing: string; observed: string;
  scoreFactors: { label: string; points: number; max: number }[];
};
const factors = (timing: number, intent: number, scale: number, readiness: number) => [
  { label: 'Stage timing', points: timing, max: 30 },
  { label: 'Signal relevance', points: intent, max: 30 },
  { label: 'Project scale', points: scale, max: 25 },
  { label: 'Research readiness', points: readiness, max: 15 },
];
export const projects: Project[] = [
  {id:'BC-101',name:'North Shore Mixed-Use',location:'North Vancouver, BC',type:'Mixed-use',stage:'Rezoning',value:28000000,score:92,lead:'Developer research',signals:['Public hearing','Financing window'],roles:['Developer','Landowner','Architect'],next:'Confirm rezoning application and ownership',financing:'Land acquisition / pre-development',observed:'2026-10-14',scoreFactors:factors(28,29,25,10)},
  {id:'BC-102',name:'Fraser Valley Townhomes',location:'Surrey, BC',type:'Residential',stage:'Permit application',value:14500000,score:86,lead:'Architect research',signals:['Permit activity','Land assembly'],roles:['Architect','Developer','General contractor'],next:'Verify permit applicant and development team',financing:'Construction financing',observed:'2026-10-13',scoreFactors:factors(27,26,23,10)},
  {id:'BC-103',name:'Vancouver Industrial Renewal',location:'Vancouver, BC',type:'Industrial',stage:'Planning',value:9200000,score:78,lead:'Owner research',signals:['Site redevelopment'],roles:['Property owner','Developer','Capital advisor'],next:'Validate property and proposed use',financing:'Acquisition / bridge financing',observed:'2026-10-12',scoreFactors:factors(23,24,21,10)},
  {id:'BC-104',name:'Burnaby Infill Development',location:'Burnaby, BC',type:'Multifamily',stage:'Pre-construction',value:6200000,score:73,lead:'Contractor research',signals:['Early-stage opportunity'],roles:['General contractor','Developer','Architect'],next:'Identify procurement contact and financing intent',financing:'Construction financing',observed:'2026-10-11',scoreFactors:factors(25,20,18,10)},
  {id:'BC-105',name:'Okanagan Lakeside Residences',location:'Kelowna, BC',type:'Residential',stage:'Rezoning',value:18700000,score:88,lead:'Developer research',signals:['Density uplift','Financing window'],roles:['Developer','Landowner','Planner'],next:'Validate proposed density and land control',financing:'Pre-development capital',observed:'2026-10-10',scoreFactors:factors(28,27,24,9)},
  {id:'BC-106',name:'Victoria Harbour Workplace',location:'Victoria, BC',type:'Commercial',stage:'Permit application',value:11300000,score:81,lead:'Owner research',signals:['Permit activity','Adaptive reuse'],roles:['Property owner','Architect','General contractor'],next:'Confirm scope and tenant commitments',financing:'Renovation / repositioning',observed:'2026-10-09',scoreFactors:factors(27,24,21,9)},
  {id:'BC-107',name:'Coquitlam Station Community',location:'Coquitlam, BC',type:'Multifamily',stage:'Planning',value:34000000,score:84,lead:'Landowner research',signals:['Transit-oriented density','Land assembly'],roles:['Landowner','Developer','Planner'],next:'Verify assembly and planning submission',financing:'Land assembly / acquisition',observed:'2026-10-08',scoreFactors:factors(24,25,25,10)},
  {id:'BC-108',name:'Langley Logistics Centre',location:'Langley, BC',type:'Industrial',stage:'Pre-construction',value:22000000,score:90,lead:'Contractor research',signals:['Procurement window','Permit activity'],roles:['Developer','General contractor','Civil engineer'],next:'Verify tender schedule and capital requirements',financing:'Construction / equipment financing',observed:'2026-10-07',scoreFactors:factors(29,27,24,10)},
];
export const money = (n: number) => new Intl.NumberFormat('en-CA', {style:'currency',currency:'CAD',notation:'compact',maximumFractionDigits:1}).format(n);
export function filterProjects(records: Project[], query: string, stage: string, location: string, minScore: number) {
  const term = query.trim().toLowerCase();
  return records.filter(p => (!term || [p.name,p.location,p.type,p.id,...p.signals].join(' ').toLowerCase().includes(term)) && (stage === 'All stages' || p.stage === stage) && (location === 'All locations' || p.location === location) && p.score >= minScore);
}
export function projectCsv(records: Project[], saved: string[], status: Record<string, PipelineStage>) {
  const rows = [['Data status','ID','Project','Municipality','Type','Construction stage','Assumed value CAD','Illustrative score','Qualification','Shortlisted','Fixture date'], ...records.map(p => ['SYNTHETIC DEMO — NOT VERIFIED',p.id,p.name,p.location,p.type,p.stage,p.value,p.score,status[p.id] ?? 'Discovered',saved.includes(p.id) ? 'Yes' : 'No',p.observed])];
  return rows.map(row => row.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(',')).join('\r\n');
}
