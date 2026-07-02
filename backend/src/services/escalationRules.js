/**
 * Escalation Rules Engine — rule-based (keyword + scenario flags + low-confidence fallback).
 * Source: challenge-1-plan-v2.md Section 2 & Section 3.
 *
 * "We automate the routine 60-70% of disruption calls — clear-cut cancellations with standard
 *  remedies. We escalate anything safety-sensitive, emotionally charged, or structurally complex."
 */

import { ESCALATION_INTENTS } from './intentClassifier.js';

// Hard keyword triggers that always escalate, regardless of scenario
const HARD_ESCALATION_KEYWORDS = [
  'medical', 'minor', 'unaccompanied', 'wheelchair', 'special assistance',
  'connecting flight', 'connection', 'multiple flights',
  'unacceptable', 'furious', 'compensation', 'lawsuit', 'complaint', 'sue', 'legal',
  'outrageous', 'disgusting', 'shocking', 'not good enough',
];

// Scenario categories that always escalate
const ALWAYS_ESCALATE_CATEGORIES = new Set([
  'security',
  'connection_impact',
  'special_assistance',
]);

/**
 * Determine if escalation should be triggered.
 *
 * @param {Object} params
 * @param {string} params.message - Raw passenger message
 * @param {string} params.intent - Classified intent
 * @param {number} params.confidence - Intent confidence score
 * @param {string} params.reasonCategory - Booking disruption reason category
 * @param {boolean} params.securityRelated - Flag from seed data
 * @param {number} params.lowConfidenceCount - How many times confidence was low in this session
 * @returns {{ shouldEscalate: boolean, reason: string }}
 */
export function shouldEscalate({ message, intent, confidence, reasonCategory, securityRelated, lowConfidenceCount = 0 }) {
  const normalizedMsg = (message || '').toLowerCase();

  // Rule 1: Scenario flag from seed data — security always escalates
  if (securityRelated || ALWAYS_ESCALATE_CATEGORIES.has(reasonCategory)) {
    return {
      shouldEscalate: true,
      reason: `Scenario type '${reasonCategory}' requires human agent — policy enforced.`,
    };
  }

  // Rule 2: Intent-level escalation triggers
  if (ESCALATION_INTENTS.has(intent)) {
    return {
      shouldEscalate: true,
      reason: `Intent '${intent}' detected — connecting to a specialist.`,
    };
  }

  // Rule 3: Hard keyword match in raw message
  const triggeredKeyword = HARD_ESCALATION_KEYWORDS.find(kw => normalizedMsg.includes(kw));
  if (triggeredKeyword) {
    return {
      shouldEscalate: true,
      reason: `Sensitive keyword detected ("${triggeredKeyword}") — transferring to human agent.`,
    };
  }

  // Rule 4: Low-confidence fallback — if bot can't classify twice in a row
  if (lowConfidenceCount >= 2 && confidence < 0.5) {
    return {
      shouldEscalate: true,
      reason: 'Unable to confidently understand your request after two attempts — connecting you to an agent.',
    };
  }

  return { shouldEscalate: false, reason: '' };
}

/**
 * Generate the handoff payload for escalation.
 * @param {string} pnr
 * @param {string[]} transcript
 * @returns {{ ticketId, status, queuePosition, estimatedWaitMinutes, callbackAvailable }}
 */
export function generateEscalationTicket(pnr, transcript = []) {
  const ticketId = `ESC-${pnr}-${Date.now().toString(36).toUpperCase()}`;
  const queuePosition = Math.floor(Math.random() * 4) + 1; // 1-4
  const estimatedWaitMinutes = queuePosition * 3 + Math.floor(Math.random() * 3);

  return {
    ticketId,
    pnr,
    status: 'queued_for_agent',
    queuePosition,
    estimatedWaitMinutes,
    callbackAvailable: true,
    transcriptLength: transcript.length,
    createdAt: new Date().toISOString(),
  };
}
