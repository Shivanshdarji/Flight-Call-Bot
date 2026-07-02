import React from 'react';
import { AlertTriangle, Plane, XCircle, Info, ArrowRight, Headphones } from 'lucide-react';
import { motion } from 'motion/react';
import { Booking } from '../types';

interface DisruptedScreenProps {
  booking: Booking;
  onSeeOptions: () => void;
  onCheckRefund: () => void;
  onOpenChat: () => void;
}

export default function DisruptedScreen({ 
  booking, 
  onSeeOptions, 
  onCheckRefund, 
  onOpenChat 
}: DisruptedScreenProps) {
  const { originalFlight } = booking;

  return (
    <div id="disrupted-view" className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8 animate-fade-in-up">
      {/* Alert Banner */}
      {originalFlight.status === 'Cancelled' ? (
        <div 
          id="cancellation-alert-banner" 
          className="w-full bg-error-container text-on-error-container p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border border-error/20 shadow-xs"
        >
          <div id="cancellation-alert-left" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle id="alert-warning-icon" className="text-error w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span id="alert-bold-title" className="font-bold text-lg block">Your flight has been cancelled.</span>
              <span id="alert-subtext" className="text-sm opacity-90">Please choose a recovery option below.</span>
            </div>
          </div>
          <button 
            id="btn-alert-see-options"
            onClick={onSeeOptions}
            className="text-sm font-semibold underline hover:opacity-80 transition-opacity mt-2 sm:mt-0 text-left cursor-pointer"
          >
            See Recovery Options
          </button>
        </div>
      ) : (
        <div 
          id="manage-flight-banner" 
          className="w-full bg-surface-container-highest text-on-surface p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border border-outline-variant/20 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plane className="text-primary w-6 h-6 rotate-90" />
            </div>
            <div>
              <span className="font-bold text-lg block">Manage Your Booking</span>
              <span className="text-sm opacity-90">View or change your itinerary.</span>
            </div>
          </div>
        </div>
      )}

      <div id="disrupted-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Flight Status & Solutions */}
        <div id="disrupted-main-column" className="lg:col-span-8 flex flex-col gap-8">
          {/* Main Flight Card */}
          <div 
            id="cancelled-flight-card" 
            className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/30 high-trust-shadow relative overflow-hidden"
          >
            {/* Cancelled badge */}
            <div id="flight-status-badge-container" className="absolute top-6 right-6">
              <span 
                id="cancelled-status-badge" 
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs border ${
                  originalFlight.status === 'Cancelled' 
                    ? 'bg-error-container text-on-error-container border-error/20'
                    : 'bg-[#137333]/15 text-[#137333] border-[#137333]/20'
                }`}
              >
                {originalFlight.status === 'Cancelled' ? <XCircle className="w-4 h-4 text-error" /> : <Plane className="w-4 h-4 text-[#137333] rotate-45" />}
                {originalFlight.status === 'Cancelled' ? 'Cancelled' : 'Confirmed'}
              </span>
            </div>

            {/* Flight identification */}
            <div id="flight-card-header" className="flex flex-col gap-1 mb-8">
              <span id="flight-number-label" className="text-xs font-semibold text-outline uppercase tracking-wider">
                Flight {originalFlight.code}
              </span>
              <span id="flight-date-label" className="text-sm font-medium text-on-surface-variant">
                {originalFlight.date}
              </span>
            </div>

            {/* Departure -> Arrival layout */}
            <div id="flight-route-display" className="flex items-center justify-between mb-8 gap-4">
              {/* Origin */}
              <div id="origin-info" className="flex flex-col items-start w-1/3">
                <span id="origin-code" className="text-4xl md:text-5xl font-black text-primary tracking-tight">{originalFlight.origin}</span>
                <span id="origin-name" className="text-sm text-on-surface-variant mt-1 line-clamp-1">{originalFlight.originName}</span>
                <span id="origin-dep-time" className="text-xs font-semibold text-outline mt-1">Dep: --:--</span>
              </div>

              {/* Path line */}
              <div id="flight-path-visual" className="flex-grow flex items-center justify-center px-2 relative">
                <div id="flight-path-dotted-line" className="h-px w-full absolute border-t border-dashed border-outline-variant/80"></div>
                <div id="flight-path-icon-bg" className="bg-surface-container-lowest px-3 relative z-10 text-outline">
                  <Plane id="flight-plane-icon" className="w-6 h-6 rotate-90 text-outline/60" />
                </div>
              </div>

              {/* Destination */}
              <div id="destination-info" className="flex flex-col items-end w-1/3 text-right">
                <span id="destination-code" className="text-4xl md:text-5xl font-black text-primary tracking-tight">{originalFlight.destination}</span>
                <span id="destination-name" className="text-sm text-on-surface-variant mt-1 line-clamp-1">{originalFlight.destinationName}</span>
                <span id="destination-arr-time" className="text-xs font-semibold text-outline mt-1">Arr: --:--</span>
              </div>
            </div>

            {/* Weather reason banner */}
            {originalFlight.reason && (
              <div id="cancellation-reason-alert" className="bg-surface-container p-4 rounded-lg flex items-start gap-3 border border-outline-variant/10">
                <Info id="reason-info-icon" className="text-on-surface-variant w-5 h-5 mt-0.5 flex-shrink-0" />
                <p id="reason-explanation-text" className="text-sm text-on-surface-variant leading-relaxed">
                  {originalFlight.reason}
                </p>
              </div>
            )}
          </div>

          {/* Recovery Actions Container */}
          <div 
            id="recovery-options-container" 
            className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/30 high-trust-shadow flex flex-col gap-6"
          >
            <h2 id="options-section-title" className="text-xl font-bold text-primary">
              {originalFlight.status === 'Cancelled' ? 'Your Options' : 'Manage Flight'}
            </h2>
            
            <div id="options-actions-buttons" className="flex flex-col sm:flex-row gap-4">
              <button 
                id="btn-rebook-option"
                onClick={onSeeOptions}
                disabled={booking.refundStatus === 'Processing' || booking.refundStatus === 'Completed'}
                className={`flex-1 font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  booking.refundStatus === 'Processing' || booking.refundStatus === 'Completed'
                    ? 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
                    : 'bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container hover:shadow-md active:scale-98'
                }`}
                title={booking.refundStatus === 'Processing' ? 'Refund already requested' : ''}
              >
                {booking.refundStatus === 'Processing' ? 'Refund in Progress' : (originalFlight.status === 'Cancelled' ? 'See My Options' : 'Reschedule Flight')}
                <ArrowRight className="w-5 h-5 text-current" />
              </button>

              <button 
                id="btn-refund-option"
                onClick={onCheckRefund}
                disabled={!!booking.selectedFlight}
                className={`flex-1 border font-semibold py-3.5 px-6 rounded-lg transition-all cursor-pointer ${
                  !!booking.selectedFlight
                    ? 'border-outline-variant/30 text-on-surface-variant opacity-50 cursor-not-allowed'
                    : 'border-outline-variant/80 hover:border-primary text-on-surface hover:bg-surface-container-low active:scale-98'
                }`}
                title={!!booking.selectedFlight ? 'Flight already rebooked' : ''}
              >
                {!!booking.selectedFlight ? 'Already Rebooked' : (originalFlight.status === 'Cancelled' ? 'Check refund eligibility' : 'Cancel Flight')}
              </button>
            </div>

            <div id="options-help-footer" className="mt-2 border-t border-outline-variant/20 pt-4">
              <button 
                id="btn-status-agent-help"
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
              >
                <Headphones className="w-4.5 h-4.5" />
                Need help? Talk to an agent
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Travel Advisory (Sidebar) */}
        <div id="disrupted-sidebar-column" className="lg:col-span-4 flex flex-col gap-6">
          {/* Advisory card */}
          <div 
            id="advisory-card" 
            className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 high-trust-shadow flex flex-col gap-4"
          >
            <h3 id="advisory-title" className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
              Travel Advisory
            </h3>
            <p id="advisory-text" className="text-sm text-on-surface-variant leading-relaxed">
              Severe weather is currently impacting flight operations across the Northeast US. Please check options online before heading to the airport.
            </p>
            <a 
              id="advisory-link" 
              href="#" 
              onClick={(e) => { e.preventDefault(); }} 
              className="text-sm font-semibold text-primary hover:underline"
            >
              View full advisory
            </a>
          </div>

          {/* Visual image update */}
          <div 
            id="sidebar-weather-image-card" 
            className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 high-trust-shadow relative h-56 flex flex-col justify-end"
          >
            <img 
              id="weather-update-image"
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_2bCeiC09Enwo2qmir_59UXSqz7RIbIPCDOePsxjJJbF-nyg9pZPmsSHnqQmGIBctYfxEZBovZjmOMobdjfMS1bPKTTLpFkvqS-4hnsMqxBEjXGC9Z_d6mQTegJ_kGQAna6vu5jXo4wRTaTGCLJUp4_HwVC4iA0RNXfEZ-Ny_ZCNmLgaOIEfiyWIPMsmK6HqzQ5-MC_Z4I8wCgWHEuQx_RCZIQrctU3ttBTYBvY-bLx9U4JwB10hOMw" 
              alt="Heavy rain storm over airport tarmac" 
            />
            <div id="advisory-img-overlay" className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/40 to-transparent"></div>
            <div id="advisory-img-text" className="relative p-5 z-10 text-on-primary">
              <span id="weather-update-tag" className="font-bold text-xs uppercase tracking-wider text-secondary-container block mb-1">
                Weather Update
              </span>
              <span id="weather-update-description" className="text-sm font-medium leading-normal text-white">
                JFK ATC has issued a ground stop. Stay updated here for real-time schedule changes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
