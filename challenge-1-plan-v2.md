# Challenge 1 — Self-Service Flight Recovery
## Pre-Build Plan v2 | 22North Product Engineering Challenge 2026

**Deadline:** Fri 03-Jul-2026, 12:00 PM IST — **under 24 hours from now**
**Team:** 2 members
**Stack:** Node.js/Express (backend) + React/TypeScript (frontend, Stitch AI-generated UI, wired in Cursor)
**Deploy:** Render or Railway (backend) + Vercel (frontend)

**Status:** ✅ Fully Built & Integrated. The Node.js/Express backend, React frontend, and Web Speech API Call Bot are fully complete, wired, and verified with all 10 disruption scenarios.

---

## 1. Scope — What We're Actually Building

**Core journey (already built in UI):**
Lookup → Disrupted status → Rebook / Refund eligibility → Confirmation → Dashboard

**New addition — Call Bot:**
A voice-enabled self-service assistant that handles a flight-cancellation support "call" end-to-end for the majority of cases, escalating to a human agent only when the case is genuinely critical. This is your headline differentiator for Innovation (20%) and Business Understanding (15%) — it's literally what Phonon/22North sells.

**Explicit scope decision (state this in your deck — judges are told to look for exactly this kind of reasoning):**
- Voice I/O is built using the **browser's Web Speech API** (SpeechRecognition for STT, SpeechSynthesis for TTS) — a genuine voice experience in the demo, without needing telephony infrastructure.
- Production path (documented, not built): Twilio Voice (or similar) for real PSTN calls, a cloud STT/TTS provider, and the same intent-classification + business-rule engine you're building now sitting behind it. This shows you understand what "real" looks like without burning your remaining hours building infra you can't finish and can't reliably demo live anyway (phone infra is fragile to demo in person).

---

## 2. Call Bot — Scenario Matrix

The bot needs to convincingly handle a **spread of cancellation reasons**, not just one hardcoded case (your current seed data is a single weather-cancellation booking — expand this). Each scenario should map to a different bot response and a different eligibility outcome, so the demo shows range, not a scripted single path.

| # | Cancellation Reason | Bot Response Pattern | Refund/Voucher Eligibility | Escalate to Agent? |
|---|---|---|---|---|
| 1 | Weather (airline-side "force majeure" but airline still offers rebooking) | Apologize, offer rebooking + meal voucher | Rebooking free; refund only if passenger declines all alternatives | No |
| 2 | Technical/maintenance fault | Apologize, offer rebooking, note this is airline-fault | Full refund OR free rebooking, passenger's choice | No |
| 3 | Crew unavailability / scheduling | Same as technical fault | Full refund OR free rebooking | No |
| 4 | Air Traffic Control / airport restriction | Apologize, explain outside airline's control, offer rebooking | Free rebooking; refund per policy (simplify: treat like weather) | No |
| 5 | Passenger-initiated cancellation (not a true disruption) | Explain this isn't an airline cancellation, show fare rules | Refund per fare class (e.g., non-refundable ticket = no refund) | No — but if passenger disputes fare rules, escalate |
| 6 | Security/emergency-related cancellation | Apologize, prioritize immediate rebooking, no probing questions | Full refund OR rebooking | **Yes — always escalate** (safety-sensitive, keep human in loop) |
| 7 | Passenger has a connecting flight impacted | Bot checks downstream itinerary, offers protected rerouting | Case-by-case — **escalate** if multi-leg/multi-airline | **Yes** |
| 8 | Passenger mentions special assistance / unaccompanied minor / medical need | Bot acknowledges, does not attempt automated resolution | N/A | **Yes — always escalate** |
| 9 | Passenger expresses strong frustration/anger or explicit complaint about compensation amount | Bot de-escalates once, then hands off | N/A | **Yes — always escalate** |
| 10 | Ambiguous/unclear request the bot can't confidently classify | Bot asks one clarifying question; if still unclear, hands off | N/A | **Yes, after 1 clarification attempt** |

