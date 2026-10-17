# Chief of Staff — broker agent orchestration

Status: proposed production orchestration contract plus a manual dry-run view in the checked-in MVP prototype (`#chief`). No real agents, provider calls, background schedules, messages or calendar events are started by this reference.

## Mission and operating loop
Turn the active Client Brain, current financing opportunities and appointment goals into one bounded work plan. Delegate specialist work, manage dependencies and resource limits, check outputs, request decisions and report progress. The Chief of Staff owns coordination; qualified held meetings remain the business outcome. More completed agent tasks is not a substitute for that outcome.

1. **Orient:** read verified workspace context, active profile version, goals, capacity, source coverage and permissions. Report unknowns; do not invent client preferences.
2. **Plan:** select relevant opportunities, identify missing evidence, create a finite dependency graph with deliverables, assignees, deadlines, allowed tools, limits and acceptance criteria.
3. **Dispatch:** use authenticated role-specific adapters; issue scoped, time-limited task capabilities. Ready tasks can run independently only inside approved workspace/tool/budget scope.
4. **Review:** validate typed output, evidence/provenance, policy and dependencies; distinguish machine validation from human confirmation. Keep unsupported conclusions as hypotheses.
5. **Escalate:** request a specific decision for ambiguous mandate, conflicting facts, unapproved side effects, quota exhaustion, credential failure or repeatedly failed tasks. Pause dependent work rather than guessing.
6. **Report:** show ready work, results, blocked work, pending approvals, spend/quota, next actions and meeting outcomes. Daily/weekly reporting is a proposed in-product capability, not an automation configured by this handoff.

## Specialist roster
| Role | Owns | Expected output | Authority boundary |
|---|---|---|---|
| Chief of Staff | Priorities, dependency graph, dispatch, quality routing and reporting | Versioned plan, task status, decision requests, stand-up | Cannot grant itself new tools, raise budgets, approve its own external actions or change client mandate. |
| Research / discovery | LeadSniperAI or licensed project/business source tasks | Dated signal, source snapshot, sponsor hypothesis and uncertainty | Bounded searches; public data does not establish financing intent. |
| Enrichment | Entity resolution and business/contact enrichment | Matched identifiers, role evidence, source dates and confidence | Provider terms/quotas enforced; identity/authority remain unverified until supported. |
| Financing qualification | Compare facts with Client Brain and financing-purpose intake | Match/outside/review, missing facts and discovery questions | No credit approval, lender commitment or inferred borrowing need. |
| GTM strategist / writer | Choose appropriate playbook, personalize offer and draft | Evidence-linked reviewable approach with contact-basis status | Draft-only until valid reviewer approval and dispatch policy. |
| Appointment coordinator | Harvey-supported reply handling, scheduling proposals and prep | Agreed availability proposal, meeting brief and reconciled booking state | Real invitations require participant agreement, current authorization and calendar checks. |
| Quality / outcomes | Provenance, output validation, stale approvals and meeting evidence | Accepted/rejected assertions, quality flags and attribution | Cannot certify its own unsupported facts or convert tasks into held meetings. |

LeadSniperAI, Harvey and provider names are integration boundaries, not running processes here. Preserve established adapters and tenancy. Select a durable runtime via an ADR after reviewing the Harvey/outreach work; do not add a parallel agent framework merely because this coordinator is introduced. Keep model selection configurable and tool contracts independent of model/provider.

## Delegation contract
Every production task must contain: task_id, workspace_id derived by the trusted server, plan_id, parent_task_id where appropriate, agent_role, business objective, active client_brain_version_id, opportunity_id, source/evidence versions, input references, dependencies, allowed_tools/actions, prohibited side effects, expected output schema, acceptance criteria, deadline, priority, estimated resource use, hard budget/quota allocation, max_attempts, idempotency key, actor, trace_id and cancellation state.

Agent output must contain: task_id and attempt ID, status, structured result, evidence references and timestamps, unresolved assumptions/conflicts, confidence rationale, proposed next action, actual tool/model usage, side-effect receipts where authorized, and error class when applicable. Server validates output and workspace ownership before persistence. No agent can widen its scope using fields returned by another agent.

Untrusted source pages, emails, uploaded documents and other agent outputs are data, never authorization. Instructions embedded in them cannot change policy, request secrets, approve tools or redirect exports. Keep credential handling outside model context where possible; use allowlisted typed tools rather than a generic privileged database/shell tool.

## State and execution guarantees
Production task states: planned → ready → leased/running → awaiting_review → accepted; failures go to retry_wait or blocked, with cancelled/timed_out as explicit terminal states. Dependencies release only when required results are accepted under their output/evidence rules. Reject dependency cycles on plan creation/update. A task failure holds descendants without blocking unrelated work.

