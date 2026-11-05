# Client Brain first technical slice

**Status:** Prototype implemented on review branch; no persisted onboarding, private client records, or production LeadOS integration.

## Delivered
- `src/lib/client-brain.ts`: typed, versioned Client Brain, synthetic borrower assessment and deterministic explainable fit review. Checks approved status, reviewer, capacity, consent, geography, specialty, industry and requested amount. Match never bypasses human review.
- `src/app/client-brain/page.tsx`: interactive synthetic preview at `/client-brain`. Choose between two deliberately conflicting broker profiles and modify an illustrative borrower assessment. No network calls or persistence.

## Next production gates
1. Confirm authentication and organization isolation design against the active Mortgage Mix tenancy migration; never add parallel tenant storage without that review.
2. Implement authorized Client Brain CRUD and explicit approval/version events with RLS, audit trail and permission scopes.
3. Add campaign/creative variant manifest binding Brain version, evidence snapshot, CTA and approval.
4. Add consent-aware LeadOS event endpoint and referral decision workflow; no autonomous forwarding.
5. Test tenant isolation, consent denial, exclusion handling, unapproved Brain blocking, and owner approval before live pilot.

## Manual acceptance
- Initial BC property profile with no consent must be held.
- Checking synthetic permission for a $750,000 BC property purchase produces a **review-required** fit result for the first profile.
- Switching to the AB/ON working-capital profile blocks that same lead for geography and specialty.
- No live prospects, financing assertions or borrower data are stored or transmitted.