**Design principle to say out loud in your presentation:** *"We automate the routine 60-70% of disruption calls — clear-cut cancellations with standard remedies. We escalate anything safety-sensitive, emotionally charged, or structurally complex (multi-leg, disputes) — because that's where a human actually adds value, and getting that wrong erodes trust in the whole self-service system."* This single sentence answers the brief's own framing of the challenge ("decide which decisions should remain agent-assisted") better than any amount of extra code would.

**Escalation trigger logic (keep this simple and rule-based, not ML):**
- Keyword/intent match on: `medical`, `minor`, `unaccompanied`, `wheelchair`, `special assistance`, `connecting flight`, `multiple flights`, complaint/anger sentiment words (`unacceptable`, `furious`, `compensation`, `lawsuit`, `complaint`)
- Scenario type flag on seed data (`security_related: true`) forces escalation regardless of what the passenger says
- Fallback: if bot's intent-classification confidence is low twice in a row, escalate

---

## 3. Updated Architecture

```
┌──────────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│   React SPA            │  REST  │   Node.js / Express     │        │   SQLite / lowdb  │
│  (Stitch AI UI, built)  │ ─────▶│   Backend (rebuilding)   │ ─────▶│   (MVP data store) │
│  Vercel-hosted          │◀───── │   Render/Railway-hosted   │◀───── │                   │
└──────────────────────┘        └──────────────────────┘        └─────────────────┘
         │                                  │
         ▼                                  ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Call Bot Module       │        │  Escalation Engine      │
│  (Web Speech API STT/  │───────▶│  (rule-based intent +   │
│   TTS + existing intent│        │   sentiment/keyword     │
│   logic from ChatWidget)│        │   triggers)             │
└──────────────────────┘        └──────────────────────┘
                                            │
                                            ▼
                                  ┌──────────────────────┐
                                  │  "Talk to an Agent"     │
                                  │  handoff screen          │
                                  │  (simulated — shows       │
                                  │   queue position/callback │
                                  │   promise, not a real call)│
                                  └──────────────────────┘
```

- Keep it a monolith. One Express app, one lightweight DB (SQLite via `better-sqlite3`, or even `lowdb`/JSON file if time is tighter than expected — defensible for an MVP, say so explicitly).
- The Call Bot module wraps your existing `ChatWidget.tsx` intent logic — don't rebuild classification from scratch, extend it with voice I/O and the escalation rules above.

---

## 4. Data Model (Node/Express — same shape, updated for Node conventions)

**passengers**
`id, firstName, lastName, email, phone`

**bookings**
`id, pnr, passengerId, flightId, status (confirmed | cancelled | rebooked), fareClass, refundable (bool)`

**flights**
`id, flightNumber, origin, destination, scheduledDeparture, actualDeparture, status, aircraftCapacity`

**disruptionEvents**
`id, flightId, eventType (delay | cancellation), reasonCategory (weather | technical | crew | atc | passenger_initiated | security | connection_impact), delayMinutes, compensationEligible (bool), requiresEscalation (bool)`

**Seed 10 bookings/PNRs, one per scenario row in the matrix above** — this is what makes the demo feel real instead of a single rehearsed happy path. Reuse the existing frontend's mock booking shape (`Booking` type in `types.ts`) and just expand the seed array.

---

## 5. API Design (Node/Express)

```
POST   /api/auth/lookup              { pnr, lastName } → booking + flight status
GET    /api/bookings/:pnr            → full booking detail
GET    /api/flights/:id/alternatives → 3 suggested rebooking options
POST   /api/bookings/:pnr/rebook     { newFlightId } → confirms rebooking
GET    /api/bookings/:pnr/eligibility → refund/voucher eligibility + reason
POST   /api/bookings/:pnr/cancel-and-refund  (simulated, no real payment)

POST   /api/bot/classify             { pnr, message } → { intent, requiresEscalation, reasonCategory }
POST   /api/bot/respond              { pnr, intent } → { responseText, chips, escalate }
POST   /api/bot/escalate             { pnr, transcript } → { ticketId, status: 'queued_for_agent' }
```

