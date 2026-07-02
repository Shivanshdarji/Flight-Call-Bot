# Project Updates Log
**Date:** July 2, 2026

This document contains a comprehensive log of every update, feature, and fix implemented during the SkyJet Recovery hackathon project build phase.

## 1. Backend Architecture & API (Node.js/Express)
- **Framework Pivot:** Transitioned the backend architecture from the initially planned Python/FastAPI to **Node.js/Express** to match the team's stack and avoid native module (SQLite) build issues on Windows.
- **In-Memory Store:** Implemented a robust in-memory database (`db.js`) initialized from `seed.json` upon server start, providing instant, reliable data fetching for the demo without local database dependencies.
- **REST Endpoints Built:**
  - `POST /api/auth/lookup`: Secure lookup via PNR + Last Name. Returns full booking, passenger, flight, and disruption context.
  - `GET /api/bookings/:pnr`: Fetches detailed booking state.
  - `GET /api/bookings/:pnr/eligibility`: Dynamically calculates refund and voucher eligibility based on disruption reasons.
  - `POST /api/bookings/:pnr/rebook`: In-memory mutation to simulate booking an alternative flight.
  - `POST /api/bookings/:pnr/cancel-and-refund`: In-memory mutation simulating the refund process.
  - `GET /api/flights/:id/alternatives`: Returns 3 mock alternative flight options based on the disrupted flight's route.
- **Bot/AI Endpoints Built:**
  - `POST /api/bot/classify`: Analyzes user message intent.
  - `POST /api/bot/respond`: Generates a dynamic response based on the intent, passenger details, and scenario context.
  - `POST /api/bot/escalate`: Simulates the creation of a human-agent escalation ticket.

## 2. Business Logic & Services
- **10-Scenario Matrix:** Created a comprehensive `seed.json` containing 10 distinct PNRs, covering every matrix row (Weather, Technical, Crew, Passenger-Initiated, Security, Special Assistance, Frustration, Ambiguous).
- **Eligibility Engine (`eligibilityEngine.js`):** Encoded airline policy rules. E.g., technical faults grant meal vouchers and full refunds, while weather events offer free rebooking but no immediate cash refund unless alternatives are declined.
- **Intent Classifier (`intentClassifier.js`):** Built a local keyword and pattern matching engine to map raw user text (e.g., "I want my money back") to structural intents (e.g., `refund`).
  - *Bug Fix:* Implemented exact word-boundary regex mapping to prevent substring false positives (e.g., preventing "rebook" from incorrectly triggering the "ok" confirmation intent).
- **Escalation Rules (`escalationRules.js`):** Implemented a robust 3-tier escalation strategy:
  1. **Keyword Triggers:** Instantly escalates on sensitive words (`sue`, `compensation`, `unacceptable`, `wheelchair`).
  2. **Scenario Flags:** Hardcoded escalation for scenarios like "Security" or "Special Assistance", regardless of the user's message.
  3. **Confidence Fallback:** Escalates automatically if the bot fails to classify intent with >50% confidence twice in a single session.

## 3. Frontend Development & Integration (React/Vite)
- **Vite Proxy configuration:** Updated `vite.config.ts` to proxy `/api/*` traffic directly to the Express backend on port `8000`.
- **App.tsx State Management:** Replaced static demo data with live backend `fetch` calls. The app now handles loading states and captures lookup errors gracefully.
- **Call Bot Widget (`CallBotWidget.tsx`):** Built a brand new, floating voice-enabled bot interface.
  - Utilizes the browser's native **Web Speech API** for both Speech-To-Text (microphone input) and Text-To-Speech (reading responses back).
  - Includes a "Simulated Queue" UI for when a conversation escalates to a human agent, showing estimated wait times and queue position.
  - Implements a chip-based click fallback for environments where microphones are disabled or unavailable.
- **Lookup Screen Enhancement:** Added 10 colored "Demo Scenario Pills" at the bottom of the lookup screen. Clicking a pill instantly fills the PNR and Last Name fields to drastically speed up live hackathon demos.
- **Rebook Screen Fixes:** Wired the `RebookScreen` to fetch live alternative flights from the backend. 
  - *Bug Fix:* Resolved a crash in `App.tsx` where the `booking` prop was missing when navigating to the Rebook Screen.

## 4. Documentation Updates
- Created `docs/api-docs.md`: Fully documented all Express REST and Bot API endpoints, request bodies, and JSON responses.
- Created `docs/scenario-matrix.md`: Exported the 10-scenario decision matrix into a markdown table specifically formatted for copying into the final presentation deck.
- Updated `challenge-1-plan-v2.md`: Marked the project status as "Fully Built & Integrated", corrected the repository directory tree, and mapped out the final steps required for the hackathon submission (deck, video, docs).
