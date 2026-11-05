import { z } from "zod";
import { niches } from "../data/niches";

// Option lists shared by the form (apply.astro) and the validator (api/apply.ts).

export const PURPOSES = [
  "Buying commercial property",
  "Managing cash flow",
  "Funding equipment or growth",
  "A construction or development project",
  "Buying a business or partner buyout",
  "Refinance or renewal",
  "Other / not sure yet",
] as const;

export const PRODUCT_OPTIONS = [
  ...niches.map((n) => ({ value: n.slug, label: n.name })),
  { value: "not-sure", label: "Not sure yet" },
];

export const AMOUNTS = [
  "Under $100k",
  "$100k – $250k",
  "$250k – $500k",
  "$500k – $1M",
  "$1M – $2M",
  "$2M+",
  "Not sure",
] as const;

export const TIMINGS = [
  "As soon as possible",
  "1 – 3 months",
  "3 – 6 months",
  "Just exploring",
] as const;

const productValues = PRODUCT_OPTIONS.map((p) => p.value) as [string, ...string[]];

// Checkbox inputs arrive as the literal "on" when ticked, or are absent.
const checkbox = z
  .union([z.literal("on"), z.undefined(), z.literal("")])
  .transform((v) => v === "on");

export const enquirySchema = z.object({
  purpose: z.enum(PURPOSES),
  product: z.enum(productValues),
  amount: z.enum(AMOUNTS),
  timing: z.enum(TIMINGS),
  name: z.string().trim().min(1, "Please enter your name").max(120),
  business: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z.string().trim().max(40).optional().default(""),
  // Express consent to be connected is required to submit.
  consent: checkbox.refine((v) => v === true, "Consent is required to submit an enquiry"),
  sms_consent: checkbox,
  source_page: z.string().trim().max(200).optional().default("/apply"),
  // Honeypot: real users never fill this. Must be empty.
  company_website: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
