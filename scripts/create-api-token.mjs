import { createHash, randomBytes } from "node:crypto";
const [id, orgId, scopeText, expiresAt] = process.argv.slice(2);
const allowed = [
  "companies:read",
  "discovery:write",
  "enrichment:write",
  "jobs:read",
  "jobs:work",
  "enquiries:read",
  "enquiries:write",
  "enquiries:qualify",
  "opportunities:read",
  "opportunities:write",
];
const scopes = (scopeText || "").split(",");
if (
  !/^ck_[A-Za-z0-9_-]{1,50}$/.test(id || "") ||
  !/^org_[A-Za-z0-9_-]+$/.test(orgId || "") ||
  !scopes.length ||
  !scopes.every((s) => allowed.includes(s)) ||
  !Number.isFinite(Date.parse(expiresAt)) ||
  Date.parse(expiresAt) <= Date.now()
)
  throw Error(
    "Usage: node scripts/create-api-token.mjs ck_ID org_ID scope1,scope2 FUTURE_ISO_EXPIRY",
  );
const token = `${id}.${randomBytes(32).toString("base64url")}`;
console.log(
  "Store this token securely on the client; it is shown once:\n" + token,
);
console.log(
  "\nMerge this public ID and hash entry into server CK_API_TOKENS_JSON:\n" +
    JSON.stringify(
      {
        [id]: {
          sha256: createHash("sha256").update(token).digest("hex"),
          clerkOrgId: orgId,
          scopes,
          expiresAt,
        },
      },
      null,
      2,
    ),
);
