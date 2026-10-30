import { randomUUID } from "node:crypto";
import {
  ApiError,
  hash,
  type Actor,
  type CompletionInput,
  type EnquiryInput,
} from "./model";
export type Row = Record<string, unknown>;
export interface Sql {
  query<T extends Row = Row>(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
}
export type InWorkspace = <T>(
  actor: Actor,
  fn: (sql: Sql, workspaceId: string) => Promise<T>,
) => Promise<T>;
const receipt = (row: Row, replayed = false) => ({
  id: row.id,
  createdAt: row.created_at,
  replayed,
});
export class Repository {
  constructor(private readonly tx: InWorkspace) {}
  private async audit(
    sql: Sql,
    w: string,
    a: Actor,
    action: string,
    id: unknown,
  ) {
    await sql.query(
      "insert into ck_api.audit_events(workspace_id,actor,action,resource_id) values($1,$2,$3,$4)",
      [w, a.id, action, id],
    );
  }
  async companies(a: Actor, limit: number, offset: number) {
    return this.tx(
      a,
      async (sql, w) =>
        (
          await sql.query(
            "select id,business_name,industry,location,website,business_phone,business_email,summary,provenance,source,verification_status,financing_need_status,updated_at from ck_api.companies where workspace_id=$1 order by updated_at desc,id limit $2 offset $3",
            [w, limit, offset],
          )
        ).rows,
    );
  }
  async enqueue(
    a: Actor,
    kind: "discovery" | "enrichment",
    input: Row,
    key: string,
  ) {
    return this.tx(a, async (sql, w) => {
      let jobInput = input;
      if (kind === "enrichment") {
        const company = (
          await sql.query(
            "select id,source_key,business_name,industry,location,website from ck_api.companies where workspace_id=$1 and id=$2",
            [w, input.companyId],
          )
        ).rows[0];
        if (!company)
          throw new ApiError(404, "NOT_FOUND", "Company not found.");
        jobInput = {
          companyId: company.id,
          sourceKey: company.source_key,
          businessName: company.business_name,
          industry: company.industry,
          location: company.location,
          website: company.website,
        };
      }
      const fingerprint = hash({ kind, input });
      const added = (
        await sql.query(
          "insert into ck_api.jobs(workspace_id,kind,input,idempotency_key,payload_hash,created_by) values($1,$2,$3::jsonb,$4,$5,$6) on conflict(workspace_id,idempotency_key) do nothing returning id,status,created_at",
          [w, kind, JSON.stringify(jobInput), key, fingerprint, a.id],
        )
      ).rows[0];
      if (added) {
        await this.audit(sql, w, a, "job.created", added.id);
        return { ...receipt(added), status: added.status };
      }
      const prior = (
        await sql.query(
          "select id,status,created_at,payload_hash from ck_api.jobs where workspace_id=$1 and idempotency_key=$2",
          [w, key],
        )
      ).rows[0];
      if (!prior || prior.payload_hash !== fingerprint)
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "This key was already used for a different request.",
        );
      return { ...receipt(prior, true), status: prior.status };
    });
  }
  async job(a: Actor, id: string) {
    return this.tx(a, async (sql, w) => {
      const row = (
        await sql.query(
          "select id,kind,status,attempts,result_count,error_code,created_at,updated_at from ck_api.jobs where workspace_id=$1 and id=$2",
          [w, id],
        )
      ).rows[0];
      if (!row) throw new ApiError(404, "NOT_FOUND", "Job not found.");
      return row;
    });
  }
  async claim(a: Actor) {
    return this.tx(a, async (sql, w) => {
      await sql.query(
        "update ck_api.jobs set status='failed',error_code='LEASE_EXPIRED',updated_at=now() where workspace_id=$1 and status='running' and lease_until<=now() and attempts>=3",
        [w],
      );
      const row = (
        await sql.query(
          "select id from ck_api.jobs where workspace_id=$1 and attempts<3 and (status='queued' or (status='running' and lease_until<=now())) order by created_at,id for update skip locked limit 1",
          [w],
        )
      ).rows[0];
      if (!row) return null;
      const job = (
        await sql.query(
          "update ck_api.jobs set status='running',run_id=$3,lease_until=now()+interval '5 minutes',attempts=attempts+1,updated_at=now() where workspace_id=$1 and id=$2 returning id,kind,input,run_id,lease_until",
          [w, row.id, randomUUID()],
        )
      ).rows[0];
      await this.audit(sql, w, a, "job.claimed", row.id);
      return job;
    });
  }
  async complete(a: Actor, id: string, result: CompletionInput) {
    return this.tx(a, async (sql, w) => {
      const job = (
        await sql.query(
          "select * from ck_api.jobs where workspace_id=$1 and id=$2 and status='running' and run_id=$3 and lease_until>now() for update",
          [w, id, result.runId],
        )
      ).rows[0];
      if (!job)
        throw new ApiError(
          409,
          "LEASE_INVALID",
          "Job is unavailable or its lease expired.",
        );
      if (result.status === "failed") {
        const status = Number(job.attempts) < 3 ? "queued" : "failed";
        await sql.query(
          "update ck_api.jobs set status=$3,error_code=$4,lease_until=null,run_id=null,updated_at=now() where workspace_id=$1 and id=$2",
          [w, id, status, result.errorCode],
        );
        await this.audit(sql, w, a, "job.attempt_failed", id);
        return { id, status };
      }
      const input = job.input as Row;
      if (
        (job.kind === "discovery" &&
          result.companies.length > Number(input.limit)) ||
        (job.kind === "enrichment" &&
          (result.companies.length !== 1 ||
            result.companies[0].sourceKey !== input.sourceKey))
      )
        throw new ApiError(
          400,
          "INVALID_RESULT",
          "CLI results do not match the claimed job.",
        );
      for (const c of result.companies) {
        const params = [
          w,
          c.sourceKey,
          c.businessName,
          c.industry,
          c.location,
          c.website ?? null,
          JSON.stringify(c.provenance),
          id,
          c.businessPhone ?? null,
          c.businessEmail ?? null,
          c.summary ?? null,
        ];
        if (job.kind === "enrichment")
          await sql.query(
            "update ck_api.companies set business_name=$3,industry=$4,location=$5,website=$6,provenance=$7::jsonb,last_job_id=$8,business_phone=coalesce($9,business_phone),business_email=coalesce($10,business_email),summary=coalesce($11,summary),updated_at=now() where workspace_id=$1 and source_key=$2",
            params,
          );
        else
          await sql.query(
            "insert into ck_api.companies(workspace_id,source_key,business_name,industry,location,website,provenance,last_job_id,business_phone,business_email,summary) values($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11) on conflict(workspace_id,source_key) do update set business_name=excluded.business_name,industry=excluded.industry,location=excluded.location,website=excluded.website,provenance=excluded.provenance,last_job_id=excluded.last_job_id,business_phone=coalesce(excluded.business_phone,ck_api.companies.business_phone),business_email=coalesce(excluded.business_email,ck_api.companies.business_email),summary=coalesce(excluded.summary,ck_api.companies.summary),updated_at=now()",
            params,
          );
      }
      await sql.query(
        "update ck_api.jobs set status='succeeded',result_count=$3,error_code=null,lease_until=null,updated_at=now() where workspace_id=$1 and id=$2",
        [w, id, result.companies.length],
      );
      await this.audit(sql, w, a, "job.succeeded", id);
      return { id, status: "succeeded", resultCount: result.companies.length };
    });
  }
  async enquiryReceipt(a: Actor, key: string, fingerprint: string) {
    return this.tx(a, async (sql, w) => {
      const row = (
        await sql.query(
          "select id,created_at,payload_hash from ck_api.funding_enquiries where workspace_id=$1 and idempotency_key=$2",
          [w, key],
        )
      ).rows[0];
      if (!row) return null;
      if (row.payload_hash !== fingerprint)
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "This key was already used for a different request.",
        );
      return receipt(row, true);
    });
  }
  async submitEnquiry(
    a: Actor,
    input: EnquiryInput,
    key: string,
    privacyVersion: string,
  ) {
    return this.tx(a, async (sql, w) => {
      const fingerprint = hash(input);
      const row = (
        await sql.query(
          `insert into ck_api.funding_enquiries(workspace_id,business_name,contact_name,email,phone,province,purpose,amount_cad,timeline,consent_to_contact,consent_to_refer,privacy_version,attribution,source,idempotency_key,payload_hash) values($1,$2,$3,$4,$5,$6,$7,$8,$9,true,$10,$11,$12::jsonb,$13,$14,$15) on conflict(workspace_id,idempotency_key) do nothing returning id,created_at`,
          [
            w,
            input.businessName,
            input.contactName,
            input.email,
            input.phone ?? null,
            input.province,
            input.purpose ?? null,
            input.amountCad ?? null,
            input.timeline ?? null,
            input.consentToRefer,
            privacyVersion,
            JSON.stringify(input.attribution),
            a.kind === "intake" ? "inbound_web" : "operator_intake",
            key,
            fingerprint,
          ],
        )
      ).rows[0];
      if (row) {
        await this.audit(sql, w, a, "enquiry.received", row.id);
        return receipt(row);
      }
      const prior = (
        await sql.query(
          "select id,created_at,payload_hash from ck_api.funding_enquiries where workspace_id=$1 and idempotency_key=$2",
          [w, key],
        )
      ).rows[0];
      if (!prior || prior.payload_hash !== fingerprint)
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "This key was already used for a different request.",
        );
      return receipt(prior, true);
    });
  }
  async enquiries(a: Actor, limit: number, offset: number, id?: string) {
    return this.tx(a, async (sql, w) => {
      const result = await sql.query(
        "select id,business_name,contact_name,email,phone,province,purpose,amount_cad,timeline,consent_to_contact,consent_to_refer,consent_at,privacy_version,source,status,reviewer_note,reviewed_by,reviewed_at,created_at from ck_api.funding_enquiries where workspace_id=$1" +
          (id
            ? " and id=$2"
            : " order by created_at desc,id limit $2 offset $3"),
        id ? [w, id] : [w, limit, offset],
      );
      if (id && !result.rows.length)
        throw new ApiError(404, "NOT_FOUND", "Enquiry not found.");
      return id ? result.rows[0] : result.rows;
    });
  }
  async updateDetails(
    a: Actor,
    id: string,
    input: { purpose?: string; amountCad?: number; timeline?: string },
  ) {
    return this.tx(a, async (sql, w) => {
      const found = (
        await sql.query(
          "select id from ck_api.funding_enquiries where workspace_id=$1 and id=$2 for update",
          [w, id],
        )
      ).rows[0];
      if (!found) throw new ApiError(404, "NOT_FOUND", "Enquiry not found.");
      await sql.query(
        "update ck_api.funding_enquiries set purpose=coalesce($3,purpose),amount_cad=coalesce($4,amount_cad),timeline=coalesce($5,timeline),status='needs_information',reviewer_note=null,reviewed_by=null,reviewed_at=null where workspace_id=$1 and id=$2",
        [
          w,
          id,
          input.purpose ?? null,
          input.amountCad ?? null,
          input.timeline ?? null,
        ],
      );
      await sql.query(
        "update ck_api.opportunities set status='closed' where workspace_id=$1 and enquiry_id=$2",
        [w, id],
      );
      await this.audit(sql, w, a, "enquiry.details_updated", id);
      return { id, status: "needs_information", reviewRequired: true };
    });
  }
  async qualify(a: Actor, id: string, decision: string, note: string) {
    return this.tx(a, async (sql, w) => {
      const enquiry = (
        await sql.query(
          "select * from ck_api.funding_enquiries where workspace_id=$1 and id=$2 for update",
          [w, id],
        )
      ).rows[0];
      if (!enquiry) throw new ApiError(404, "NOT_FOUND", "Enquiry not found.");
      if (
        decision === "ready_for_review" &&
        (!enquiry.amount_cad || !enquiry.purpose || !enquiry.timeline)
      )
        throw new ApiError(
          409,
          "DETAILS_REQUIRED",
          "Funding amount, purpose and timeline are required for broker review.",
        );
      await sql.query(
        "update ck_api.funding_enquiries set status=$3,reviewer_note=$4,reviewed_by=$5,reviewed_at=now() where workspace_id=$1 and id=$2",
        [w, id, decision, note, a.id],
      );
      if (decision === "ready_for_review")
        await sql.query(
          "insert into ck_api.opportunities(workspace_id,enquiry_id,owner_interest_confirmed,review_note,created_by) values($1,$2,true,$3,$4) on conflict(workspace_id,enquiry_id) do update set status='needs_broker_review',review_note=excluded.review_note",
          [w, id, note, a.id],
        );
      else
        await sql.query(
          "update ck_api.opportunities set status='closed' where workspace_id=$1 and enquiry_id=$2",
          [w, id],
        );
      await this.audit(sql, w, a, "enquiry." + decision, id);
      return { id, status: decision, financingApproval: false };
    });
  }
  async opportunities(a: Actor, limit: number, offset: number) {
    return this.tx(
      a,
      async (sql, w) =>
        (
          await sql.query(
            "select id,company_id,enquiry_id,status,owner_interest_confirmed,review_note,reviewed_sources,created_by,created_at from ck_api.opportunities where workspace_id=$1 order by created_at desc,id limit $2 offset $3",
            [w, limit, offset],
          )
        ).rows,
    );
  }
  async promote(
    a: Actor,
    input: {
      companyId: string;
      conversationNote: string;
      reviewedSources: string[];
    },
    key: string,
  ) {
    return this.tx(a, async (sql, w) => {
      const company = (
        await sql.query(
          "select id from ck_api.companies where workspace_id=$1 and id=$2",
          [w, input.companyId],
        )
      ).rows[0];
      if (!company) throw new ApiError(404, "NOT_FOUND", "Company not found.");
      const fingerprint = hash(input);
      const row = (
        await sql.query(
          "insert into ck_api.opportunities(workspace_id,company_id,owner_interest_confirmed,review_note,reviewed_sources,created_by,idempotency_key,payload_hash) values($1,$2,true,$3,$4::jsonb,$5,$6,$7) on conflict do nothing returning id,created_at",
          [
            w,
            input.companyId,
            input.conversationNote,
            JSON.stringify(input.reviewedSources),
            a.id,
            key,
            fingerprint,
          ],
        )
      ).rows[0];
      if (row) {
        await sql.query(
          "update ck_api.companies set financing_need_status='owner_confirmed' where workspace_id=$1 and id=$2",
          [w, input.companyId],
        );
        await this.audit(sql, w, a, "opportunity.created", row.id);
        return receipt(row);
      }
      const prior = (
        await sql.query(
          "select id,created_at,payload_hash from ck_api.opportunities where workspace_id=$1 and idempotency_key=$2",
          [w, key],
        )
      ).rows[0];
      if (!prior || prior.payload_hash !== fingerprint)
        throw new ApiError(
          409,
          "CONFLICT",
          "An opportunity or different request already exists.",
        );
      return receipt(prior, true);
    });
  }
}
