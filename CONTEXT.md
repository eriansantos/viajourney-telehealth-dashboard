# Via Journey Telehealth Dashboard — Session Context

> Use this document to resume development in any LLM session with full context.

---

## Project Overview

**Client:** Via Journey Telehealth — concierge telehealth practice based in Lakewood Ranch, Florida.
**Goal:** Build a clinical operations dashboard that pulls live data from external APIs and displays KPIs for leadership.
**Stack:** React + Vite (frontend) · Node.js/Express (backend API proxy) · Clerk (auth) · Vercel (frontend hosting) · Railway (backend hosting)

---

## Repositories

| Repo | URL | Hosting |
|------|-----|---------|
| Frontend | https://github.com/eriansantos/viajourney-telehealth-dashboard | Vercel |
| Backend | https://github.com/eriansantos/viajourney-telehealth-api | Railway |

**Live URLs:**
- Frontend (prod): https://viajourney-telehealth-dashboard.vercel.app
- Backend (prod): https://viajourney-telehealth-api-production.up.railway.app
- Local frontend: http://localhost:5173
- Local backend: http://localhost:3001

---

## Architecture Decisions

### Frontend
- React + Vite, single file dashboard: `src/ViaJourneyDashboard.jsx`
- Auth via `@clerk/clerk-react` — `SignedIn/SignedOut` gates in `src/App.jsx`
- Clerk appearance customized to Via Journey brand (green palette, Inter font)
- `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL` as env vars
- Local: `VITE_API_URL=http://localhost:3001`
- Production (Vercel): `VITE_API_URL=https://viajourney-telehealth-api-production.up.railway.app`

### Backend (`viajourney-telehealth-api`)
Architecture: `routes → controllers → services → transformers`

```
src/
├── index.js
├── config/index.js          # all env vars centralized
├── middleware/
│   ├── auth.js              # Clerk JWT verification on all /api/* routes
│   ├── validate.js          # query param validation
│   └── errorHandler.js      # centralized error handling
├── routes/
│   ├── index.js
│   └── elation.js
├── controllers/
│   └── elation.js
├── services/
│   └── elation.js           # raw Elation API calls + OAuth token cache
└── transformers/
    └── elation.js           # strips PII, aggregates metrics
```

**Key decisions:**
- No caching (real-time data)
- Clerk JWT verified on every request (401 if invalid)
- No patient PII ever reaches the frontend — transformer aggregates only
- `state` field not yet implemented (deferred — multi-state expansion planned)
- Timezone conversion removed — Elation timezone will be fixed at practice level (user will contact Elation support to change from PDT to Eastern)
- All API timestamps used as UTC until Elation timezone is corrected

---

## Authentication

**Clerk:**
- App name: Via Journey Telehealth
- Login methods: Email + Google
- `VITE_CLERK_PUBLISHABLE_KEY` = `pk_test_c3VwZXJiLXN3YW4tMTMuY2xlcmsuYWNjb3VudHMuZGV2JA`
- `CLERK_SECRET_KEY` = backend only (Railway env var), never in frontend code
- User name displayed in sidebar footer comes from Clerk (`useUser()`)
- Login screen shows Via Journey brand — logo placeholder "VJ" (real logo pending)

---

## Elation EHR Integration

**Environment:** Sandbox
**Auth:** OAuth2 client_credentials
**Sandbox base URL:** `https://sandbox.elationemr.com`
**Credentials (sandbox only):**
- Client ID: `hYBqC3CYjyFADj7z5d0KhnZvQ52medQsT8cOWHcc`
- Client Secret: `GUH8AqjeydqXeC0xNtkQBSAGILlcPoXYRr2IVeemhYwwla8yEkYaj34ew50oOOPjkGvWqsubvlFIkjWwefOQbPF2OeSFXyTPwOKl`

**Sandbox data:** 5 appointments, 1 physician (Andre de Souza e Melo), 1 practice location (ViaJourney Telehealth, Lakewood Ranch, FL)

**Known issue:** Elation sandbox practice timezone is set to PDT (Los Angeles) instead of Eastern. User will contact Elation support to correct. Backend does NOT convert timezones — uses UTC directly.

**Elation appointment fields available:**
```json
{
  "id": ...,
  "scheduled_date": "2026-03-02T21:15:00Z",
  "duration": 5,
  "reason": "48h",
  "mode": "IN_PERSON",  // or "VIDEO"
  "status": { "status": "Scheduled", "status_date": "..." },
  "patient": 144442190331905,
  "physician": 144048791879682,
  "practice": 144048787554308,
  "service_location": { "state": "FL", ... },
  "telehealth_details": null
}
```

**Active Elation endpoints in backend:**
- `GET /api/elation/visit-volume` — Module 2 data
- `GET /api/elation/physicians` — clinician list

---

