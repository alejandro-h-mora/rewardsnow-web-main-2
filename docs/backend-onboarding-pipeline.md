# Backend pipeline: trial onboarding, revenue-share pricing, public/private visibility

This document is the handoff spec for the backend changes needed to support work
already shipped on the frontend (`rewardsnow-web-main-2`). The frontend now calls
several endpoints that **do not exist yet** — those calls are written defensively
(they no-op / fail silently and the UI updates optimistically) so the screens are
reviewable today, but nothing persists until this is implemented.

Base API convention already in use: `https://<host>/api/v1`, JSON bodies,
`Authorization: Bearer <token>` for authenticated calls. Match that.

---

## 1. What changed and why

Three product changes, all centered on the business side of onboarding:

1. **Trial period before going public.** A newly-approved business is no longer
   immediately live. It enters a trial, invisible to customers, until it clears
   three requirements: tax documents, at least one employee account, and a
   written bio. Only after an admin reviews and approves that does the business
   (a) get real pricing and (b) get the option to go public.
2. **Revenue-share pricing, not flat fee.** The old `$100/$190/$250 per month`
   tiers are gone from the registration UI. Pricing is now a percentage of
   revenue, derived from the submitted tax documents and set by an admin at
   approval time. The three "tiers" that remain (Standard / Premium / Custom
   Rewards) now only select *feature flags* (`paidPartner`, `uniqueRewardsPoint`),
   not a price.
3. **Business-controlled public/private visibility.** Once a business clears the
   trial, the owner can toggle their own listing between `PUBLIC` and `PRIVATE`
   at will (e.g. to pause new customers without leaving the network). This is
   independent of the trial/admin-review status — it's the owner's switch, but
   it's only unlocked after admin approval.

Additionally, customers can now browse `/map`, `/businesses`, and `/business`
without an account (`/signin` is no longer required to view listings — only to
redeem rewards). That part needs no backend change: it's a frontend routing
change, but it does mean **the public business-list/map endpoints must filter out
`PRIVATE` businesses** once `visibility` exists (see §3).

---

## 2. Data model changes

### 2.1 `Business` table — new columns

| Column | Type | Default | Notes |
|---|---|---|---|
| `onboarding_status` | enum: `TRIAL`, `PENDING_REVIEW`, `APPROVED` | `TRIAL` | Set to `TRIAL` the moment a `BusinessRequest` is approved (replaces "immediately live"). |
| `visibility` | enum: `PRIVATE`, `PUBLIC` | `PRIVATE` | Owner-controlled. Server must reject a transition to `PUBLIC` unless `onboarding_status = APPROVED`. |
| `tax_documents_submitted` | boolean | `false` | Set true when at least one file exists in `tax_document` (§2.3). |
| `business_bio` | text, nullable | `null` | Free text, shown on the public listing once `visibility = PUBLIC`. Frontend enforces a 40-character minimum client-side; enforce server-side too. |
| `pricing_percent` | decimal(5,2), nullable | `null` | Revenue-share percentage. Set by admin only, during approval. Null until then. |
| `onboarding_submitted_at` | timestamp, nullable | `null` | When the owner submitted the trial for review. |
| `onboarding_approved_at` | timestamp, nullable | `null` | When an admin approved it. |
| `onboarding_reviewed_by` | FK → admin user, nullable | `null` | Audit trail. |

Employee infrastructure readiness is **derived**, not stored: `employee_infrastructure_ready = COUNT(employees WHERE business_id = ? AND active = true) > 0`. Don't duplicate that as a column — compute it in the `GET /businesses/:id/onboarding` response (§3.1).

### 2.2 `BusinessRequest` table (existing "pending requests" flow)

No schema change. Keep `requesting_paid_partner`, `requesting_unique_rewards_point` as-is — they still map 1:1 to the tier the owner picked at signup and become `Business.paid_partner` / `Business.unique_rewards_point` on approval, same as today. The only behavioral change: **approving a request now sets `onboarding_status = TRIAL` and `visibility = PRIVATE`** instead of making the business immediately live/public. `POST /business-requests/:id/approve` keeps its existing contract; just change what it does internally.

