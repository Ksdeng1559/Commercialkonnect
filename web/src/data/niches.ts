// Single source of truth for the financing-niche money pages.
// Each entry generates one page at /<slug>/ via src/pages/[slug].astro and one
// card on the home page. Each page is a rentable unit in the rank-and-rent model.
//
// Compliance: copy is educational and non-promissory. No approval or rate
// guarantees. Terms, where mentioned, are described as typical/indicative and
// subject to qualification.

export interface Faq {
  q: string;
  a: string;
}

export interface Niche {
  slug: string;
  /** Short product name, used in nav and cards. */
  name: string;
  /** <title> for the page. */
  title: string;
  /** Meta description. */
  description: string;
  /** Page H1. */
  h1: string;
  /** One-line card summary on the home page. */
  cardSummary: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** Who it's for / what it is. */
  whatItIs: string;
  /** Common uses, shown as bullets. */
  uses: string[];
  /** 3 FAQs; also emitted as FAQPage schema. */
  faqs: Faq[];
}

export const niches: Niche[] = [
  {
    slug: "business-line-of-credit",
    name: "Business Lines of Credit",
    title: "Business Lines of Credit in BC | CommercialKonnect",
    description:
      "A business line of credit gives BC business owners flexible, revolving access to funds for cash flow and short-term needs. Explore your options and request a connection.",
    h1: "Business lines of credit for BC businesses",
    cardSummary: "Revolving access to funds you draw on and repay as cash flow moves.",
    intro:
      "A line of credit is revolving funding you can draw on when you need it and repay as money comes in, paying interest only on what you use. It is built for the gaps between money going out and money coming in, not for a single large purchase.",
    whatItIs:
      "Lines of credit suit businesses with uneven cash flow, seasonal swings, or recurring short-term needs that a fixed term loan handles poorly. Limits, security, and pricing vary widely by lender and by how your business looks on paper, so the right fit depends on your situation.",
    uses: [
      "Cover payroll or supplier payments while receivables are outstanding",
      "Bridge seasonal dips in revenue",
      "Fund short-term inventory or a one-off opportunity",
      "Keep a buffer available without drawing a full term loan",
    ],
    faqs: [
      {
        q: "How is a line of credit different from a term loan?",
        a: "A term loan is a lump sum repaid on a fixed schedule. A line of credit is revolving: you draw, repay, and redraw up to a limit, and pay interest only on the balance you use.",
      },
      {
        q: "Is the limit guaranteed?",
        a: "No. Limits, rates, and security are set by the lender based on your business and are subject to qualification. CommercialKonnect does not approve credit or guarantee any limit.",
      },
      {
        q: "What do I need to start?",
        a: "Just a short enquiry about what you need and your timing. No document uploads at this stage.",
      },
    ],
  },
  {
    slug: "commercial-mortgages",
    name: "Commercial Mortgages",
    title: "Commercial Mortgages in BC | CommercialKonnect",
    description:
      "Financing to purchase, refinance, or renew commercial property in British Columbia. Explore commercial mortgage options and request a connection with a financing professional.",
    h1: "Commercial mortgages in British Columbia",
    cardSummary: "Purchase, refinance, or renew owner-occupied or investment commercial property.",
    intro:
      "A commercial mortgage finances the purchase, refinance, or renewal of commercial real estate, from an owner-occupied building to an investment property. Structures and loan-to-value limits differ from residential lending and depend on the property and the borrower.",
    whatItIs:
      "These apply whether you are buying the premises your business runs from or adding to a property portfolio. Amortization, loan-to-value ceilings, and whether CMHC-insured options fit all depend on the property type, tenancy, and your profile.",
    uses: [
      "Buy the building your business operates from",
      "Acquire an investment or mixed-use commercial property",
      "Refinance to access equity or restructure existing debt",
      "Review options ahead of a maturing term or renewal date",
    ],
    faqs: [
      {
        q: "How much down payment is typical?",
        a: "It varies by property type, use, and lender, and is always subject to qualification. There is no single fixed figure, which is why an early conversation about your specific property helps.",
      },
      {
        q: "Can I refinance before my term matures?",
        a: "Sometimes, depending on your existing agreement and any prepayment terms. A financing professional can review whether it makes sense in your case.",
      },
      {
        q: "Does an introduction mean I'm approved?",
        a: "No. An introduction connects you with a financing professional. It does not constitute approval or an offer of financing.",
      },
    ],
  },
  {
    slug: "equipment-financing",
    name: "Equipment Financing",
    title: "Equipment Financing in BC | CommercialKonnect",
    description:
      "Finance vehicles, machinery, and equipment for your BC business without tying up working capital. Explore equipment financing options and request a connection.",
    h1: "Equipment financing for BC businesses",
    cardSummary: "Fund machinery, vehicles, and equipment while preserving working capital.",
    intro:
      "Equipment financing funds the machinery, vehicles, or technology your business runs on, spreading the cost over time rather than paying cash up front. The equipment itself often serves as the security, which can make it more accessible than unsecured lending.",
    whatItIs:
      "It suits businesses that need to add or replace equipment without draining cash reserves or their operating line. Terms usually track the useful life of the asset, and options range from loans to leases depending on how you want to own or use the equipment.",
    uses: [
      "Buy or replace machinery, vehicles, or production equipment",
      "Add capacity to take on larger contracts",
      "Preserve working capital and your operating line",
      "Match payments to the working life of the asset",
    ],
    faqs: [
      {
        q: "Loan or lease, which is better?",
        a: "It depends on whether you want to own the equipment outright, your cash flow, and tax considerations. A financing professional can walk through the trade-offs for your situation.",
      },
      {
        q: "Can I finance used equipment?",
        a: "Often yes, though it depends on the asset and the lender. Share what you are buying in your enquiry and it can be reviewed.",
      },
      {
        q: "What do I need to start?",
        a: "A short enquiry describing the equipment and your timing. No financial document uploads at this stage.",
      },
    ],
  },
  {
    slug: "working-capital",
    name: "Working Capital",
    title: "Working Capital Financing in BC | CommercialKonnect",
    description:
      "Working capital financing to cover day-to-day operating needs and seasonal gaps for BC businesses. Explore your options and request a connection.",
    h1: "Working capital financing in BC",
    cardSummary: "Smooth day-to-day operations and seasonal gaps without stalling growth.",
    intro:
      "Working capital financing covers the everyday cost of running your business, the gap between money going out for operations and money coming in from sales. It keeps operations steady through seasonal swings and short-term pressure.",
    whatItIs:
      "It fits businesses with timing gaps in cash flow rather than a single capital purchase. Options range from lines of credit to short-term loans and receivables-based financing, and the right structure depends on how predictable your revenue is.",
    uses: [
      "Cover operating costs during a slow season",
      "Fund inventory ahead of a busy period",
      "Bridge the gap while invoices are outstanding",
      "Take on a larger order without straining cash",
    ],
    faqs: [
      {
        q: "Is this the same as a line of credit?",
        a: "A line of credit is one way to fund working capital. There are others, including short-term loans and receivables-based options. The best fit depends on your cash flow pattern.",
      },
      {
        q: "How fast can it move?",
        a: "Timing varies by lender and structure. Sharing your desired timing in the enquiry helps point you toward options that match.",
      },
      {
        q: "Are terms guaranteed?",
        a: "No. All terms are subject to qualification. CommercialKonnect connects you with a professional and does not approve or guarantee financing.",
      },
    ],
  },
  {
    slug: "construction-financing",
    name: "Construction Financing",
    title: "Construction Financing in BC | CommercialKonnect",
    description:
      "Construction and development financing structured around project stages and draws for BC builders and developers. Explore options and request a connection.",
    h1: "Construction and development financing in BC",
    cardSummary: "Fund a build or development, structured around draws and project stages.",
    intro:
      "Construction financing funds a build or development project and is structured around stages: money is advanced in draws as work is completed and verified, rather than as a single lump sum at the start. It is one of the more specialized areas of commercial lending.",
    whatItIs:
      "It suits builders, developers, and owners taking on ground-up construction or major renovation. Because funds release against progress, lenders look closely at the project plan, costing, and timeline, and the structure is tailored to the build.",
    uses: [
      "Fund ground-up commercial or mixed-use construction",
      "Finance a major renovation or expansion",
      "Structure advances around construction draws and milestones",
      "Plan financing ahead of breaking ground",
    ],
    faqs: [
      {
        q: "How do construction draws work?",
        a: "Funds are typically released in stages as work is completed and verified, rather than all at once. The exact draw schedule is set with the lender for your project.",
      },
      {
        q: "What will a lender want to see?",
        a: "Construction lending is detail-heavy, so project plans, costing, and timelines usually matter. A financing professional can tell you what fits your project.",
      },
      {
        q: "Does an introduction commit me to anything?",
        a: "No. It is a conversation, not a commitment, and does not constitute approval or an offer of financing.",
      },
    ],
  },
  {
    slug: "business-acquisition-financing",
    name: "Business Acquisition",
    title: "Business Acquisition Financing in BC | CommercialKonnect",
    description:
      "Financing to buy an existing business or buy out a partner in British Columbia. Explore business acquisition options and request a connection with a professional.",
    h1: "Business acquisition financing in BC",
    cardSummary: "Fund the purchase of an existing business or a partner buyout.",
    intro:
      "Business acquisition financing funds the purchase of an existing business, or the buyout of a partner. Lenders weigh both the business being acquired and the buyer, since the deal's strength rests on both.",
    whatItIs:
      "It suits buyers acquiring a going concern, operators consolidating ownership, or partners restructuring. Because the target's performance matters as much as the buyer's, these deals reward early planning and a clear picture of the business being bought.",
    uses: [
      "Buy an existing business or franchise",
      "Fund a partner or shareholder buyout",
      "Finance a management or employee buyout",
      "Structure a purchase alongside your own equity",
    ],
    faqs: [
      {
        q: "What matters most in an acquisition deal?",
        a: "Both sides: the health and history of the business being bought, and the buyer's background. The stronger and clearer both are, the more options tend to be available.",
      },
      {
        q: "Should I line up financing before I find a target?",
        a: "Understanding your options early helps you move quickly and negotiate with confidence. An early conversation is worthwhile even before a specific deal.",
      },
      {
        q: "Is approval guaranteed through CommercialKonnect?",
        a: "No. We connect you with a financing professional. We do not lend, approve applications, or guarantee financing.",
      },
    ],
  },
];
