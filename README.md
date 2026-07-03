# Flight-Call-Bot — Self-Service Flight Recovery
### 22North Product Engineering Challenge 2026 — Challenge 1: Self-Service Flight Recovery

**Team Name:** Hack Hustlers  
**College:** Sardar Vallabhbhai Patel Institute of Technology (SVPIT), Vasad  
**Team Members:** Jaydev Prajapati, Shivansh Darji  
**Target Customer:** SkyJet Airways (Regional carrier, 65 aircraft in Asia)  
**Live Demo:** [flight-call-bot.onrender.com](https://flight-call-bot.onrender.com/)  
**GitHub Repository:** [github.com/Shivanshdarji/Flight-Call-Bot](https://github.com/Shivanshdarji/Flight-Call-Bot)  

---

## 1. Project Overview
During flight cancellations and delays, airlines experience massive call surges. For SkyJet, **40% of affected passengers** call the support center, generating average wait times of **25 minutes**. 

`Flight-Call-Bot` is an automated, voice-enabled web portal that resolves routine disruptions in seconds. By automating the rebooking and refund processing for **60-70%** of cases, it frees up live human agents for high-value customer care. The voice interface uses the browser's native **Web Speech API** for English and Hindi text-to-speech / speech-to-text, providing a phone-like support call experience directly inside the browser.

---

## 2. Technology Stack
The application is built using the following clean, modern stack:
* **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4 (`@tailwindcss/vite`), Motion (micro-animations), and Lucide React (icons).
* **AI & Voice Services:** OpenAI JS SDK (`gpt-4o-mini` with custom system prompts and function calling) and native browser **Web Speech API** (`SpeechRecognition` & `SpeechSynthesis`).
* **Backend Skeleton:** Node.js, Express 4, Cors, Dotenv (routing structure present in `backend/src/routes/bot.js` and `backend/src/services/escalationRules.js`).

---

## 3. Installation & Run Instructions

To run the application locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivanshdarji/Flight-Call-Bot.git
   cd Flight-Call-Bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 4. Test Credentials & Demo Scenarios
To assist judges in evaluating the recovery flows, we have included 10 pre-configured **Demo Scenario Pills** at the bottom of the Lookup Screen. Clicking a pill automatically fills in the corresponding booking details.

Here are 3 concrete walk-through scenarios to test:

### Scenario A: Weather Cancellation (Automated Recovery)
* **Demo Pill / Credentials:** Click `🌩️ Weather` (Prefills PNR: `SJR8X9`, Last Name: `Smith`)
* **Context:** Flight SJ402 (LHR ➔ JFK) cancelled due to severe weather.
* **Test Walk-through:**
  1. Click **Check My Flight**. You will see the disrupted segment details.
  2. Click **See Options** or click the floating **Chat Widget** in the bottom-right and speak: *"Can I rebook my flight?"*
  3. Select one of the 3 alternative flights (e.g., SJ512, SJ824, or SJ904).
  4. Confirm the booking. You will see a success confirmation and your updated status on the Dashboard.

### Scenario B: Technical Fault (Refund/Voucher Eligibility)
* **Demo Pill / Credentials:** Click `🔧 Technical Fault` (Prefills PNR: `SJT1M4`, Last Name: `Johnson` / mock data search: `Doe`)
* **Context:** Flight SJ505 cancelled due to a technical aircraft issue (airline-caused).
* **Test Walk-through:**
  1. Click **Check My Flight**.
  2. Click **Check Refund & Voucher Eligibility**. 
  3. The system displays policy eligibility: a **Full Refund** is available, along with a **$50 complimentary meal voucher** due to the technical delay.
  4. Click **Request Refund**. The refund status will update to `Refunded`.

### Scenario C: Special Assistance Needed (Human Agent Escalation)
* **Demo Pill / Credentials:** Click `♿ Special Assist` (Prefills PNR: `SJM7U9`, Last Name: `Moore`)
* **Context:** Passenger has registered special assistance requirements (wheelchair support).
* **Test Walk-through:**
  1. Click **Check My Flight**.
  2. Click the floating **Chat Widget** in the bottom-right to open the voice assistant.
  3. The chatbot reads the user's special assistance profile and triggers immediate escalation to a human agent, transitioning the chat status to "Human Agent - Connecting..." and initiating a simulated agent queue countdown.

---

## 5. Known Limitations
* **Client-Side Simulation:** The Express server code in the repository is partial and relies on missing modules (`db.js`, `intentClassifier.js`, `eligibilityEngine.js` are not present in this commit). Therefore, the frontend runs in a standalone client-side mock state using `src/mockData.ts` to manage all data lookups and state transitions.
* **API Key Exposure:** The OpenAI API is queried directly from the browser for demo purposes. In production, these calls must be proxied through a secure backend server to protect keys.
* **Payment & GDS Mocks:** Refunds and ticket rebookings are simulated locally; they are not linked to real payment gateways or Global Distribution System (GDS) inventories.
* **Single-Passenger PNRs:** The application does not currently support multi-passenger bookings or complex split-PNR itineraries.

---

## 6. Future Enhancements
1. **Secure Backend Proxy:** Build the missing database and intent classifier files to make the Express server functional and move the OpenAI calls server-side.
2. **Twilio Voice Integration:** Connect the conversational logic to Twilio Voice (using WebRTC or SIP) to enable customers to call a real telephone number and speak to the assistant directly.
3. **Relational Database:** Replace the JSON/in-memory mocks with PostgreSQL to store passenger accounts, persistent escalation tickets, and history transcripts.
4. **Agent Desk Dashboard:** Build a real-time web portal for human agents to claim escalated tickets and chat directly with passengers.

---

## 7. AI Tools Disclosure
In compliance with the 22North Product Engineering Challenge rules, the team discloses the use of the following AI tools for development assistance, code generation, and repository documentation:
* **Cursor** (Code editor and layout wiring)
* **Claude 3.5 Sonnet** (Code structuring and logic refactoring)
* **Antigravity** (Deliverables documentation, architectural analysis, and submission packaging)
