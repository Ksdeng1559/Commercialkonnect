# Billr → Mission Control integration

The `/revenue` route is the 60-day Klick2Client revenue command center. Billr remains the source of truth for estimates, invoices, payments and revenue totals; CommercialKonnect only reads and presents those totals.

## Security boundary

- Use a Billr API key with the **Read only** profile, scoped to the Klick2Client business.
- Store the key only as `BILLR_API_KEY` in the server environment. Never prefix it with `NEXT_PUBLIC_`.
- `BILLR_MCP_URL` points to the self-hosted Billr `/api/mcp` endpoint.
- Set `BILLR_BUSINESS_ID` when the key can access more than one Billr business.
- Mission Control does not create, send, edit or settle invoices. Those remain deliberate actions in Billr.

## Dashboard mapping

| Mission Control metric | Billr source |
| --- | --- |
| Cash collected | `revenue_summary.paid_total` |
| Invoiced | `revenue_summary.invoiced_total` |
| Outstanding / overdue | `revenue_summary` |
| Recent invoices | `list_invoices` |
| Open proposals | open `list_estimates` records |
| Websites sold | non-draft invoice containing “website” in a line item |

MRR remains zero until recurring-plan metadata is standardized. Recommended next slice: add a saved item code such as `LOCALO-149-MONTHLY` and calculate active MRR from accepted engagements or recurring invoices rather than guessing from descriptions.

## Setup

1. Deploy Billr with its own Supabase project, Stripe account and optional Resend sender.
2. Create the Klick2Client business inside Billr.
3. Create a read-only, business-scoped key under **Agents → API Keys**.
4. Add the three environment variables from `.env.example` to the CommercialKonnect Vercel project.
5. Redeploy and open `/revenue`.

Without credentials—or if Billr returns an error—the page stays available with zero-value illustrative data and displays the connection message. No secret is sent to the browser.
