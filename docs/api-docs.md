# SkyJet Recovery — API Documentation

## Base URL
- **Development**: `http://localhost:8000` (Express) — proxied via Vite at `/api/*`
- **Production**: `https://your-backend.railway.app`

---

## Authentication & Lookup

### `POST /api/auth/lookup`
Look up a booking by PNR and last name.

**Request:**
```json
{ "pnr": "SJR8X9", "lastName": "Smith" }
```
**Response 200:**
```json
{
  "booking":    { "id": "B001", "pnr": "SJR8X9", "status": "cancelled", "fareClass": "Economy", "refundable": true, ... },
  "passenger":  { "id": "P001", "firstName": "James", "lastName": "Smith", ... },
  "flight":     { "id": "F001", "flightNumber": "SJ402", "origin": "LHR", "destination": "JFK", "scheduledDeparture": "...", "status": "Cancelled", ... },
  "disruption": { "id": "D001", "reasonCategory": "weather", "reasonText": "...", "compensationEligible": false, "requiresEscalation": false, "refundAmount": 450.00, ... }
}
```
**Errors:** `400` missing fields · `404` not found

---

## Bookings

### `GET /api/bookings/:pnr`
Full booking detail (same shape as lookup).

### `GET /api/bookings/:pnr/eligibility`
**Response 200:**
```json
{
  "refundable": true,
  "amount": 450.00,
  "voucherAmount": 30.00,
  "freeRebook": true,
  "policy": "Free rebooking available. Refund only if you decline all alternatives.",
  "requiresEscalation": false,
  "reasonCategory": "weather"
}
```

### `POST /api/bookings/:pnr/rebook`
**Request:** `{ "newFlightCode": "SJ404" }`  
**Response 200:** `{ "success": true, "booking": {...}, "message": "..." }`

### `POST /api/bookings/:pnr/cancel-and-refund`
Simulated — no real payment.  
**Response 200:** `{ "success": true, "refundStatus": "Processing", "refundAmount": 450.00, "message": "..." }`

---

## Flights

### `GET /api/flights/:id/alternatives`
Returns 3 alternative flights for a disrupted flight.

**Response 200:**
```json
{
  "flightId": "F001",
  "alternatives": [
    { "code": "SJ404", "departureTime": "2:30 PM", "arrivalTime": "5:15 PM", "date": "Jul 3, 2026", "duration": "7h 45m", "stops": 0, "seatsAvailable": 12, "type": "Direct Flight", "origin": "LHR", "destination": "JFK" },
    ...
  ]
}
```

---

## Bot Endpoints

### `POST /api/bot/classify`
Classify a passenger message.

**Request:** `{ "pnr": "SJR8X9", "message": "I want a refund" }`  
**Response 200:**
```json
{
  "intent": "refund",
  "confidence": 0.92,
  "matchedKeywords": ["refund"],
  "requiresEscalation": false,
  "escalationReason": "",
  "reasonCategory": "weather",
  "pnr": "SJR8X9"
}
```

### `POST /api/bot/respond`
Get a scenario-aware bot response.

**Request:** `{ "pnr": "SJR8X9", "intent": "refund" }`  
**Response 200:**
```json
{
  "responseText": "Yes, you're eligible for a full refund of $450.00...",
  "chips": ["Yes, request refund", "See rebooking options instead"],
  "escalate": false,
  "eligibility": { ... }
}
```

### `POST /api/bot/escalate`
Create an agent escalation ticket.

**Request:** `{ "pnr": "SJR8X9", "transcript": ["message1", "message2"] }`  
**Response 200:**
```json
{
  "ticketId": "ESC-SJR8X9-ABC123",
  "pnr": "SJR8X9",
  "status": "queued_for_agent",
  "queuePosition": 2,
  "estimatedWaitMinutes": 7,
  "callbackAvailable": true,
  "createdAt": "2026-07-03T10:30:00Z"
}
```

---

## Health Check

### `GET /api/health`
**Response:** `{ "status": "ok", "timestamp": "..." }`
