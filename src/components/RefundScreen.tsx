import React, { useState } from 'react';
import { CheckCircle2, CreditCard, ArrowLeft, Headphones, Info, Check } from 'lucide-react';
import { Booking } from '../types';

interface RefundScreenProps {
  booking: Booking;
  onRequestRefund: () => void;
  onGoBack: () => void;
  onOpenChat: () => void;
  onGoHome: () => void;
}

export default function RefundScreen({ 
  booking, 
  onRequestRefund, 
  onGoBack, 
  onOpenChat,
  onGoHome
}: RefundScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRequested, setIsRequested] = useState(booking.refundStatus === 'Processing');

  const handleRequestClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRequested(true);
      onRequestRefund(); // update parent state
    }, 1200);
  };

  return (
    <div id="refund-view" className="flex-grow w-full max-w-2xl mx-auto px-4 md:px-10 py-8 flex items-center justify-center animate-fade-in-up">
      <div id="refund-card" className="w-full bg-surface-container-lowest rounded-xl high-trust-shadow transition-all duration-300 border border-outline-variant/30 overflow-hidden">
        
        {/* Card Header */}
        <div id="refund-card-header" className="p-6 md:p-8 border-b border-outline-variant/10 bg-surface-bright/50">
          <div id="refund-title-container" className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E6F4EA] text-[#137333] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-[#137333]" />
            </div>
            <h1 id="refund-main-title" className="text-xl md:text-2xl font-black text-primary leading-tight">
              You're eligible for a full refund
            </h1>
          </div>
          <p id="refund-description" className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            This flight was cancelled by SkyJet due to technical reasons, making you eligible for a 100% refund of your purchase.
          </p>
        </div>

        {/* Card Body - Flight details */}
        <div id="refund-card-body" className="p-6 md:p-8 bg-surface-container-lowest flex flex-col gap-6">
          <div id="refund-summary-box" className="flex items-center justify-between pb-6 border-b border-outline-variant/20 border-dashed">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">Flight</span>
              <span id="refund-flight-code" className="text-xl font-extrabold text-on-surface">{booking.originalFlight.code}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">Total Amount</span>
              <span id="refund-total-amount" className="text-xl font-extrabold text-primary">${booking.refundAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Refund Action Section */}
          {!isRequested ? (
            <div id="refund-action-section" className="flex flex-col gap-4">
              <button 
                id="btn-trigger-refund"
                disabled={isProcessing}
                onClick={handleRequestClick}
                className="w-full bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-xs active:scale-98 disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5 text-on-secondary-container" />
                {isProcessing ? 'Processing Refund Request...' : 'Request Refund'}
              </button>
              
              <div id="refund-help-links" className="text-center">
                <button 
                  id="btn-refund-agent-help"
                  onClick={onOpenChat}
                  className="text-xs font-semibold text-primary flex items-center justify-center gap-1 hover:underline mx-auto cursor-pointer"
                >
                  Need help? Talk to an agent
                </button>
              </div>
            </div>
          ) : (
            /* Refund Success Block */
            <div 
              id="refund-success-section" 
              className="bg-[#E6F4EA]/40 p-5 rounded-lg border border-[#137333]/20 flex items-start gap-3 animate-fade-in"
            >
              <CheckCircle2 className="text-[#137333] w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 id="refund-success-title" className="font-bold text-sm text-[#137333]">Flight Refunded!</h4>
                <p id="refund-success-desc" className="text-xs text-on-surface-variant mt-1">
                  We've successfully refunded <strong className="text-[#137333]">${booking.refundAmount.toFixed(2)}</strong> back to your original payment card. It will be fully processed and visible in 5-7 business days.
                </p>
                <button 
                  id="btn-refund-home"
                  onClick={onGoHome}
                  className="mt-4 bg-[#137333] hover:bg-[#137333]/90 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-sm shadow-sm active:scale-95"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Stepper progress tracking */}
          <div id="refund-stepper" className="w-full mt-4 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 text-on-primary" />
              </div>
              <span className="font-semibold text-xxs text-primary hidden md:inline">Options</span>
            </div>
            <div className="h-[2px] w-6 md:w-12 bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 text-on-primary" />
              </div>
              <span className="font-semibold text-xxs text-primary hidden md:inline">Review</span>
            </div>
            <div className="h-[2px] w-6 md:w-12 bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isRequested ? 'bg-primary' : 'bg-surface-container-lowest border border-outline-variant'}`}>
                {isRequested ? <Check className="w-3 text-on-primary" /> : <div className="w-1.5 h-1.5 rounded-full bg-outline" />}
              </div>
              <span className={`text-xxs ${isRequested ? 'font-bold text-primary' : 'font-medium text-outline'}`}>Confirmed</span>
            </div>
          </div>

          {/* Navigation Go Back */}
          <div id="refund-back-button-container" className="text-center mt-2">
            <button 
              id="btn-refund-go-back"
              onClick={onGoBack}
              className="text-xs font-semibold text-outline hover:text-primary transition-colors cursor-pointer"
            >
              &larr; Go Back to Flight Details
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