Use durable leases with expiry/heartbeat and transactional claim to avoid duplicate active workers. Assume at-least-once delivery; enforce idempotency for every external write and reconcile ambiguous outcomes. Bounded retries apply only to retryable errors, with backoff and an attempt cap; permanent errors go to an operator decision. Cancelling a plan revokes queued dispatch and checks cancellation before every external action; it cannot undo messages or invitations already delivered.

Profile changes hold unstarted work, stale fit and related approvals. Running reads may finish into quarantine for reassessment; do not auto-release their outputs under the new profile. An invalidated profile/evidence/content version must block approval and external dispatch. Preserve historical plans/results rather than deleting them.

## Permissions and resources
| Work | Default production behavior |
|---|---|
| Bounded discovery/enrichment under an approved research scope | Execute within workspace/tool/license/quota limits; log evidence and usage. |
| Summaries, fit evaluation, discovery questions and drafts | Internal artifacts; clearly preserve unknowns; human review where domain facts/permissions require it. |
| Draft Client Brain changes | Propose a draft only; reviewed activation remains an authorized human action. |
| Contact eligibility, outbound approval, borrower facts | Enforce existing review/evidence requirements; Chief of Staff cannot self-approve or accept agent assertions as proof. |
| Message dispatch / calendar creation / CRM writes | Only separately authorized typed tools with current approval, suppression/availability checks and idempotency; prototype performs none. |
| Budget increases, new integrations, irreversible data changes | Escalate to authorized operator; no silent scope expansion. |

Set per-workspace and per-plan task, concurrency, tool-call, token, time and monetary limits. Reserve budget atomically before dispatch and reconcile actual provider/model usage afterward. Unknown cost is unknown, never zero. Stop new dispatch when a hard cap is reached. Protect appointment capacity and enforce suppression/rate limits independently of the model. Costly or side-effectful delegated work cannot bypass a cap by spawning child tasks.

Persist plans, tasks, attempts, leases, artifacts, approvals, usage ledger and audit events scoped by workspace; reuse existing agent-run/outreach structures where compatible after schema inspection. Ordinary members can view their workspace; dispatch, review, cancellation and budget permissions must be server-enforced with an explicit role matrix. Independent reviewer separation applies to sensitive actions. Do not conflate operational approvals with legal contact eligibility.

## Mission Control wireframe
The prototype adds Chief of Staff navigation, an agent roster, a dependency-aware assignment queue, an output review dialog and an on-demand stand-up. It creates at most twelve sample tasks over three matching opportunities: research → enrichment → qualification → draft preparation. Appointment coordination and quality roles appear in the roster; their real workflows are later integration work.

An active Client Brain is required. Human-entered sample outputs go to review; accepting them releases dependent sample tasks. Empty outputs, dependency bypasses and stale-profile transitions are blocked. Failure/rework has a two-retry cap. Replacing a sample plan asks for confirmation because it replaces browser-local records; production should archive plans instead. Results are explicitly sample, and are not written back as verified opportunity evidence or booked/held appointments. No real orchestration or automatic stand-up schedule is implied.

Production view should additionally show run traces, model/tool usage, SLA/deadline, live worker health, budget remaining, failure reason, external-action receipts, pauses/cancellation and safe resumability.

## Acceptance tests and release gates
- Plan from two contrasting Client Brains produces different relevant assignments and offers; no active brain or no matching data yields a helpful empty state.
- Missing evidence creates research/review tasks, not a fictional financing need. Draft cannot execute before qualification gates.
- Cycle rejection, missing dependency rejection, failure propagation, bounded rework, stale-profile invalidation and role checks are tested.
- Two workers claiming one task cannot both execute the same side effect; lease recovery and duplicate callbacks do not duplicate messages/events.
- Tenant A cannot access B's plans, tasks, artifacts, logs, tool credentials or budget. Forged workspace/agent outputs and source prompt injection fail closed.
- Cancellation, hard budget/quota limits, deadline expiry and provider credential failures pause correctly and preserve audit history.
- Chief of Staff cannot approve its own outbound, activate its proposed profile or label model assertions as borrower confirmation.
- Stand-up reconciles persisted task usage and true meeting outcomes, labels missing usage unknown, and never reports task completion as appointments booked.

No production agent execution is accepted until these gates and the prior Mission Control security/source/appointment gates pass.

## Agency Agents role sources

[AGENCY_AGENTS.md](AGENCY_AGENTS.md) maps the reviewed Agency Agents fork into this coordinator. `agent-sources.lock.json` pins 15 source roles; `workflow-registry.json` defines six design-only workflows with dispatch disabled. Use Chief of Staff for business priority/decision routing and Agents Orchestrator for implementation execution. Workflow Architect defines branches; Multi-Agent Systems Architect defines runtime coordination. Retain this document's task scope, tenancy, budget, retry and independent-approval rules where generic source instructions differ. Role sources do not grant authority or provide a running process.