### 2.3 New table: `tax_document`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid/PK | |
| `business_id` | FK → business | |
| `file_key` | string | Object storage key (S3/R2/etc.) — do not store files in the DB. |
| `original_filename` | string | For display (`trial.taxDocumentFileName` in the UI). |
| `content_type` | string | Validate against an allowlist server-side: PDF, PNG, JPEG (matches the frontend's `accept=".pdf,.png,.jpg,.jpeg"`). |
| `uploaded_at` | timestamp | |
| `uploaded_by` | FK → business account | |

Keep history (don't overwrite on re-upload) — an admin reviewing a trial should be able to see what was actually submitted. `tax_documents_submitted` on `Business` is just "at least one row exists."

**Handling:** these are sensitive financial documents. Store in private object storage (not public bucket), generate short-lived signed URLs for admin review, encrypt at rest if your storage layer supports it, and restrict read access to the business's own account and admin roles only.

---

## 3. New/changed API endpoints

All under `/api/v1`. `:id` is the business ID (`account.businessId` in the frontend).

### 3.1 `GET /businesses/:id/onboarding`
Auth: business account bearer token, must own `:id`.

Returns the shape `BusinessOwnerDashboard.js` already expects from `fetchTrial()`:

```json
{
  "status": "TRIAL",
  "visibility": "PRIVATE",
  "taxDocumentsSubmitted": false,
  "taxDocumentFileName": null,
  "businessBio": "",
  "pricingPercent": null
}
```

`status` ∈ `TRIAL | PENDING_REVIEW | APPROVED`. `taxDocumentFileName` is the most recent upload's `original_filename`, or `null`.

### 3.2 `POST /businesses/:id/tax-documents`
Auth: business account bearer token, must own `:id`. `multipart/form-data`, field name `taxDocument` (matches `handleTaxUpload` in `BusinessOwnerDashboard.js`).

- Validate content-type/size (suggest a 15 MB cap).
- Insert a `tax_document` row, set `Business.tax_documents_submitted = true`.
- 413 on oversized file, 415 on bad content-type, 200 with the new file's metadata on success.

### 3.3 `PATCH /businesses/:id/bio`
Auth: business account bearer token, must own `:id`. Body: `{ "businessBio": string }`.

- Reject (`400`) if `onboarding_status = APPROVED` **and** `visibility = PUBLIC` and the new bio is empty — a live listing shouldn't lose its bio. Otherwise allow edits at any stage (owners should be able to keep the bio current after going public too).
- Enforce the same 40-character minimum the frontend checks, server-side.

### 3.4 `POST /businesses/:id/onboarding/submit`
Auth: business account bearer token, must own `:id`. No body.

- 409 if `onboarding_status != TRIAL` (already submitted or already approved — don't let a resubmit clobber an in-review or approved state).
- 422 if requirements aren't actually met (`tax_documents_submitted` false, no active employees, or `business_bio` under the length minimum) — **re-validate server-side**, don't trust the frontend's `trialRequirementsMet` gate.
- On success: `onboarding_status = PENDING_REVIEW`, `onboarding_submitted_at = now()`. Notify admins (however your existing `business-requests/pending` review queue currently notifies — reuse that channel).

### 3.5 `PATCH /businesses/:id/visibility`
Auth: business account bearer token, must own `:id`. Body: `{ "visibility": "PUBLIC" | "PRIVATE" }`.

- 409 if `onboarding_status != APPROVED` — this is the hard rule from the product ask ("businesses must match certain criteria... before... they go public"). Enforce it here even though the frontend also disables the toggle client-side.
- Otherwise just set the column and return the new state.

### 3.6 Admin review — extend the existing approval flow

You already have `GET /business-requests/pending` and `POST /business-requests/:id/approve` for the *initial* signup request. Add a **second** queue for trial completion:

- **`GET /businesses/pending-trial-review`** (admin auth) — list businesses where `onboarding_status = PENDING_REVIEW`, including `tax_documents_submitted`, the employee count, `business_bio`, and signed URLs for each `tax_document` row so the admin can actually review the filing before setting a price.
- **`POST /businesses/:id/onboarding/approve`** (admin auth). Body: `{ "pricingPercent": number }`.
  - 422 if `onboarding_status != PENDING_REVIEW`.
  - 422 if `pricingPercent` isn't a sane percentage (suggest `0 < x <= 100`, but confirm the real ceiling with whoever owns pricing policy).
  - Sets `onboarding_status = APPROVED`, `pricing_percent`, `onboarding_approved_at = now()`, `onboarding_reviewed_by = <admin id>`. Does **not** change `visibility` — that stays `PRIVATE` until the owner flips it themselves (§3.5). Notify the business owner (email) that they're clear to go public.
  - Optional but recommended: **`POST /businesses/:id/onboarding/reject`** with a reason string, setting `onboarding_status` back to `TRIAL` so they can fix and resubmit, rather than only supporting a binary approve.

This second queue is spec'd here but **the admin-side UI for it hasn't been built yet** on the frontend — `AdminDashboard.js` currently only has the original "Pending requests" (signup) tab. That's a follow-up frontend task once these endpoints exist; flag it back to whoever's driving frontend next.

### 3.7 Public listing endpoints — filter by visibility

`GET /businesses` and `GET /businesses/search` (used by `BusinessList.js`, `BusinessMap.js`, now reachable without login) must **exclude** any business where `visibility != PUBLIC`, **except** when the request is authenticated as that business's own owner/employee account (so the owner can still preview their own private listing from their own dashboard, if that's a screen you want later — not currently built). Simplest correct behavior for now: public/unauthenticated requests to these two endpoints only ever see `visibility = PUBLIC` rows.

`GET /businesses/:id` (business detail) and `GET /businesses/:id/services` — same rule: 404 (not 403, don't leak existence) for an unauthenticated request against a `PRIVATE` business. `BusinessDetail.js` already handles its business object coming from the caller's own state (selected off the list), but a direct/deep-linked fetch must still enforce this, since the detail route is also now reachable without login.

---

## 4. Migration / rollout plan

1. **Schema migration** — add the columns in §2.1 and the `tax_document` table (§2.3). Backfill existing live businesses: set `onboarding_status = APPROVED`, `visibility = PUBLIC`, `pricing_percent = <whatever their current flat-fee-equivalent is, or null if pricing hasn't been decided for existing accounts>`. **Do not silently unpublish everyone who's already live** — the trial gate is for new signups from here forward, not retroactive.
2. **Ship §3.1–3.5** (owner-facing trial endpoints) behind the existing bearer-auth business account middleware. These are additive and don't affect the current live/approved businesses at all, since those are pre-set to `APPROVED`/`PUBLIC` in the backfill.
3. **Change `POST /business-requests/:id/approve`** (§2.2) to set `TRIAL`/`PRIVATE` instead of going live immediately. This is the one behavior change that affects the *existing* flow — coordinate the deploy with frontend so a business doesn't approve into a trial state with no UI yet to act on it (frontend for §3.1–3.5 is already shipped as of this doc, so this should be safe to do second).
4. **Ship §3.7** (visibility filtering on public endpoints) — do this **before or atomically with** step 3, not after, so there's never a window where a `TRIAL`/`PRIVATE` business is publicly visible.
5. **Ship §3.6** (admin trial-review queue) whenever the admin UI for it is built. Until then, you can approve trials by hand via direct DB access or an internal-only script — just make sure `pricing_percent` gets set, since §3.5 and the owner dashboard both assume `onboarding_status = APPROVED` implies a real price exists.

---

## 5. Out of scope / explicitly not handled here

- **Billing integration** (actually charging the revenue-share percentage against real transaction volume) — this doc only covers *setting* `pricing_percent`, not collecting it. That's a separate payments workstream.
- **Admin UI for §3.6** — spec'd, not built. Flag as a frontend follow-up.
- **Re-verification** (e.g., re-checking tax documents annually, or triggering a re-review if revenue changes materially) — not asked for, not included.
- **Notifications/emails** — referenced above ("notify admins", "notify the business owner") but not spec'd in detail; reuse whatever transactional email system already sends the existing approval emails from `BusinessRegister.js`'s "you'll get an email" copy.
