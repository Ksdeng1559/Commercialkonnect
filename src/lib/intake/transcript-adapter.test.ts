// Behavior checks for the transcript adapter's pure core.
// Built-in node:test + node:assert (zero deps). Run with a TS-aware runner once one exists,
// e.g. `npx tsx --test src/lib/intake/transcript-adapter.test.ts` or via vitest. No runner is
// wired in package.json yet (repo gate is `tsc --noEmit`), so this has not been executed here.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assertRecordingConsent,
  ConsentRequiredError,
  NotConfiguredError,
  NotConfiguredClassifier,
  mergePreservingUnknown,
  summarizeToBrief,
  reviewTranscriptToBrief,
  type ClassifiedField,
} from "./transcript-adapter";

const f = (silo: ClassifiedField["silo"], field: string, value: string | null, source: ClassifiedField["source"] = "application"): ClassifiedField =>
  ({ silo, field, value, source, confidence: value === null ? 0 : 0.9 });

test("consent gate rejects a transcript without recording consent", () => {
  assert.throws(() => assertRecordingConsent({ text: "hi", participants: ["a", "b"] }), ConsentRequiredError);
  assert.doesNotThrow(() => assertRecordingConsent({ text: "hi", participants: ["a", "b"], recordingConsentEvidence: { signedBy: "a,b" } }));
});

test("stub classifier enforces consent then refuses rather than fabricating", async () => {
  const c = new NotConfiguredClassifier();
  await assert.rejects(c.classify({ text: "x", participants: [] }), ConsentRequiredError);
  await assert.rejects(c.classify({ text: "x", participants: [], recordingConsentEvidence: "ok" }), NotConfiguredError);
});

test("merge fills unknowns, keeps known, surfaces conflicts — never defaults unknown", () => {
  const app = [f("amount_use", "amount_cad", null), f("authority", "signer", "Jane")];
  const tx = [
    f("amount_use", "amount_cad", "500000", "transcript"),           // fills unknown
    f("authority", "signer", "John", "transcript"),                  // conflicts with Jane
  ];
  const r = mergePreservingUnknown(app, tx);
  const amount = r.fields.find((x) => x.field === "amount_cad");
  const signer = r.fields.find((x) => x.field === "signer");
  assert.equal(amount?.value, "500000");          // unknown got filled
  assert.equal(signer?.value, "Jane");            // known application value kept
  assert.equal(r.conflicts.length, 1);            // conflict surfaced, not merged away
  assert.equal(r.conflicts[0].field, "signer");
});

test("brief cites only known fields, lists unknowns, no approval language", () => {
  const r = mergePreservingUnknown([f("funding_purpose", "product", "loc"), f("financials", "revenue", null)], []);
  const brief = summarizeToBrief(r);
  assert.equal(brief.reviewed, false);
  assert.equal(brief.citations.length, 1);                // only the known field cited
  assert.equal(brief.unknowns.length, 1);                 // unknown listed, not invented
  assert.equal(brief.unknowns[0].field, "revenue");
  assert.match(brief.summary, /draft/i);
  assert.doesNotMatch(brief.summary, /approv|eligib|guarantee/i);
});

test("reviewTranscriptToBrief refuses when consent is missing (before touching a provider)", async () => {
  await assert.rejects(
    reviewTranscriptToBrief({ text: "t", participants: [] }, { fields: [] }),
    ConsentRequiredError,
  );
});
