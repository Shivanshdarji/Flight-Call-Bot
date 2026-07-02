import React, { useState } from 'react';
import { Plane, Ticket, FileText, Utensils, Headphones, Info, Check, XCircle, CheckCircle2, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { Booking, AlternativeFlight } from '../types';
import { UserAccount } from '../mockData';

interface DashboardScreenProps {
  user: UserAccount | null;
  booking: Booking;
  onOpenChat: () => void;
  onReset: () => void;
  onSelectBooking?: (booking: Booking) => void;
  onNewBooking?: () => void;
}

export default function DashboardScreen({ user, booking, onOpenChat, onReset, onSelectBooking, onNewBooking }: DashboardScreenProps) {
  const { originalFlight, selectedFlight } = booking;
  const [activeModal, setActiveModal] = useState<'ticket' | 'documents' | 'vouchers' | null>(null);

  const flightToDisplay = selectedFlight || originalFlight;

  return (
    <div id="dashboard-view" className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8 animate-fade-in-up">
      
      {/* Stepper progress tracker */}
      <section id="dashboard-stepper-section" className="w-full mb-10">
        <div id="dashboard-stepper-container" className="flex items-center justify-between relative max-w-3xl mx-auto px-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-surface-container-highest -z-10"></div>
          
          {/* Step 1 */}
          <div id="dashboard-step-1" className="flex flex-col items-center gap-1.5 relative bg-background px-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <Check className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-semibold text-xs text-primary">Status Checked</span>
          </div>

          {/* Step 2 */}
          <div id="dashboard-step-2" className="flex flex-col items-center gap-1.5 relative bg-background px-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <Check className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-semibold text-xs text-primary">Option Selected</span>
          </div>

          {/* Step 3 */}
          <div id="dashboard-step-3" className="flex flex-col items-center gap-1.5 relative bg-background px-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-secondary-container flex items-center justify-center text-secondary-container ring-4 ring-secondary-container/15">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary-container"></div>
            </div>
            <span className="font-bold text-xs text-secondary-container">Confirmed</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Dashboard Content */}
      <div id="dashboard-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Left Columns */}
        <div id="dashboard-left-columns" className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Current Trip Card */}
          <div id="dashboard-trip-card" className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/30 high-trust-shadow flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span id="trip-disruption-tag" className="inline-block px-3 py-1 rounded-full bg-secondary-container/15 text-on-secondary-container font-semibold text-xs mb-3 border border-secondary-container/25 uppercase tracking-wider">
                  {booking.refundStatus === 'Refunded' ? 'Refunded' : (selectedFlight ? 'Disruption Rebooked' : (originalFlight.status === 'Cancelled' ? 'Action Required' : 'Upcoming Flight'))}
                </span>
                <h2 id="trip-route-title" className="text-xl md:text-2xl font-black text-primary tracking-tight">
                  {originalFlight.origin} to {originalFlight.destination}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Plane id="trip-plane-icon" className="w-6 h-6 rotate-90 text-primary" />
              </div>
            </div>

            {/* Path details */}
            <div id="trip-flight-comparison" className="flex flex-col md:flex-row gap-6 border-t border-dashed border-outline-variant/40 pt-6 mt-2">
              <div id="trip-original-details" className="flex-1">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-1">Flight Details</p>
                <p className="font-bold text-sm text-on-surface">{originalFlight.code} • {originalFlight.departureTime} ({originalFlight.date})</p>
                {originalFlight.status === 'Cancelled' ? (
                  <p className="text-sm text-error flex items-center gap-1.5 mt-1 font-semibold">
                    <XCircle className="w-4 h-4 text-error" /> Cancelled
                  </p>
                ) : (
                  <p className="text-sm text-[#137333] flex items-center gap-1.5 mt-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#137333]" /> Confirmed
                  </p>
                )}
              </div>

              {selectedFlight && (
                <>
                  <div id="trip-arrow-comparison" className="hidden md:flex flex-col justify-center items-center px-4">
                    <ArrowRight className="w-5 h-5 text-outline/50" />
                  </div>

                  <div id="trip-rebooked-details" className="flex-1 border-t md:border-0 border-surface-container-high pt-4 md:pt-0">
                    <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-1 font-semibold">Confirmed Rebooking</p>
                    <p className="font-extrabold text-sm text-primary">{selectedFlight.code} • {selectedFlight.departureTime} ({selectedFlight.date})</p>
                    <p className="text-sm text-primary-container flex items-center gap-1.5 mt-1 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Confirmed
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions Title */}
          <div id="dashboard-actions-header" className="mt-2">
            <h3 id="dashboard-actions-title" className="text-xl font-bold text-primary">Quick Actions</h3>
          </div>

          {/* Quick Actions Bento Grid */}
          <div id="dashboard-actions-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Bento Card 1: View Ticket */}
            <button 
              id="btn-action-ticket"
              onClick={() => setActiveModal('ticket')}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:bg-surface-container-low hover:border-primary/20 group cursor-pointer high-trust-shadow hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Ticket className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-on-surface">View ticket</span>
              <span className="text-xs text-on-surface-variant/70">Seat confirmed</span>
            </button>

            {/* Bento Card 2: Travel Documents */}
            <button 
              id="btn-action-docs"
              onClick={() => setActiveModal('documents')}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:bg-surface-container-low hover:border-primary/20 group cursor-pointer high-trust-shadow hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-on-surface">Travel documents</span>
              <span className="text-xs text-on-surface-variant/70">Required regulations</span>
            </button>

            {/* Bento Card 3: Meal Vouchers */}
            <button 
              id="btn-action-vouchers"
              onClick={() => setActiveModal('vouchers')}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:bg-surface-container-low hover:border-primary/20 group cursor-pointer sm:col-span-2 md:col-span-1 high-trust-shadow hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-container/15 flex items-center justify-center text-on-secondary-container group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-on-surface">Meal vouchers</span>
              <span className="text-xs text-on-secondary-container font-semibold">$30 airport voucher</span>
            </button>

            {/* Bento Card 4: Manage Flight */}
            <button 
              id="btn-action-manage"
              disabled={booking.refundStatus === 'Refunded'}
              onClick={() => onSelectBooking && onSelectBooking(booking)}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:bg-surface-container-low hover:border-primary/20 group cursor-pointer high-trust-shadow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:bg-surface-container-lowest disabled:hover:border-outline-variant/30"
            >
              <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-colors">
                <Plane className="w-6 h-6 rotate-90" />
              </div>
              <span className="font-bold text-sm text-on-surface">Manage booking</span>
              <span className="text-xs text-on-surface-variant/70">Cancel or reschedule</span>
            </button>

            {/* Bento Card 5: Book New Flight */}
            <button 
              id="btn-action-new-booking"
              onClick={onNewBooking}
              className="bg-primary hover:bg-primary/90 text-on-primary p-6 rounded-xl border border-primary/30 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 cursor-pointer high-trust-shadow hover:-translate-y-0.5 sm:col-span-2 md:col-span-2"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Plane className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-white">Book New Flight</span>
              <span className="text-xs text-white/80">Search & book new tickets</span>
            </button>
          </div>

          <div id="dashboard-back-container" className="text-center md:text-left flex justify-between items-center mt-6">
            <button 
              id="btn-dashboard-reset"
              onClick={onReset}
              className="text-xs font-semibold text-outline hover:text-primary transition-all cursor-pointer"
            >
              &larr; Look up another flight / Log Out
            </button>
          </div>

        </div>

        {/* Sidebar support container */}
        <div id="dashboard-sidebar-column" className="lg:col-span-1 flex flex-col gap-6">
          
          {/* User Profile / All Bookings Sidebar Card */}
          {user && (
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 high-trust-shadow flex flex-col gap-4">
              <h3 className="text-lg font-bold text-primary border-b border-outline-variant/30 pb-2">Welcome, {user.firstName}!</h3>
              <p className="text-xs text-on-surface-variant font-semibold">Your Bookings</p>
              <div className="flex flex-col gap-3">
                {user.bookings.map((b) => {
                  const bDisplay = b.selectedFlight || b.originalFlight as any;
                  return (
                  <button 
                    key={b.pnr} 
                    onClick={() => onSelectBooking && onSelectBooking(b)}
                    className={`flex flex-col text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      b.pnr === booking.pnr 
                        ? 'border-primary bg-primary/5' 
                        : 'border-outline-variant/40 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-on-surface">{bDisplay.code}</span>
                      <span className="text-xs font-mono text-outline">{b.pnr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-semibold text-on-surface-variant">{bDisplay.origin}</span>
                      <ArrowRight className="w-3 h-3 text-outline" />
                      <span className="font-semibold text-on-surface-variant">{bDisplay.destination}</span>
                    </div>
                    {b.originalFlight.status === 'Cancelled' && !b.selectedFlight && b.refundStatus !== 'Processing' && b.refundStatus !== 'Refunded' && (
                      <span className="mt-2 text-xxs font-bold px-2 py-1 bg-error-container text-on-error-container rounded-md w-fit flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Action Required
                      </span>
                    )}
                    {b.refundStatus === 'Refunded' && (
                      <span className="mt-2 text-xxs font-bold px-2 py-1 bg-surface-container-high text-on-surface-variant rounded-md w-fit flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Refunded
                      </span>
                    )}
                    {b.selectedFlight && (
                      <span className="mt-2 text-xxs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md w-fit flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Rebooked
                      </span>
                    )}
                  </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Sidebar card */}
          <div id="dashboard-support-card" className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 high-trust-shadow flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-error-container/50 text-on-error-container flex items-center justify-center">
              <Headphones className="w-6 h-6 text-on-error-container" />
            </div>
            <div>
              <h3 id="support-card-title" className="text-lg font-bold text-primary mb-1">Need help?</h3>
              <p id="support-card-desc" className="text-sm text-on-surface-variant leading-relaxed">
                Our recovery specialists are available 24/7 to assist you with special requests or further schedule changes.
              </p>
            </div>
            <button 
              id="btn-support-agent-chat"
              onClick={onOpenChat}
              className="w-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-98 shadow-md cursor-pointer"
            >
              Talk to an agent
              <ArrowRight className="w-4 h-4 text-on-primary" />
            </button>
          </div>

          {/* Quick status bar */}
          <div id="dashboard-booking-reference-bar" className="bg-surface-bright rounded-xl p-4 border border-outline-variant/20">
            <p id="reference-pnr-notice" className="text-xs text-on-surface-variant flex items-start gap-2 leading-relaxed">
              <Info className="w-4.5 h-4.5 mt-0.5 text-primary flex-shrink-0" />
              <span>
                Your booking reference is <strong className="text-on-surface font-bold">{booking.pnr}</strong>. Please have this ready when contacting support.
              </span>
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Bento Overlays / Modals */}
      {activeModal && (
        <div id="dashboard-overlay-bg" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            id="dashboard-overlay-card" 
            className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col"
          >
            {/* Modal Header */}
            <div id="modal-header-container" className="p-5 border-b border-surface-container-high flex justify-between items-center bg-surface-bright">
              <h4 id="modal-header-title" className="font-extrabold text-primary text-base">
                {activeModal === 'ticket' && 'Boarding Pass Confirmation'}
                {activeModal === 'documents' && 'Required Travel Documents'}
                {activeModal === 'vouchers' && 'Claimed Meal Voucher'}
              </h4>
              <button 
                id="btn-close-modal"
                onClick={() => setActiveModal(null)} 
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div id="modal-body-container" className="p-6">
              
              {/* TICKET MODAL */}
              {activeModal === 'ticket' && (
                <div id="modal-ticket-content" className="flex flex-col gap-4">
                  <div className="bg-primary text-on-primary p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full"></div>
                    <div className="flex justify-between items-center text-xs opacity-85">
                      <span>SKYJET AIRWAYS</span>
                      <span className="font-mono">CLASS Y</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-black">{flightToDisplay.origin}</span>
                        <span className="text-xs block opacity-85">{flightToDisplay.origin}</span>
                      </div>
                      <Plane className="w-5 h-5 rotate-90 text-secondary-container" />
                      <div className="text-right">
                        <span className="text-2xl font-black">{flightToDisplay.destination}</span>
                        <span className="text-xs block opacity-85">{flightToDisplay.destination}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs border-t border-dashed border-white/20 pt-4 mt-2">
                      <div>
                        <span className="opacity-75 block">FLIGHT</span>
                        <span className="font-bold">{flightToDisplay.code}</span>
                      </div>
                      <div>
                        <span className="opacity-75 block">SEAT</span>
                        <span className="font-bold">14C</span>
                      </div>
                      <div>
                        <span className="opacity-75 block">GATE</span>
                        <span className="font-bold">B22</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-center border-t border-dashed border-white/20 pt-4 text-secondary-container font-semibold">
                      PASSENGER: {booking.lastName.toUpperCase()} / SMITH
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant/85 text-center mt-2 leading-relaxed">
                    This is your electronic boarding pass. Please present this card at security and boarding gate B22.
                  </p>
                </div>
              )}

              {/* DOCUMENTS MODAL */}
              {activeModal === 'documents' && (
                <div id="modal-docs-content" className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 bg-surface-container p-4 rounded-lg">
                    <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-primary block">UK Entry Regulations</span>
                      <span className="text-xs text-on-surface-variant">Ensure your passport is valid for at least 6 months past your departure date. Visas or ETA required for non-EU/US citizens.</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-xs font-semibold text-outline uppercase">Your Check-List</span>
                    <label className="flex items-center gap-2 text-sm text-on-surface font-medium cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
                      Valid Passport (Matching SMITH)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-on-surface font-medium cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
                      ETA / VISA Confirmation
                    </label>
                    <label className="flex items-center gap-2 text-sm text-on-surface font-medium cursor-pointer">
                      <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                      Meal voucher barcode / copy
                    </label>
                  </div>
                </div>
              )}

              {/* VOUCHERS MODAL */}
              {activeModal === 'vouchers' && (
                <div id="modal-vouchers-content" className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 bg-secondary-container/15 text-on-secondary-container rounded-full flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-on-secondary-container" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-lg text-primary">$30 Food & Beverage Voucher</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Valid at any JFK Airport terminal restaurant today only.</p>
                  </div>

                  {/* QR Code mockup */}
                  <div className="border border-outline-variant/40 p-4 rounded-lg bg-white my-2 flex flex-col items-center gap-2">
                    <div className="w-36 h-36 bg-surface-dim flex items-center justify-center font-mono text-xs border border-outline/20">
                      {/* Stylized QR placeholder */}
                      <div className="grid grid-cols-4 gap-1 p-2 bg-white w-full h-full">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-full h-full ${((i + 3) % 3 === 0 || (i * 7) % 5 === 0) ? 'bg-primary' : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold tracking-widest text-primary">VCH-JFK-SMITH-90214</span>
                  </div>

                  <p className="text-xxs text-on-surface-variant/80 max-w-xs leading-relaxed">
                    Scan this QR code or show barcode to cashier. Applicable to breakfast, lunch, dinner, and beverage purchases.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div id="modal-footer-container" className="p-4 border-t border-surface-container-high bg-surface-bright flex justify-end">
              <button 
                id="btn-close-modal-footer"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
