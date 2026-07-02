import { Router } from 'express';
import { fullLookup } from '../db.js';
import { classifyIntent } from '../services/intentClassifier.js';
import { shouldEscalate, generateEscalationTicket } from '../services/escalationRules.js';
import { getEligibility } from '../services/eligibilityEngine.js';

const router = Router();

// Track low-confidence counts per session (keyed by PNR for simplicity)
const sessionState = {};

/**
 * POST /api/bot/classify
 * Body: { pnr, message }
 * Returns: { intent, confidence, requiresEscalation, reasonCategory, matchedKeywords }
 */
router.post('/classify', (req, res) => {
  const { pnr, message } = req.body;
  if (!pnr || !message) {
    return res.status(400).json({ error: 'pnr and message are required.' });
  }

  const data = fullLookup(pnr);
  if (!data) return res.status(404).json({ error: 'Booking not found.' });

  const { booking, disruption } = data;
  const { intent, confidence, matchedKeywords } = classifyIntent(message);

  // Track low-confidence count for this session
  if (!sessionState[pnr]) sessionState[pnr] = { lowConfidenceCount: 0 };
  if (confidence < 0.5) {
    sessionState[pnr].lowConfidenceCount++;
  } else {
    sessionState[pnr].lowConfidenceCount = 0; // reset on good match
  }

  const { shouldEscalate: escalate, reason: escalationReason } = shouldEscalate({
    message,
    intent,
    confidence,
    reasonCategory:  disruption.reasonCategory,
    securityRelated: disruption.securityRelated,
    lowConfidenceCount: sessionState[pnr].lowConfidenceCount,
  });

  return res.json({
    intent,
    confidence,
    matchedKeywords,
    requiresEscalation: escalate,
    escalationReason,
    reasonCategory: disruption.reasonCategory,
    pnr,
  });
});

/**
 * POST /api/bot/respond
 * Body: { pnr, intent }
 * Returns: { responseText, chips, escalate, eligibility? }
 */
