# Client Brain: interview, activation and personalization

## Interview purpose
The client is the brokerage using Mission Control. Interview the owner/team lead before specializing the dashboard. Borrower intake is a separate, opportunity-specific discovery process. Capture uncertainty; do not invent lender access, transaction experience or borrower needs.

| Step | Interview questions / fields | Product effect |
|---|---|---|
| 1. Practice | Team name, participant/role, positioning, ideal borrower/sponsor | Workspace identity, offer and briefing context |
| 2. Specialties | Financing purposes, property/assets, provinces, preferred cities, min/max CAD amount, exclusions | Structured mandate filters and matching reasons |
| 3. Capability | Strengths, support gaps, lender access, experience, mandatory qualification questions | Research priorities and human-reviewed meeting preparation |
| 4. Appointment strategy | Preferred plays, call offer, held-qualified monthly goal, weekly call capacity, contact/routing instructions | Playbook order, meeting target, booking capacity rules |
| 5. Review | Client confirmation, reviewer, date, active version | Activate dashboard customization with a traceable version |

Reference supports construction/development, acquisition/bridge, commercial refinance, owner-occupied property, working capital, equipment, receivables/asset-based lending and business acquisition. Geography selection does not create data coverage. Represent non-property opportunities without a fabricated construction project.

## Persistence and validation
Draft edits autosave or explicitly save with a visible status; never affect active matching. Require team name, interview participant, ideal client, at least one purpose/property-or-asset/province, valid ordered nonnegative amount range with positive maximum, strengths/gaps/qualification prompts, at least one strategy, offer, positive integer meeting goal/capacity and review confirmation. Persist CAD amounts in canonical dollars/decimal types, not the prototype's display unit of millions. Validate numeric strings, NaN, infinity, rounding and currency boundaries server-side.

Record schema_version separately from profile version. Allow resume, cancel and revision history. Only authorized workspace roles activate. Activation stores immutable answers and review metadata in one transaction; stale revisions conflict rather than overwrite. New versions invalidate old fit evaluations and outreach approvals when their underlying assumptions change. Deactivating/replacing a profile must not delete real opportunities, historical meetings or outcomes.

`client.brain.md` is a portable rendering, not the source of authorization or active tenant context. Actual interviews, lender relationships and client data stay private per workspace. Never commit completed client profiles to public Git. Exports must be access-controlled, schema-versioned and labelled self-reported.

## Explainable matching
Prototype weights: purpose 40, property/asset type 25, province 15, amount range 20. All four known and matching are required for its personalized shortlist; city preference breaks ties. Full opportunity list keeps records outside the mandate visible with an explanation. Missing values require review, not an invented zero-risk fact. Scores measure declared specialization, not funding probability, credit risk or outreach eligibility.

Production engine should expose `match | out_of_mandate | needs_review` and per-criterion reasons; any numeric presentation is optional and must be reconciled with the existing GTM review queue's categorical-only design. Keep GTM readiness independent. Neither a 100 score nor an activated profile proves current financing demand or permission to contact.

Free-text exclusions, lender relationships, experience and contact instructions are context in the prototype. For production, extract proposed structured restrictions for human confirmation, store their rule provenance, and retain manual review for ambiguous text. Never pretend free text is automatically enforced. Weekly capacity is display context only in the reference; live booking must enforce it with timezone-aware rules.

## Customization contract
- Mission Control: active specialty banner, correctly scoped counts, matching shortlist, empty states and profile review link.
- Opportunity brief: matched/missing/outside criteria, evaluated profile version, financing-purpose discovery questions, gaps and exclusions.
- GTM: preferred channels first, specialization-specific offer and qualification requirements; no automatic sends.
- Appointment planning: client offer, capacity, owner and appropriate financing intake questions; confirm participant agreement and provider availability.
- Metrics: active target plus historical goal/profile version, timezone-specific reporting period and unique outcome attribution.
- Entire pipeline remains visible, with user-selectable mandate filters; activating a new brain must not silently remove existing deals or reschedule meetings.

## Example interview validation scenarios
Construction broker: BC, multifamily, construction/development, CAD 5–25m → Willow Creek matches; industrial owner-occupied does not. Industrial specialist: BC, industrial, owner-occupied, CAD 5–10m → Pacific Trade Campus matches. Equipment broker: AB, business/no property, equipment, CAD 0.1–2m → add a synthetic equipment opportunity; existing BC property fixtures should show no matching shortlist. A missing financing purpose or province must produce needs_review. These examples are test fixtures, not market evidence or client profiles.