Use `express-validator` or `zod` for request validation — quick to add, and "input validation" is a cheap, visible point under Engineering Quality (10%). Document these with a simple `openapi.yaml` or even a clearly written `api-docs.md` table — Node doesn't auto-generate Swagger the way FastAPI does, so budget 20-30 minutes for this explicitly, don't assume it's free like before.

---

## 6. Repo Structure (updated)

```
skyjet-recovery/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── bookings.js
│   │   │   ├── flights.js
│   │   │   └── bot.js
│   │   ├── services/
│   │   │   ├── eligibilityEngine.js
│   │   │   ├── intentClassifier.js
│   │   │   └── escalationRules.js
│   │   ├── data/
│   │   │   └── seed.json        (10 scenario bookings)
│   │   └── db.js
│   └── package.json
├── src/                         (Frontend React code)
│   └── components/
│       ├── CallBotWidget.tsx    (extends ChatWidget with voice I/O)
│       └── [Other screens].tsx
├── docs/
│   ├── api-docs.md
│   └── scenario-matrix.md       (the table from section 2)
├── package.json                 (Root config with dev/backend scripts)
└── README.md
```

---

## 7. Next Steps (Presentation Phase)

**Implementation is Complete:**
- The Express API and seed data (10 scenarios) are built.
- The `CallBotWidget` is integrated with Voice I/O and escalation rules.
- The React UI screens are successfully hooked up to the backend.

**Final Actions for the Hackathon Submission:**
- Record a 5-minute demo video — **show at least 3 different scenarios**, including one that escalates to the simulated agent.
- Finalize the 10-slide deck (the scenario matrix table should be its own slide — it's the strongest artifact).
- Write the solution doc: cover assumptions, trade-offs, and future work.
- Test deployed links (Render/Railway & Vercel) in incognito mode before submitting.

---

## 8. Presentation Deck Outline (10 slides max)

1. Problem statement (SkyJet's 40% call volume, 25-min wait)
2. Business impact if solved
3. Customer journey diagram
4. **Scenario matrix** — what we automate vs. escalate, and why (your strongest slide)
5. Architecture diagram (Node/Express + React + Call Bot module)
6. Live demo / embedded video showing 3+ scenarios
7. Key technical decisions (Web Speech API now, Twilio Voice as production path — say this explicitly)
8. Assumptions made
9. Trade-offs & what we deferred
10. Future enhancements

---

## 9. Assumptions to State Explicitly

- Voice I/O uses the browser's Web Speech API for the demo; production deployment would use Twilio Voice + a managed STT/TTS provider for real phone-call handling
- Escalation logic is rule-based (keyword + scenario flags), not ML-based sentiment analysis — documented as a "v2" enhancement
- Single-passenger PNRs only; no group bookings
- Flight/passenger data is seeded (10 scenarios), standing in for SkyJet's real APIs
- Compensation/refund rules are simplified per the matrix in Section 2; real airline policy involves more nuance (fare class rules, jurisdiction-specific compensation like EU261)
- No real payment processing (per challenge constraint)
- "Talk to an agent" handoff is simulated (shows a queued/callback state) — no real agent exists in this MVP

---

## 10. What Changed From v1 (for your own tracking)

- Backend: FastAPI/Python → **Node.js/Express** (matches what's actually built)
- Added: **Call Bot** with voice I/O (Web Speech API), extending the existing ChatWidget rather than replacing it
- Added: **10-scenario cancellation matrix** replacing the single hardcoded weather-cancellation booking, with explicit per-scenario escalation rules
- Scope guardrail added: voice I/O is browser-based for the demo, not real telephony — stated as a deliberate, defensible decision rather than a gap
