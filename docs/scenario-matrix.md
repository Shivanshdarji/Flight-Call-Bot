# SkyJet Recovery — Cancellation Scenario Matrix

> Source: challenge-1-plan-v2.md § 2 — locked as of 2026-07-02

| # | PNR | Passenger | Cancellation Reason | Bot Response Pattern | Refund/Voucher Eligibility | Escalate? |
|---|---|---|---|---|---|---|
| 1 | **SJR8X9** / Smith    | James Smith       | Weather (force majeure at JFK)        | Apologise, offer rebooking + meal voucher ($30) | Free rebooking; refund only if all alternatives declined | ❌ No |
| 2 | **SJT1M4** / Johnson  | Sarah Johnson     | Technical/maintenance fault           | Apologise, note airline fault, offer choice      | **Full refund OR free rebooking** (passenger's choice) + $50 voucher | ❌ No |
| 3 | **SJC2K7** / Williams | Michael Williams  | Crew unavailability / scheduling      | Same as technical fault                          | **Full refund OR free rebooking** + $30 voucher | ❌ No |
| 4 | **SJA3P8** / Brown    | Emily Brown       | Air Traffic Control / airspace issue  | Explain outside airline control, offer rebooking | Free rebooking; refund subject to fare rules (non-refundable) | ❌ No |
| 5 | **SJP4Q2** / Davis    | David Davis       | Passenger-initiated cancellation      | Explain fare rules; non-refundable applies       | No refund (non-refundable Economy); no voucher | ❌ No (unless passenger disputes — then escalate) |
| 6 | **SJS5R6** / Miller   | Jessica Miller    | Security/emergency-related            | Prioritise rebooking, no probing questions       | **Full refund OR priority rebooking** + $50 voucher | ✅ **Always escalate** |
| 7 | **SJX6T3** / Wilson   | Robert Wilson     | Connecting flight impact (multi-leg)  | Check downstream itinerary, offer rerouting      | Case-by-case — specialist required | ✅ **Escalate** (multi-leg) |
| 8 | **SJM7U9** / Moore    | Jennifer Moore    | Special assistance / wheelchair       | Acknowledge, do NOT attempt automated resolution | Specialist coordinates | ✅ **Always escalate** |
| 9 | **SJF8V5** / Taylor   | Christopher Taylor| Repeated frustration / anger          | De-escalate once, then hand off                  | Full refund or rebooking available | ✅ **Escalate** (on frustration keywords) |
| 10 | **SJU9W1** / Anderson | Amanda Anderson  | Ambiguous / under investigation       | Ask one clarifying question; hand off if unclear | TBD — free rebooking available now | ✅ **Escalate** after 1 failed clarification |

---

## Escalation Trigger Logic (rule-based, not ML)

**Keyword triggers** (any match → escalate):
`medical`, `minor`, `unaccompanied`, `wheelchair`, `special assistance`, `connecting flight`, `multiple flights`, `unacceptable`, `furious`, `compensation`, `lawsuit`, `complaint`, `sue`, `legal`, `outrageous`

**Scenario flags** (from seed data):
- `securityRelated: true` → always escalate regardless of message
- `reasonCategory: "security" | "connection_impact" | "special_assistance"` → always escalate

**Low-confidence fallback:**
If bot confidence < 0.5 for **2 consecutive** messages → escalate

---

## Design Principle (say this in the demo)

> *"We automate the routine 60-70% of disruption calls — clear-cut cancellations with standard remedies. We escalate anything safety-sensitive, emotionally charged, or structurally complex — because that's where a human actually adds value, and getting that wrong erodes trust in the whole self-service system."*
