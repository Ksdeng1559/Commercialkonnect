export type Province = "BC" | "AB" | "ON";
export type BrainStatus = "draft" | "approved";
export type FundingPurpose = "working-capital" | "property-purchase" | "refinance" | "construction" | "equipment";

export interface BrokerClientBrain {
  clientId: string;
  version: number;
  status: BrainStatus;
  approvedBy?: string;
  brokerName: string;
  provinces: Province[];
  fundingPurposes: FundingPurpose[];
  targetIndustries: string[];
  excludedIndustries: string[];
  minimumFundingCad?: number;
  maximumFundingCad?: number;
  bookingUrl?: string;
  approvedMessage: string;
  capacityAvailable: boolean;
}

export interface BorrowerAssessment {
  id: string;
  province: Province;
  purpose: FundingPurpose;
  industry: string;
  amountCad: number;
  consentToBrokerReferral: boolean;
}

export type MatchResult = { eligible: boolean; reasons: string[]; reviewRequired: true };

export function assessBrokerFit(brain: BrokerClientBrain, lead: BorrowerAssessment): MatchResult {
  const reasons: string[] = [];
  if (brain.status !== "approved" || !brain.approvedBy?.trim()) reasons.push("Client Brain is not approved");
  if (!brain.capacityAvailable) reasons.push("Broker has no confirmed capacity");
  if (!lead.consentToBrokerReferral) reasons.push("Borrower referral permission missing");
  if (!brain.provinces.includes(lead.province)) reasons.push("Province is outside the service area");
  if (!brain.fundingPurposes.includes(lead.purpose)) reasons.push("Financing purpose is not a supported specialty");
  if (brain.excludedIndustries.some(i => i.toLowerCase() === lead.industry.trim().toLowerCase())) reasons.push("Industry explicitly excluded");
  if (brain.targetIndustries.length && !brain.targetIndustries.some(i => i.toLowerCase() === lead.industry.trim().toLowerCase())) reasons.push("Industry outside stated ICP");
  if (!Number.isFinite(lead.amountCad) || lead.amountCad <= 0) reasons.push("Invalid funding amount");
  if (brain.minimumFundingCad !== undefined && lead.amountCad < brain.minimumFundingCad) reasons.push("Below minimum preferred amount");
  if (brain.maximumFundingCad !== undefined && lead.amountCad > brain.maximumFundingCad) reasons.push("Above maximum preferred amount");
  return { eligible: reasons.length === 0, reasons, reviewRequired: true };
}

/** Demonstration data only: never use to route live borrower information. */
export const exampleBrains: BrokerClientBrain[] = [
  {clientId:"demo-property",version:1,status:"approved",approvedBy:"Synthetic reviewer",brokerName:"Example Commercial Property Team",provinces:["BC"],fundingPurposes:["property-purchase","refinance"],targetIndustries:[],excludedIndustries:["gambling"],minimumFundingCad:500000,maximumFundingCad:10000000,approvedMessage:"Explore property financing options with a professional.",capacityAvailable:true},
  {clientId:"demo-working-capital",version:1,status:"approved",approvedBy:"Synthetic reviewer",brokerName:"Example Business Capital Team",provinces:["AB","ON"],fundingPurposes:["working-capital","equipment"],targetIndustries:["manufacturing","wholesale"],excludedIndustries:[],minimumFundingCad:50000,maximumFundingCad:500000,approvedMessage:"Discuss business capital and equipment needs.",capacityAvailable:true}
];
