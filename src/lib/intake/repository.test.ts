// Behavior checks for the intake repository's pure row mappers.
// node:test + node:assert (zero deps). Not run here — no test runner in package.json; repo gate is
// `tsc --noEmit`. The insert fns are thin I/O and are exercised against the DB in MC-03/05, not here.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applicationRow,
  clarificationCallRow,
  classificationRows,
  clientBriefRow,
} from "./repository";
import { ConsentRequiredError, type ClassifiedField } from "./transcript-adapter";

test("applicationRow maps camelCase input to snake_case columns + sets tenant", () => {
  const row = applicationRow("org_1", { applicantType: "incorporated", amountCad: 250000 });
  assert.equal(row.organization_id, "org_1");
  assert.equal(row.applicant_type, "incorporated");
  assert.equal(row.amount_cad, 250000);
  assert.deepEqual(row.use_of_funds, []); // defaulted empty, not null
});

test("clarificationCallRow throws when a transcript is attached without recording consent", () => {
  assert.throws(
    () => clarificationCallRow("org_1", { applicationId: "a1", participants: [], transcriptSourceId: "t1" }),
    ConsentRequiredError,
  );
  assert.doesNotThrow(() =>
    clarificationCallRow("org_1", {
      applicationId: "a1",
      participants: [],
      transcriptSourceId: "t1",
      recordingConsentEvidence: { signedBy: "a,b" },
    }),
  );
  // a call with no transcript needs no consent evidence
  assert.doesNotThrow(() => clarificationCallRow("org_1", { applicationId: "a1", participants: [] }));
});

test("classificationRows preserve null (unknown) values and carry provenance", () => {
  const fields: ClassifiedField[] = [
    { silo: "financials", field: "revenue", value: null, source: "application", confidence: 0 },
    { silo: "amount_use", field: "amount_cad", value: "500000", source: "transcript", transcriptSpan: "00:12", confidence: 0.8 },
  ];
  const rows = classificationRows("org_1", "a1", fields);
  assert.equal(rows[0].value, null); // unknown preserved, not defaulted
  assert.equal(rows[0].organization_id, "org_1");
  assert.equal(rows[1].transcript_span, "00:12");
  assert.equal(rows[1].source, "transcript");
});

test("clientBriefRow is never created pre-accepted (immutable=false, version defaults to 1)", () => {
  const row = clientBriefRow("org_1", { applicationId: "a1", summary: "draft", citations: [], unknowns: [] });
  assert.equal(row.immutable, false);
  assert.equal(row.version, 1);
  assert.equal(row.organization_id, "org_1");
});