router.post('/respond', (req, res) => {
  const { pnr, intent } = req.body;
  if (!pnr || !intent) {
    return res.status(400).json({ error: 'pnr and intent are required.' });
  }

  const data = fullLookup(pnr);
  if (!data) return res.status(404).json({ error: 'Booking not found.' });

  const { booking, passenger, flight, disruption } = data;
  const eligibility = getEligibility({
    reasonCategory: disruption.reasonCategory,
    refundable: booking.refundable,
    refundAmount: disruption.refundAmount,
    voucherAmount: disruption.voucherAmount,
    securityRelated: disruption.securityRelated,
  });

  let responseText = '';
  let chips = [];
  let escalate = eligibility.requiresEscalation;

  const flightCode = flight.flightNumber;
  const route = `${flight.origin}→${flight.destination}`;
  const firstName = passenger.firstName;
  const amount = disruption.refundAmount;
  const cat = disruption.reasonCategory;

  switch (intent) {
    case 'greeting':
      responseText = `Hello ${firstName}! I'm your SkyJet Recovery Assistant. Flight ${flightCode} (${route}) has been cancelled. I'm here to help resolve this quickly for you.`;
      chips = ['What happened?', 'Rebook my flight', 'Check refund eligibility'];
      break;

    case 'check_status':
      responseText = `Flight ${flightCode} from ${flight.originName} to ${flight.destinationName} was cancelled. Reason: ${disruption.reasonText}`;
      chips = ['Rebook my flight', 'Check refund eligibility', 'What am I eligible for?'];
      break;

    case 'rebook':
      if (eligibility.freeRebook) {
        responseText = `Great news — free rebooking is available for you. I can see 3 alternative flights on your route (${route}). Your seat will be protected at no extra cost.`;
        chips = ['See rebooking options', 'Check refund eligibility'];
      } else {
        responseText = `Rebooking options are available, though your fare class may involve fees. Let me connect you with an agent to find the best option for you.`;
        chips = ['Talk to an agent'];
        escalate = true;
      }
      break;

    case 'refund':
      if (eligibility.refundable) {
        responseText = `Yes, you're eligible for a full refund of $${amount.toFixed(2)} — ${cat === 'technical' || cat === 'crew' ? 'this is an airline-caused disruption' : 'per our disruption policy'}. Would you like to request it now?`;
        chips = ['Yes, request refund', 'See rebooking options instead'];
      } else {
        responseText = cat === 'passenger_initiated'
          ? `Your booking was cancelled at your request with a non-refundable fare. Unfortunately a monetary refund is not available under your fare rules. I can check if any credit options apply.`
          : `Your disruption category (${cat}) qualifies for free rebooking. A cash refund is available only if you decline all rebooking alternatives.`;
        chips = cat === 'passenger_initiated' ? ['Talk to an agent', 'Check rebooking options'] : ['See rebooking options', 'I still want a refund'];
      }
      break;

    case 'eligibility':
      responseText = `Here's your eligibility summary: ${eligibility.policy}${eligibility.voucherAmount > 0 ? ` You also have a $${eligibility.voucherAmount.toFixed(0)} meal voucher available.` : ''}`;
      chips = eligibility.refundable
        ? ['Request refund ($' + amount.toFixed(0) + ')', 'See rebooking options']
        : ['See rebooking options', 'Talk to an agent'];
      break;

    case 'voucher':
      if (eligibility.voucherAmount > 0) {
        responseText = `A complimentary $${eligibility.voucherAmount.toFixed(0)} meal voucher is available to you. It will appear in your dashboard after rebooking is confirmed, with a QR code valid at any airport terminal restaurant.`;
        chips = ['See rebooking options', 'Check refund eligibility'];
      } else {
        responseText = `Meal vouchers are not available for your disruption type (${cat}). You may still be eligible for rebooking or a refund.`;
        chips = ['Check refund eligibility', 'See rebooking options'];
      }
      break;

    case 'complaint':
      responseText = `${firstName}, I completely understand your frustration and I sincerely apologize for this disruption. Your experience matters to us. Let me connect you with a specialist agent who can personally address your concerns and compensation.`;
      chips = ['Connect to agent'];
      escalate = true;
      break;

    case 'special_need':
      responseText = `I see you have special assistance requirements registered. I want to make sure you receive proper care — I'm connecting you immediately with a dedicated specialist who will personally coordinate everything for you.`;
      chips = ['Connect to agent now'];
      escalate = true;
      break;

    case 'connection':
      responseText = `I can see your itinerary has connecting segments that are also affected. This requires specialist coordination to protect your entire journey. Connecting you to an agent now.`;
      chips = ['Connect to agent'];
      escalate = true;
      break;

    case 'escalate_request':
      responseText = `Absolutely, ${firstName}. I'll connect you with a human agent right away. Your ticket is being created and an agent will be with you shortly.`;
      chips = ['Connect to agent'];
      escalate = true;
      break;

    case 'confirm':
      responseText = `Perfect. I'll proceed with that for you now.`;
      chips = ['See rebooking options', 'Request refund'];
      break;

    case 'decline':
      responseText = `No problem. What else can I help you with? You can still explore rebooking or refund options.`;
      chips = ['Rebook my flight', 'Check refund eligibility', 'Talk to an agent'];
      break;

    default:
      responseText = `I want to make sure I give you the right help. Could you clarify — are you looking to rebook your flight, request a refund, or understand your options?`;
      chips = ['Rebook my flight', 'Check refund eligibility', 'What am I eligible for?'];
  }

  return res.json({ responseText, chips, escalate, eligibility });
});

/**
 * POST /api/bot/escalate
 * Body: { pnr, transcript: string[] }
 * Returns: { ticketId, status, queuePosition, estimatedWaitMinutes, callbackAvailable }
 */
router.post('/escalate', (req, res) => {
  const { pnr, transcript = [] } = req.body;
  if (!pnr) return res.status(400).json({ error: 'pnr is required.' });

  // Clear session state on escalation
  delete sessionState[pnr];

  const ticket = generateEscalationTicket(pnr, transcript);
  return res.json(ticket);
});

export default router;
