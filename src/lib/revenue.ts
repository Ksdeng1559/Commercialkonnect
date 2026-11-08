export type RevenueSource = "billr" | "demo";

export type RevenueSnapshot = {
  source: RevenueSource;
  connected: boolean;
  message: string;
  currency: "CAD";
  sprint: { startsOn: string; endsOn: string; cashGoal: number; mrrGoal: number; websiteGoal: number };
  collected: number;
  invoiced: number;
  outstanding: number;
  overdue: number;
  mrr: number;
  websitesSold: number;
  openProposals: number;
  proposalValue: number;
  wonValue: number;
  recentInvoices: Array<{ id: string; client: string; status: string; amount: number; dueDate: string }>;
};

export const sprint = {
  startsOn: "2026-11-08",
  endsOn: "2027-01-06",
  cashGoal: 20_000,
  mrrGoal: 2_500,
  websiteGoal: 20,
} as const;

export const demoRevenue: RevenueSnapshot = {
  source: "demo",
  connected: false,
  message: "Add the server-only Billr settings to replace this illustrative sprint data.",
  currency: "CAD",
  sprint,
  collected: 0,
  invoiced: 0,
  outstanding: 0,
  overdue: 0,
  mrr: 0,
  websitesSold: 0,
  openProposals: 0,
  proposalValue: 0,
  wonValue: 0,
  recentInvoices: [],
};
