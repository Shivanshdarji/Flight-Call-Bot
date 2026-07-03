# API Documentation

This document contains specifications for the REST API endpoints defined in the **Flight-Call-Bot** system.

### Integration Status Warning
> [!IMPORTANT]
> **Endpoint Implementation Details:**
> - Only the chatbot decision and classification endpoints (`/api/bot/*`) are defined in the backend routing file ([bot.js](file:///d:/Projects/Flight-Call-Bot/backend/src/routes/bot.js)). 
> - Due to the missing files (`db.js`, `intentClassifier.js`, `eligibilityEngine.js` in `backend/src`), the Express server cannot start successfully.
> - The core passenger lookup, rebooking, and refund logic is simulated entirely on the client side (`src/App.tsx` and `src/mockData.ts`). Below is the documentation for the endpoints as defined in the source code.

---

## 1. Bot & Conversational Endpoints

These endpoints are declared in [backend/src/routes/bot.js](file:///d:/Projects/Flight-Call-Bot/backend/src/routes/bot.js).

### Classify Intent
* **Path:** `/api/bot/classify`
* **Method:** `POST`
* **Description:** Analyzes a passenger's text message to classify their intent, calculate confidence, check for keyword-based escalations, and retrieve disruption reason categories.
* **Request Header:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "pnr": "SJR8X9",
  "message": "I want a refund for my cancelled flight"
}
```
* **Success Response (200 OK):**
```json
{
  "intent": "refund",
  "confidence": 0.95,
  "matchedKeywords": ["refund"],
  "requiresEscalation": false,
  "escalationReason": "",
  "reasonCategory": "weather",
  "pnr": "SJR8X9"
}
```
* **Error Response (400 Bad Request):**
```json
{
  "error": "pnr and message are required."
}
```
* **Error Response (404 Not Found):**
```json
{
  "error": "Booking not found."
}
```

---

### Generate Bot Response
* **Path:** `/api/bot/respond`
* **Method:** `POST`
* **Description:** Generates a personalized text response and quick-reply action chips based on the classified passenger intent, active PNR details, and disruption policies.
* **Request Header:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "pnr": "SJR8X9",
  "intent": "refund"
}
```
* **Success Response (200 OK):**
```json
{
  "responseText": "Yes, you're eligible for a full refund of $450.00 — per our disruption policy. Would you like to request it now?",
  "chips": [
    "Yes, request refund",
    "See rebooking options instead"
  ],
  "escalate": false,
  "eligibility": {
    "refundable": true,
    "amount": 450.00,
    "voucherAmount": 30.00,
    "freeRebook": true,
    "policy": "Free rebooking available. Refund only if you decline all alternatives.",
    "requiresEscalation": false,
    "reasonCategory": "weather"
  }
}
```
* **Error Response (400 Bad Request):**
```json
{
  "error": "pnr and intent are required."
}
```

---

### Request Agent Escalation
* **Path:** `/api/bot/escalate`
* **Method:** `POST`
* **Description:** Simulates the creation of a human support agent escalation ticket and returns real-time queue position metrics for the user interface.
* **Request Header:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "pnr": "SJR8X9",
  "transcript": [
    "User: Flight cancelled. Help.",
    "Bot: What can I help you with?",
    "User: Connect me to a real agent please."
  ]
}
```
* **Success Response (200 OK):**
```json
{
  "ticketId": "ESC-SJR8X9-K8J2LM3",
  "pnr": "SJR8X9",
  "status": "queued_for_agent",
  "queuePosition": 3,
  "estimatedWaitMinutes": 10,
  "callbackAvailable": true,
  "transcriptLength": 3,
  "createdAt": "2026-07-03T10:08:55Z"
}
```
* **Error Response (400 Bad Request):**
```json
{
  "error": "pnr is required."
}
```

---

## 2. Inactive/Designed REST Endpoints

The following REST endpoints are documented in [api-docs.md](file:///d:/Projects/Flight-Call-Bot/docs/api-docs.md) but are **mocked on the client side** (`src/App.tsx` and `src/components/RebookScreen.tsx`). They represent the target integrations for a production backend.

### Check Flight Alternatives
* **Path:** `/api/flights/:id/alternatives`
* **Method:** `GET`
* **Description:** Fetches alternative flight options for a disrupted flight route.
* **Response Shape (200 OK):**
```json
{
  "flightId": "SJ402",
  "alternatives": [
    {
      "code": "SJ512",
      "departureTime": "14:30",
      "arrivalTime": "22:15",
      "date": "Today",
      "duration": "7h 45m",
      "stops": 0,
      "seatsAvailable": 12,
      "type": "Direct Flight",
      "origin": "LHR",
      "destination": "JFK"
    }
  ]
}
```

### Guest Flight Lookup
* **Path:** `/api/auth/lookup`
* **Method:** `POST`
* **Description:** Authenticates a guest request using a PNR and Last Name.
* **Response Shape (200 OK):**
```json
{
  "booking": { "pnr": "SJR8X9", "lastName": "Smith", "refundAmount": 450.00, "refundStatus": "Not Requested" },
  "passenger": { "firstName": "James", "lastName": "Smith" },
  "flight": { "code": "SJ402", "status": "Cancelled" },
  "disruption": { "reasonCategory": "weather", "refundAmount": 450.00 }
}
```

### Get Booking Eligibility
* **Path:** `/api/bookings/:pnr/eligibility`
* **Method:** `GET`
* **Response Shape (200 OK):**
```json
{
  "refundable": true,
  "amount": 450.00,
  "voucherAmount": 30.00,
  "freeRebook": true,
  "policy": "Free rebooking available...",
  "requiresEscalation": false,
  "reasonCategory": "weather"
}
```

### Confirm Flight Rebooking
* **Path:** `/api/bookings/:pnr/rebook`
* **Method:** `POST`
* **Request:** `{ "newFlightCode": "SJ512" }`
* **Response Shape (200 OK):**
```json
{
  "success": true,
  "booking": { "pnr": "SJR8X9", "selectedFlight": { "code": "SJ512" } },
  "message": "Rebooking confirmed successfully."
}
```

### Process Cancel & Refund
* **Path:** `/api/bookings/:pnr/cancel-and-refund`
* **Method:** `POST`
* **Response Shape (200 OK):**
```json
{
  "success": true,
  "refundStatus": "Processing",
  "refundAmount": 450.00,
  "message": "Refund processed successfully."
}
```
