import React, { useState } from 'react';
import { CheckCircle2, Calendar, Download, ArrowLeft, Headphones, Check, Plane } from 'lucide-react';
import { AlternativeFlight } from '../types';
import { motion } from 'motion/react';

interface ConfirmationScreenProps {
  selectedFlight?: AlternativeFlight;
  onReturnToDashboard: () => void;
  onOpenChat: () => void;
}

export default function ConfirmationScreen({ 
  selectedFlight, 
  onReturnToDashboard, 
  onOpenChat 
}: ConfirmationScreenProps) {
  const [showToast, setShowToast] = useState<'calendar' | 'download' | null>(null);

  // Fallback defaults if no flight was passed
  const flight = selectedFlight || {
    code: 'SJ512',
    departureTime: '14:30',
    arrivalTime: '22:15',
    date: 'Today',
    duration: '7h 45m',
    seatsAvailable: 12,
    type: 'Direct Flight',
    origin: 'JFK',
    destination: 'LHR'
  };

  const handleAction = (type: 'calendar' | 'download') => {
    setShowToast(type);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  return (
    <div id="confirmation-view" className="flex-grow w-full max-w-2xl mx-auto px-4 md:px-10 py-8 flex flex-col items-center justify-center animate-fade-in-up">
      {/* Toast message for Actions */}
      {showToast && (
        <div 
          id="confirmation-toast"
          className="fixed top-20 z-50 bg-primary text-on-primary px-6 py-3 rounded-full shadow-xl flex items-center gap-2 border border-primary-container font-semibold text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-secondary-container" />
          <span>
            {showToast === 'calendar' 
              ? 'Successfully added flight to your calendar!' 
              : 'Downloading boarding pass and ticket confirmation PDF...'}
          </span>
        </div>
      )}

      {/* Success Icon */}
      <div id="success-icon-container" className="w-24 h-24 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-6 relative shadow-md">
        <CheckCircle2 id="success-checkmark-icon" className="w-16 h-16 text-[#137333]" />
      </div>

      {/* Title */}
      <h1 id="confirmation-title" className="text-2xl md:text-3xl font-black text-primary mb-2 text-center">
        Your new flight is confirmed!
      </h1>
      <p id="confirmation-subtitle" className="text-md text-on-surface-variant text-center mb-8">
        We've secured your seat. Your confirmation number is <strong id="pnr-strong-id" className="text-primary font-bold">QJ8X2K</strong>.
      </p>

      {/* Stepper progress tracker */}
      <div id="confirmation-stepper" className="w-full mb-8 flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-on-primary" />
          </div>
          <span className="font-semibold text-xs text-primary hidden md:inline">Options</span>
        </div>
        <div className="h-[2px] w-8 md:w-16 bg-primary"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-on-primary" />
          </div>
          <span className="font-semibold text-xs text-primary hidden md:inline">Review</span>
        </div>
        <div className="h-[2px] w-8 md:w-16 bg-primary"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-secondary-container flex items-center justify-center ring-4 ring-secondary-container/15">
            <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
          </div>
          <span className="font-bold text-xs text-on-surface">Confirmed</span>
        </div>
      </div>

      {/* Flight Card */}
      <div id="confirmed-flight-card" className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-md p-6 mb-8 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
        <div id="confirmed-card-header" className="flex justify-between items-center mb-4 border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-2">
            <Plane className="text-primary w-5 h-5" />
            <span id="confirmed-flight-code" className="font-bold text-sm text-on-surface">Flight {flight.code}</span>
          </div>
          <span id="confirmed-status-pill" className="bg-[#E6F4EA] text-[#137333] px-3 py-1 rounded-full font-bold text-xs">
            Confirmed
          </span>
        </div>

        <div id="confirmed-card-body" className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 gap-4">
          <div id="confirmed-origin-cell">
            <p id="confirmed-dep-date" className="text-xs text-on-surface-variant/80 mb-1">{flight.date === 'Today' ? 'Today' : 'Tomorrow'}, {flight.departureTime}</p>
            <p id="confirmed-origin-code" className="text-xl font-extrabold text-primary">{flight.origin} <span className="font-medium text-sm text-on-surface-variant">New York</span></p>
          </div>

          <div id="confirmed-path-visual" className="flex-grow flex items-center justify-center w-full md:w-auto px-4 hidden md:flex">
            <div className="h-[1px] bg-outline-variant/60 flex-grow border-dashed border-t"></div>
            <Plane className="text-outline/40 mx-2 rotate-90 md:rotate-0" />
            <div className="h-[1px] bg-outline-variant/60 flex-grow border-dashed border-t"></div>
          </div>

          <div id="confirmed-dest-cell" className="text-left md:text-right w-full md:w-auto border-t md:border-0 border-surface-container-high pt-3 md:pt-0">
            <p id="confirmed-arr-date" className="text-xs text-on-surface-variant/80 mb-1">{flight.date === 'Today' ? 'Today' : 'Tomorrow'}, {flight.arrivalTime}</p>
            <p id="confirmed-dest-code" className="text-xl font-extrabold text-primary"><span className="font-medium text-sm text-on-surface-variant hidden md:inline">London </span>{flight.destination}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons side by side */}
      <div id="confirmation-actions-row" className="w-full flex flex-col sm:flex-row gap-4 mb-6">
        <button 
          id="btn-add-to-calendar"
          onClick={() => handleAction('calendar')}
          className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-semibold py-3 px-4 rounded-lg hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-outline" />
          Add to calendar
        </button>
        <button 
          id="btn-download-confirmation"
          onClick={() => handleAction('download')}
          className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-semibold py-3 px-4 rounded-lg hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-5 h-5 text-outline" />
          Download confirmation
        </button>
      </div>

      {/* Primary Navigation CTA */}
      <button 
        id="btn-return-dashboard"
        onClick={onReturnToDashboard}
        className="w-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-semibold py-4 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors mb-6 flex items-center justify-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        Return to Dashboard
      </button>

      {/* Support Link */}
      <button 
        id="btn-confirmation-agent-help"
        onClick={onOpenChat}
        className="font-semibold text-sm text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
      >
        <Headphones className="w-4 h-4" />
        Need help? Talk to an agent
      </button>
    </div>
  );
}
