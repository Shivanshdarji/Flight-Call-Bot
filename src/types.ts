export interface AlternativeFlight {
  code: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  stops: number;
  stopLocation?: string;
  seatsAvailable: number;
  type: 'Direct Flight' | '1 Stop';
  origin: string;
  destination: string;
}

export interface Flight {
  code: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  departureTime: string;
  date: string;
  status: 'Cancelled' | 'Delayed' | 'Confirmed';
  reason?: string;
  /** Backend flight ID — used to fetch alternatives */
  flightId?: string;
}

export type ReasonCategory =
  | 'weather'
  | 'technical'
  | 'crew'
  | 'atc'
  | 'passenger_initiated'
  | 'security'
  | 'connection_impact'
  | 'special_assistance'
  | 'frustration'
  | 'ambiguous';

export interface Booking {
  pnr: string;
  lastName: string;
  originalFlight: Flight;
  selectedFlight?: AlternativeFlight;
  refundAmount: number;
  refundStatus: 'Not Requested' | 'Processing' | 'Completed' | 'Refunded';
  disruptionType?: string;
  /** Extended fields populated from backend */
  fareClass?: string;
  refundable?: boolean;
  reasonCategory?: ReasonCategory;
  requiresEscalation?: boolean;
  compensationEligible?: boolean;
  voucherAmount?: number;
  passengerName?: string;
}

export interface Eligibility {
  refundable: boolean;
  amount: number;
  voucherAmount: number;
  freeRebook: boolean;
  policy: string;
  requiresEscalation: boolean;
  reasonCategory: ReasonCategory;
}

export type ScreenState = 'login' | 'lookup' | 'dashboard' | 'disrupted' | 'rebook' | 'confirmation' | 'refund_eligible' | 'new_booking';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  chips?: string[];
  isVoice?: boolean;
}

export interface BotClassifyResponse {
  intent: string;
  confidence: number;
  matchedKeywords: string[];
  requiresEscalation: boolean;
  escalationReason: string;
  reasonCategory: ReasonCategory;
  pnr: string;
}

export interface BotRespondResponse {
  responseText: string;
  chips: string[];
  escalate: boolean;
  eligibility?: Eligibility;
}

export interface EscalationTicket {
  ticketId: string;
  pnr: string;
  status: 'queued_for_agent';
  queuePosition: number;
  estimatedWaitMinutes: number;
  callbackAvailable: boolean;
}
