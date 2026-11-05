"use server";
// Intake Server Actions — the call site that wires the repository to Clerk + RLS Supabase.
// Resolves the tenant from the verified Clerk session (never from client input), creates an
// RLS-bound client, and delegates persistence to repository.ts.
// NOTE: `@/lib/supabase/server` (createRlsClient) lands on this branch when src/ reconciles with
// main under MC-00; it is the canonical RLS client used across the app (see construction-projects).
import { auth } from "@clerk/nextjs/server";
import { createRlsClient } from "@/lib/supabase/server";
import {
  reviewTranscriptToBrief,
  type TranscriptInput,
  type ApplicationFacts,
  type TranscriptClassifier,
} from "./transcript-adapter";
import {
  insertApplication,
  persistTranscriptReview,
  type ApplicationInput,
  type ClarificationCallInput,
} from "./repository";

async function orgContext() {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");
  const supabase = await createRlsClient();
  return { orgId, supabase };
}

/** Create a funding application for the signed-in org. */
export async function createFundingApplication(input: ApplicationInput) {
  const { orgId, supabase } = await orgContext();
  return insertApplication(supabase, orgId, input);
}

/**
 * Review a discovery/clarification-call transcript into a draft client brief and persist it.
 * Runs the consent-gated adapter (classifier defaults to the unconfigured stub), then writes the
 * call, classification rows and the draft brief. Produces no qualification and no lending decision.
 */
export async function reviewClarificationTranscript(
  call: ClarificationCallInput,
  transcript: TranscriptInput,
  application: ApplicationFacts,
  classifier?: TranscriptClassifier,
) {
  const { orgId, supabase } = await orgContext();
  const result = await reviewTranscriptToBrief(transcript, application, classifier);
  return persistTranscriptReview(supabase, orgId, call, result);
}
