import React, { useState } from 'react';
import { Plane, Ticket, ArrowRight, Headphones, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LookupScreenProps {
  onSearch: (pnr: string, lastName: string) => void;
  onOpenChat: () => void;
  error?: string;
}

const DEMO_SCENARIOS = [
  { pnr: 'SJR8X9', lastName: 'Smith',    label: 'Weather',            emoji: '🌩️' },
  { pnr: 'SJT1M4', lastName: 'Johnson',  label: 'Technical Fault',    emoji: '🔧' },
  { pnr: 'SJC2K7', lastName: 'Williams', label: 'Crew Issue',         emoji: '👨‍✈️' },
  { pnr: 'SJA3P8', lastName: 'Brown',    label: 'ATC Restriction',    emoji: '🗼' },
  { pnr: 'SJP4Q2', lastName: 'Davis',    label: 'Pax-Initiated',      emoji: '🙋' },
  { pnr: 'SJS5R6', lastName: 'Miller',   label: 'Security ⚠️ Esc',    emoji: '🛡️' },
  { pnr: 'SJX6T3', lastName: 'Wilson',   label: 'Connection ⚠️ Esc',  emoji: '🔗' },
  { pnr: 'SJM7U9', lastName: 'Moore',    label: 'Special Assist ⚠️',  emoji: '♿' },
  { pnr: 'SJF8V5', lastName: 'Taylor',   label: 'Frustration ⚠️',    emoji: '😤' },
  { pnr: 'SJU9W1', lastName: 'Anderson', label: 'Ambiguous',          emoji: '❓' },
];

export default function LookupScreen({ onSearch, onOpenChat, error }: LookupScreenProps) {
  const [pnr, setPnr]           = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.trim() && lastName.trim()) {
      onSearch(pnr.toUpperCase().trim(), lastName.trim());
    }
  };

  const handleDemoFill = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setPnr(scenario.pnr);
    setLastName(scenario.lastName);
  };

  return (
    <div id="lookup-view" className="relative flex-grow flex items-center justify-center p-4 md:p-10 min-h-[calc(100vh-8rem)]">
      {/* Background Image Accent */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="bg-cover bg-center w-full h-full transform scale-105"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4bnNYw67_IDN0MNhkl-rbx44zJszBr4wJEl9zFdQqfzNa1mCWwBrLE68-M_0AjBU6em6f55rLQV-NNwIQZQEzZA47lILpkFkt5huBJjCQJ3p6CW48Zsl2XGbLbgfp4Tm04wrT_7JHm5K33x3yM8eH1iuFwXgnHGqsQGyBCXLHPUYAPwn2I3zGHOXd3CdZbcNQMClbFoV3ZbobdT3wDTqSFuxIOyecairtJn_FZE8qXU-n_y6Q3MwzQw')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Elevated Card */}
        <div id="lookup-card" className="bg-surface-container-lowest rounded-xl p-8 shadow-2xl border border-outline-variant/30 flex flex-col gap-6 backdrop-blur-xs">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket id="lookup-icon-ticket" className="text-primary w-8 h-8" />
            </div>
            <h2 id="lookup-title" className="text-2xl md:text-3xl font-bold text-primary mb-2 leading-tight">
              Let's get you back on track.
            </h2>
            <p id="lookup-subtitle" className="text-sm text-on-surface-variant">
              Enter your details to find your recovery options.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div id="lookup-error" className="flex items-start gap-2 bg-error-container text-on-error-container p-3 rounded-lg text-sm border border-error/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form id="lookup-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label id="label-pnr" className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="pnr">
                Booking Reference (PNR)
              </label>
              <input
                className="h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase placeholder-on-surface-variant/40 outline-hidden"
                id="pnr"
                name="pnr"
                placeholder="e.g., SJR8X9"
                required
                type="text"
                value={pnr}
                onChange={e => setPnr(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label id="label-lastname" className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all capitalize placeholder-on-surface-variant/40 outline-hidden"
                id="lastName"
                name="lastName"
                placeholder="e.g., Smith"
                required
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>

            <button
              id="btn-check-flight"
              className="mt-2 h-12 w-full bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              type="submit"
            >
              Check My Flight
              <ArrowRight id="lookup-arrow" className="w-5 h-5 text-on-secondary-container" />
            </button>

            <p id="lookup-foot-note" className="text-center text-xs text-on-surface-variant/70">
              No hold music. Check your status in seconds.
            </p>
          </form>

          {/* Demo Scenario Pills */}
          <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-on-surface-variant text-center uppercase tracking-wider">
              Demo Scenarios (click to fill)
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {DEMO_SCENARIOS.map(s => (
                <button
                  key={s.pnr}
                  id={`demo-scenario-${s.pnr}`}
                  type="button"
                  onClick={() => handleDemoFill(s)}
                  title={`PNR: ${s.pnr} / ${s.lastName}`}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                    pnr === s.pnr
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container border-outline-variant hover:border-primary text-on-surface hover:bg-primary/5'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center text-outline">⚠️ = triggers agent escalation</p>
          </div>

          {/* Help Link */}
          <div id="lookup-help-divider" className="border-t border-outline-variant/30 pt-4 text-center">
            <button
              id="btn-lookup-agent-help"
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
            >
              <Headphones className="w-4 h-4" />
              Need help? Talk to an agent
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
