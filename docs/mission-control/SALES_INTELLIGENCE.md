# Sales intelligence card and BuildData population handoff

The broker Opportunities screen includes a sample intelligence card; each opportunity detail has a Sales intelligence action. Cards show the project signal, financing relevance as an inference, unknown funding request, borrower/decision-maker verification gaps, discovery questions, source limitations and next step. Download produces an illustrative text card. Existing navigation stays at three broker screens.

The hosted example uses only synthetic records. A separate private five-project review pack was produced from ClearClose's stored BuildData permit records on October 21, 2026 UTC. It is deliberately excluded from Git and public deployments. This is a dated read, not a live BuildData API integration or a CRM import.

## Findings and population contract

The source review found 452 BuildData permits, collected October 17, 2026. All 452 lacked publisher_source_url, licence and attribution. Some normalized owner relationships conflict with the raw contractor/builder fields. Preserve the conflict and resolve sponsor identity; never infer borrower authority from a contractor name.

For a secure production adapter map construction_projects.id/name/city/province/project_type/current_stage/estimated_value; join project_events to provider_sources for provider, dataset, source_record_id, collection_time and original event date. Keep raw descriptions server-side and expose only licensed, necessary fields. Use the original payload contractor field as a listed contractor, without promoting it to sponsor. Estimated value maps to permit_value_cad, never requested_financing_cad.

New research candidates start with sponsor, decision-maker, requested financing and financing need unknown. Persist field provenance and review status. Deduplicate by provider + dataset + source_record_id, while keeping project/permit relationships separate so multiple staged permits do not become multiple borrowers. Enforce authenticated workspace visibility and source entitlements before tenant reads; do not rely on shared tables having workspace_id.

Promotion requires original-source verification, rights review, conflict resolution, current-stage review and explicit broker selection. A milestone alone cannot qualify financing intent. No personal contact lookup, paid search, production database write or outbound action was performed.

## Verification

Run node verify-sales-card.cjs and the existing reference checks. The new check verifies card disclosures and preserves broker shortlist, briefing and navigation behavior. Browser and production adapter verification are separate requirements.
