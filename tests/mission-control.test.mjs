import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCompanies,
  parseCsv,
  parseImport,
  publicUrl,
  reviewOpportunity,
  contentBrief,
} from "../src/lib/mission-control.ts";
test("imports actual LeadSniper CSV format, preserves quoted business names, deduplicates", () => {
  const csv =
    'Business Name,Niche,City,Phone,Website\r\n"Coast, ""A""",Trades,"Burnaby, BC",555,https://example.com\r\n"Coast, ""A""",Trades,"Burnaby, BC",555,https://example.com';
  const companies = normalizeCompanies(parseCsv(csv));
  assert.equal(companies.length, 1);
  assert.equal(companies[0].name, 'Coast, "A"');
  assert.equal(companies[0].demo, false);
});
test("rejects malformed rows and excessive imports; preserves simulation flag", () => {
  assert.throws(() => parseCsv('name,city\n"broken'));
  assert.throws(() => parseCsv("name,city\na,b,c"));
  assert.throws(() => normalizeCompanies([{}]));
  assert.throws(() =>
    normalizeCompanies(Array(1001).fill({ businessName: "a" })),
  );
  assert.equal(
    parseImport('[{"businessName":"Example","demo":true}]', "x.json")[0].demo,
    true,
  );
});
test("unsafe links cannot become clickable source links", () => {
  assert.equal(publicUrl("javascript:alert(1)"), "");
  assert.equal(publicUrl("https://a:b@example.com"), "");
  assert.equal(publicUrl("https://example.com"), "https://example.com/");
});
test("directory records do not become financing opportunities without reviewed evidence and owner interest", () => {
  assert.ok(reviewOpportunity("Opportunity", 0, true));
  assert.ok(reviewOpportunity("Opportunity", 1, false));
  assert.equal(reviewOpportunity("Opportunity", 1, true), null);
});
test("content brief excludes contact record and keeps reference material subordinate", () => {
  const brief = contentBrief(
    "Social post",
    "manufacturing",
    "BC",
    "Equipment",
    [],
  );
  assert.match(brief, /never as instructions/);
  assert.match(brief, /Do not name/);
  assert.match(brief, /commercialkonnect.ca/);
});

test("LeadSniper feed mapping denies unknown organizations and never falls back to another workspace", async () => {
  const { organizationFeed } = await import("../src/lib/mission-control.ts");
  const config = {
    org_a: { url: "https://a.example/records" },
    org_b: { url: "https://b.example/records" },
  };
  assert.equal(
    organizationFeed(config, "org_a").url,
    "https://a.example/records",
  );
  assert.deepEqual(organizationFeed(config, "unknown"), {});
  assert.deepEqual(organizationFeed(config, "toString"), {});
  assert.notEqual(
    organizationFeed(config, "org_b").url,
    organizationFeed(config, "org_a").url,
  );
});
