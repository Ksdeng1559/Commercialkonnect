import "server-only";

import { demoRevenue, sprint, type RevenueSnapshot } from "@/lib/revenue";

type JsonRpcResponse = {
  result?: { content?: Array<{ type: string; text?: string }> };
  error?: { message?: string };
};
type RevenueSummary = { invoiced_total?: number; paid_total?: number; outstanding_total?: number; overdue_total?: number };
type BillrInvoice = { id?: string; invoice_id?: string; client_name?: string; status?: string; total?: number; due_date?: string; line_items?: Array<{ name?: string; description?: string }> };
type BillrEstimate = { status?: string; total?: number };

const parseSse = (body: string): JsonRpcResponse => {
  const data = body.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).filter((line) => line && line !== "[DONE]").at(-1);
  if (!data) throw new Error("Billr returned an empty MCP response.");
  return JSON.parse(data) as JsonRpcResponse;
};

const unwrapToolResult = <T>(response: JsonRpcResponse): T => {
  if (response.error) throw new Error(response.error.message ?? "Billr MCP request failed.");
  const text = response.result?.content?.find((item) => item.type === "text")?.text;
  if (!text) throw new Error("Billr did not return a text result.");
  return JSON.parse(text) as T;
};

async function callBillr<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const url = process.env.BILLR_MCP_URL;
  const apiKey = process.env.BILLR_API_KEY;
  if (!url || !apiKey) throw new Error("Billr is not configured.");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: crypto.randomUUID(), method: "tools/call", params: { name, arguments: args } }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Billr returned HTTP ${response.status}.`);
  const body = await response.text();
  const rpc = response.headers.get("content-type")?.includes("text/event-stream") ? parseSse(body) : JSON.parse(body) as JsonRpcResponse;
  return unwrapToolResult<T>(rpc);
}

const asList = <T>(value: unknown, keys: string[]): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of keys) if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
};

const isWebsiteInvoice = (invoice: BillrInvoice) => invoice.line_items?.some((item) => `${item.name ?? ""} ${item.description ?? ""}`.toLowerCase().includes("website")) ?? false;

export async function getRevenueSnapshot(): Promise<RevenueSnapshot> {
  const businessId = process.env.BILLR_BUSINESS_ID;
  const common = businessId ? { business_id: businessId } : {};
  try {
    const [summary, invoiceResult, estimateResult] = await Promise.all([
      callBillr<RevenueSummary>("revenue_summary", { ...common, period: "this_year" }),
      callBillr<unknown>("list_invoices", { ...common, limit: 100 }),
      callBillr<unknown>("list_estimates", { ...common, limit: 100 }),
    ]);
    const invoices = asList<BillrInvoice>(invoiceResult, ["invoices", "data"]);
    const estimates = asList<BillrEstimate>(estimateResult, ["estimates", "data"]);
    const openEstimates = estimates.filter((estimate) => ["draft", "sent", "viewed", "accepted"].includes(estimate.status ?? ""));
    const websitesSold = invoices.filter((invoice) => !["draft", "cancelled"].includes(invoice.status ?? "") && isWebsiteInvoice(invoice)).length;
    return {
      source: "billr", connected: true, message: "Live from the connected Billr workspace.", currency: "CAD", sprint,
      collected: summary.paid_total ?? 0, invoiced: summary.invoiced_total ?? 0,
      outstanding: summary.outstanding_total ?? 0, overdue: summary.overdue_total ?? 0, mrr: 0,
      websitesSold, openProposals: openEstimates.length,
      proposalValue: openEstimates.reduce((sum, estimate) => sum + (estimate.total ?? 0), 0),
      wonValue: summary.invoiced_total ?? 0,
      recentInvoices: invoices.slice(0, 6).map((invoice, index) => ({ id: invoice.id ?? invoice.invoice_id ?? `invoice-${index}`, client: invoice.client_name ?? "Client", status: invoice.status ?? "unknown", amount: invoice.total ?? 0, dueDate: invoice.due_date ?? "—" })),
    };
  } catch (error) {
    return { ...demoRevenue, message: error instanceof Error ? error.message : demoRevenue.message };
  }
}