## Dashboard Modules Status

### Module 2 — Visit Volume & Utilization (PRIORITY · Elation API)
**Status:** VALIDATED ✓

**Implemented KPIs:**
- Total appointments (live from Elation)
- Visits per clinician
- Visits per patient (repeat rate) — counts repeated patient IDs
- Peak hour (UTC, no timezone conversion)
- Peak day of week (UTC)
- Visits by type — Member / Concierge / One Time (donut, live from Elation `reason` field)
- Appointments by mode — IN_PERSON / VIDEO (donut chart)
- Appointments by status (bar chart, per-status colors)
- Appointments by hour (bar chart, multi-color)
- Appointments by day of week (bar chart, multi-color)
- Active clinicians table (name, credentials, active status, total appointments)

**Elation appointment types configured:**
- Member (abbr: MB, telehealth: true)
- Concierge (abbr: CG, telehealth: true)
- One Time (abbr: OT, telehealth: true)
- `reason` field maps directly to appointment type name

**Deferred:**
- Total visits broken down by daily / weekly / monthly (period selector — future)
- Visit volume by state — deferred (multi-state expansion planned)

### Module 3 — Access & Speed-to-Care (PRIORITY · Elation API)
**Status:** VALIDATED ✓

**Implemented KPIs:**
- Avg booking lead time (scheduled_date − created_date)
- Same-day booking rate %
- Cancellation rate %
- No-show rate % (Not Seen)
- Avg appointment duration (min)
- Total appointments
- Booking lead time distribution bar chart (Same day / 1-3 days / 4-7 days / 8+ days)

### Module 4 — Clinical Outcome Proxies (PRIORITY · Patient Forms)
**Status:** Not started. Depends on patient form data source (TBD).

### Module 5 — Membership & Retention (PRIORITY · Hint API)
**Status:** Not started. No Hint credentials yet.

### Module 6 — Revenue
**Status:** Not started. Source TBD.

### Module 7 — Patient Experience (Patient Forms)
**Status:** Not started. Depends on patient form data source (TBD).

### Module 8 — Language, Access & Equity (Elation API)
**Status:** Not started.

### Module 9 — Clinician Performance (Elation API)
**Status:** Not started.

### Module 10 — Support Load (RingCentral)
**Status:** Not started. No RingCentral credentials yet.

### Module 11 — Growth & Funnel (GoHighLevel)
**Status:** Not started. No GoHighLevel credentials yet.

### Module 12 — Compliance & Risk (Elation)
**Status:** Not started.

---

## Pending Decisions / Open Items

| Item | Status |
|------|--------|
| **Visits by type** (Member/Concierge/One-time) | User will define — comes from Elation `reason` field or Hint API |
| **Via Journey logo** | Replace "VJ" placeholder in sidebar and login screen |
| **Patient forms** | Where data is stored (Google Forms/Sheets? Typeform? Custom?) — affects Modules 4 and 7 |
| **Hint Health credentials** | Needed for Modules 5 and 6 |
| **GoHighLevel credentials** | Needed for Module 11 |
| **RingCentral credentials** | Needed for Module 10 |
| **Date range filter** | Removed for now — will add in future if needed |
| **Multi-state segmentation** | Deferred — `service_location.state` available in Elation when ready |
| **Elation timezone** | User will contact Elation support to change practice timezone to Eastern |
| **Module 2 validation** | DONE ✓ |
| **Deploy to Vercel/Railway** | Working locally only — user will signal when to deploy |

---

## Ground Rules Established

- **No deploy to Vercel or Railway** without explicit user signal
- **All development done locally** until user approves production deploy
- **No patient PII** in frontend — transformer layer aggregates only
- **All UI text in English** — no Portuguese in the dashboard
- **No descriptions/purpose text** on module headers (removed)
- **Date filter removed** from top bar
- **Logged-in user name** in sidebar footer comes from Clerk, not hardcoded
- **No timezone conversion** in backend — use UTC until Elation timezone is corrected

---

## How to Run Locally

```bash
# Frontend
cd ~/Projects/viajourney-telehealth-dashboard
npm run dev
# → http://localhost:5173

# Backend
cd ~/Projects/viajourney-telehealth-api
npm run dev
# → http://localhost:3001
```

---

## Next Steps (in order)

1. Finish validating Module 2
2. Define "Visits by type" (Member/Concierge/One-time)
3. Implement Module 3 — Access & Speed-to-Care (Elation)
4. Define patient forms data source (affects Modules 4 and 7)
5. Get Hint credentials → Module 5 (Membership & Retention)
6. Get GoHighLevel credentials → Module 11 (Growth & Funnel)
7. Get RingCentral credentials → Module 10 (Support Load)
8. Replace "VJ" with real Via Journey logo
9. Deploy backend to Railway + connect Vercel to Railway URL
