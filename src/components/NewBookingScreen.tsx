import React, { useState } from 'react';
import { Search, CheckCircle2, Headphones, CreditCard } from 'lucide-react';
import { AlternativeFlight } from '../types';
import { ALTERNATIVE_FLIGHTS } from '../mockData';

interface NewBookingScreenProps {
  onSelectFlight: (flight: AlternativeFlight) => void;
  onGoBack: () => void;
  onOpenChat: () => void;
}

export default function NewBookingScreen({ onSelectFlight, onGoBack, onOpenChat }: NewBookingScreenProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedCode) {
      const flight = ALTERNATIVE_FLIGHTS.find(f => f.code === selectedCode);
      if (flight) {
        onSelectFlight(flight);
      }
    }
  };

  return (
    <div id="new-booking-view" className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-10 py-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Book a New Flight</h1>
        <p className="text-on-surface-variant mt-2">Select from our available flights to complete your new booking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 high-trust-shadow">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-secondary-container" />
              Available Flights
            </h2>
            
            <div className="flex flex-col gap-4">
              {ALTERNATIVE_FLIGHTS.map(flight => (
                <div 
                  key={flight.code}
                  onClick={() => setSelectedCode(flight.code)}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedCode === flight.code 
                      ? 'border-primary bg-primary/5' 
                      : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-on-surface">{flight.departureTime}</span>
                        <div className="flex-1 flex items-center gap-2 px-2">
                          <div className="h-px bg-outline-variant flex-1"></div>
                          <span className="text-xs font-semibold text-outline px-2">{flight.duration}</span>
                          <div className="h-px bg-outline-variant flex-1"></div>
                        </div>
                        <span className="font-bold text-lg text-on-surface">{flight.arrivalTime}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-on-surface-variant">{flight.origin}</span>
                        <span className="text-xs font-medium text-outline">{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop(s)`}</span>
                        <span className="font-semibold text-on-surface-variant">{flight.destination}</span>
                      </div>
                    </div>

                    <div className="sm:border-l sm:border-outline-variant/30 sm:pl-5 flex flex-row sm:flex-col justify-between sm:justify-center items-center gap-2">
                      <div className="text-center">
                        <span className="block text-xs text-outline mb-1">Flight</span>
                        <span className="font-bold text-primary">{flight.code}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedCode === flight.code ? 'bg-primary text-on-primary' : 'border-2 border-outline-variant/50'}`}>
                        {selectedCode === flight.code && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 high-trust-shadow flex flex-col gap-5 sticky top-24">
            <h3 className="text-lg font-bold text-primary">Booking Summary</h3>
            
            {selectedCode ? (
              <div className="flex flex-col gap-4">
                <div className="bg-surface-container p-4 rounded-lg flex flex-col gap-2 border border-outline-variant/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">Selected Flight</span>
                    <span className="font-bold text-primary">{selectedCode}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-outline-variant/10 pt-2">
                    <span className="text-on-surface-variant font-medium">Passenger</span>
                    <span className="font-bold text-on-surface">1 Adult</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-outline-variant/10 pt-2">
                    <span className="text-on-surface-variant font-medium">Total</span>
                    <span className="font-bold text-primary">$350.00</span>
                  </div>
                </div>

                <button 
                  onClick={handleConfirm}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-semibold py-3.5 px-4 rounded-lg transition-colors shadow-sm active:scale-98 flex justify-center items-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Book Now
                </button>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-outline-variant/40 rounded-lg text-on-surface-variant text-sm">
                Please select a flight to continue.
              </div>
            )}

            <button 
              onClick={onGoBack}
              className="text-xs font-semibold text-outline hover:text-primary transition-colors cursor-pointer text-center mt-2"
            >
              &larr; Cancel and return to Dashboard
            </button>
          </div>
          
          <div className="bg-[#e8f0fe] rounded-xl p-6 border border-[#1a73e8]/20 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a73e8]/20 text-[#1a73e8] flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1a73e8]">Need booking assistance?</h3>
            <p className="text-xs text-[#1a73e8]/80">Our AI agent can book flights for you directly in the chat.</p>
            <button onClick={onOpenChat} className="text-xs font-bold text-[#1a73e8] underline text-left mt-1">
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
