import React, { useState, useEffect } from 'react';
import { Plane, Armchair, Headphones, Check, Loader2 } from 'lucide-react';
import { AlternativeFlight, Booking } from '../types';

interface RebookScreenProps {
  booking: Booking;
  onSelectFlight: (flight: AlternativeFlight) => void;
  onOpenChat: () => void;
  onGoBack: () => void;
}

// Hardcoded fallback alternatives (used when API is unavailable)
const FALLBACK_OPTIONS: AlternativeFlight[] = [
  { code: 'SJ512', departureTime: '14:30', arrivalTime: '22:15', date: 'Today',    duration: '7h 45m', stops: 0,                  seatsAvailable: 12, type: 'Direct Flight', origin: 'LHR', destination: 'JFK' },
  { code: 'SJ824', departureTime: '16:00', arrivalTime: '01:20', date: 'Tomorrow', duration: '9h 20m', stops: 1, stopLocation: 'BOS', seatsAvailable: 4,  type: '1 Stop',       origin: 'LHR', destination: 'JFK' },
  { code: 'SJ904', departureTime: '19:45', arrivalTime: '03:15', date: 'Tomorrow', duration: '7h 30m', stops: 0,                  seatsAvailable: 28, type: 'Direct Flight', origin: 'LHR', destination: 'JFK' },
];

export default function RebookScreen({ booking, onSelectFlight, onOpenChat, onGoBack }: RebookScreenProps) {
  const [options, setOptions]   = useState<AlternativeFlight[]>([]);
  const [loading, setLoading]   = useState(true);

  const flightId = booking.originalFlight.flightId;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    if (flightId) {
      fetch(`/api/flights/${flightId}/alternatives`)
        .then(r => r.json())
        .then(data => {
          if (!cancelled) {
            setOptions(data.alternatives?.length ? data.alternatives : FALLBACK_OPTIONS);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) { setOptions(FALLBACK_OPTIONS); setLoading(false); }
        });
    } else {
      setOptions(FALLBACK_OPTIONS);
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [flightId]);

  return (
    <div id="rebook-view" className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-10 py-8 animate-fade-in-up">
      {/* Stepper */}
      <div id="rebook-stepper-container" className="mb-12 flex items-center justify-center w-full max-w-2xl mx-auto">
        <div id="rebook-stepper-track" className="flex items-center w-full relative">
          <div id="stepper-step-1" className="flex flex-col items-center relative">
            <div id="step-1-circle" className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold text-sm z-10">
              <Check className="w-4.5 h-4.5 text-white" />
            </div>
            <span id="step-1-label" className="absolute top-10 font-medium text-xs text-on-surface-variant whitespace-nowrap">Flight Disrupted</span>
          </div>
          <div id="stepper-line-1" className="flex-grow h-1 bg-primary mx-2" />
          <div id="stepper-step-2" className="flex flex-col items-center relative">
            <div id="step-2-circle" className="w-8 h-8 rounded-full border-2 border-secondary-container bg-surface flex items-center justify-center font-bold text-sm text-on-surface z-10 ring-4 ring-secondary-container/15">2</div>
            <span id="step-2-label" className="absolute top-10 font-bold text-xs text-on-surface whitespace-nowrap">Option Selected</span>
          </div>
          <div id="stepper-line-2" className="flex-grow h-1 bg-surface-variant mx-2" />
          <div id="stepper-step-3" className="flex flex-col items-center relative">
            <div id="step-3-circle" className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-semibold text-sm z-10">3</div>
            <span id="step-3-label" className="absolute top-10 font-medium text-xs text-on-surface-variant whitespace-nowrap">Confirm</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div id="rebook-header" className="mb-8 text-center md:text-left mt-12">
        <h1 id="rebook-title" className="text-2xl md:text-3.5xl font-black text-primary">Choose a new flight.</h1>
        <p id="rebook-subtitle" className="text-sm text-on-surface-variant mt-2">
          {booking.originalFlight.origin} → {booking.originalFlight.destination} · Select an alternative to continue your journey.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-sm text-on-surface-variant">Finding available alternatives…</span>
        </div>
      )}

      {/* Flight Options */}
      {!loading && (
        <div id="rebook-options-list" className="flex flex-col gap-4">
          {options.map((flight, idx) => (
            <div
              key={flight.code}
              id={`flight-option-card-${idx}`}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 md:p-6 high-trust-shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div id={`option-info-${idx}`} className="flex-grow flex flex-col w-full md:w-auto">
                <div id={`option-badges-${idx}`} className="flex items-center gap-2 mb-3">
                  <span id={`badge-type-${idx}`} className="px-2.5 py-1 bg-surface-container-high rounded-sm text-on-surface font-semibold text-xs uppercase tracking-wider">
                    {flight.type}{flight.stopLocation ? ` (${flight.stopLocation})` : ''}
                  </span>
                  <span id={`badge-seats-${idx}`} className="font-semibold text-xs text-on-surface-variant flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-sm">
                    <Armchair className="w-3.5 h-3.5" />
                    {flight.seatsAvailable} Seats available
                  </span>
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-sm">{flight.date}</span>
                </div>

                <div id={`option-flight-times-${idx}`} className="flex items-center justify-between w-full md:max-w-md gap-4">
                  <div id={`option-origin-${idx}`} className="flex flex-col">
                    <span id={`option-dep-time-${idx}`} className="text-2xl font-extrabold text-primary">{flight.departureTime}</span>
                    <span id={`option-origin-code-${idx}`} className="text-xs font-semibold text-on-surface-variant uppercase">{flight.origin}</span>
                  </div>

                  <div id={`option-path-${idx}`} className="flex-grow flex flex-col items-center px-4">
                    <span id={`option-duration-${idx}`} className="text-xs font-semibold text-on-surface-variant/80 mb-1">{flight.duration}</span>
                    <div id={`option-line-container-${idx}`} className="w-full flex items-center">
                      <div className="h-px flex-grow border-t border-dashed border-outline-variant" />
                      <Plane className="w-4 h-4 text-outline/50 mx-2" />
                      <div className="h-px flex-grow border-t border-dashed border-outline-variant" />
                    </div>
                    {flight.stops > 0 && (
                      <span className="text-[10px] text-outline mt-1">via {flight.stopLocation}</span>
                    )}
                  </div>

                  <div id={`option-dest-${idx}`} className="flex flex-col text-right">
                    <span id={`option-arr-time-${idx}`} className="text-2xl font-extrabold text-primary">{flight.arrivalTime}</span>
                    <span id={`option-dest-code-${idx}`} className="text-xs font-semibold text-on-surface-variant uppercase">{flight.destination}</span>
                  </div>
                </div>
              </div>

              <div id={`option-btn-container-${idx}`} className="w-full md:w-auto mt-2 md:mt-0">
                <button
                  id={`btn-select-flight-${idx}`}
                  onClick={() => onSelectFlight(flight)}
                  className="w-full md:w-auto px-6 py-3 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-semibold rounded-lg shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div id="rebook-footer" className="mt-8 flex flex-col items-center gap-4 text-center">
        <button id="btn-rebook-go-back" onClick={onGoBack} className="text-sm font-semibold text-outline hover:text-primary transition-colors cursor-pointer">
          &larr; Go Back to Flight Details
        </button>
        <div id="rebook-speak-someone" className="text-sm text-on-surface-variant">
          Prefer to speak with someone?{' '}
          <button id="btn-rebook-agent-help" onClick={onOpenChat} className="text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer">
            <Headphones className="w-4 h-4" /> Talk to an agent
          </button>
        </div>
      </div>
    </div>
  );
}
