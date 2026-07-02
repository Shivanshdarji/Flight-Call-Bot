import React, { useState } from 'react';
import { Plane, Headphones } from 'lucide-react';
import LookupScreen from './components/LookupScreen';
import DisruptedScreen from './components/DisruptedScreen';
import RebookScreen from './components/RebookScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import DashboardScreen from './components/DashboardScreen';
import RefundScreen from './components/RefundScreen';
import NewBookingScreen from './components/NewBookingScreen';
import ChatWidget from './components/ChatWidget';
import LoginScreen from './components/LoginScreen';
import { Booking, AlternativeFlight, ScreenState } from './types';
import { UserAccount, MOCK_USERS, ALTERNATIVE_FLIGHTS } from './mockData';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('login' as any); // use 'login' as initial
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleLogin = (loggedInUser: UserAccount) => {
    setUser(loggedInUser);
    if (loggedInUser.bookings.length > 0) {
      setBooking(loggedInUser.bookings[0]);
    }
    setScreen('dashboard');
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBooking(updatedBooking);
    setUser(prev => prev ? {
      ...prev,
      bookings: prev.bookings.map(b => b.pnr === updatedBooking.pnr ? updatedBooking : b)
    } : null);
  };

  const handleSearch = (pnr: string, lastName: string) => {
    // Attempt to find booking in mock data if user is not logged in, or use dummy
    let found: Booking | undefined;
    MOCK_USERS.forEach(u => {
      const b = u.bookings.find(bk => bk.pnr.toUpperCase() === pnr.toUpperCase() && bk.lastName.toLowerCase() === lastName.toLowerCase());
      if (b) found = b;
    });

    if (found) {
      setBooking(found);
    } else {
      setBooking({
        pnr: pnr,
        lastName: lastName,
        originalFlight: {
          code: 'SJ402',
          origin: 'LHR',
          originName: 'London Heathrow',
          destination: 'JFK',
          destinationName: 'New York JFK',
          departureTime: '10:30 AM',
          date: 'Oct 12, 2026',
          status: 'Cancelled',
          reason: 'Cancelled due to severe weather conditions at JFK. We apologize for the inconvenience and are ready to assist you with alternative arrangements.'
        },
        refundAmount: 450.00,
        refundStatus: 'Not Requested'
      });
    }
    setScreen('disrupted');
  };

  const handleSelectAlternative = (flight: AlternativeFlight) => {
    if (booking) {
      updateBooking({ ...booking, selectedFlight: flight });
    }
    setScreen('confirmation');
  };

  const handleRequestRefund = () => {
    if (booking) {
      updateBooking({ ...booking, refundStatus: 'Refunded' });
    }
    // After 2.5 seconds, automatically move to a dashboard or let user stay on refund success page
  };

  const handleBookNewFlight = (flight: AlternativeFlight) => {
    if (!user) return;
    
    const newPnr = 'SJN' + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    const newBooking: Booking = {
      pnr: newPnr,
      lastName: user.lastName,
      originalFlight: {
        code: flight.code,
        origin: flight.origin,
        originName: flight.origin,
        destination: flight.destination,
        destinationName: flight.destination,
        departureTime: flight.departureTime,
        date: flight.date,
        status: 'Confirmed'
      },
      refundAmount: 350.00,
      refundStatus: 'Not Requested',
      fareClass: 'CLASS Y'
    };
    
    setUser(prev => prev ? {
      ...prev,
      bookings: [...prev.bookings, newBooking]
    } : null);
    
    setBooking(newBooking);
    setScreen('dashboard');
  };

  const handleReset = () => {
    if (user) {
      if (user.bookings.length > 0) setBooking(user.bookings[0]);
      setScreen('dashboard');
    } else {
      setBooking(null);
      setScreen('login' as any);
    }
  };

  return (
    <div id="app-root-shell" className="min-h-screen flex flex-col pt-16 bg-background text-on-background">

      {/* Top Header Navigation Bar */}
      <header id="global-header" className="fixed top-0 w-full z-40 flex justify-between items-center px-6 md:px-10 h-16 bg-primary text-on-primary shadow-md">
        <div
          id="header-brand-logo"
          onClick={handleReset}
          className="flex items-center gap-2 cursor-pointer font-bold text-lg select-none hover:opacity-90 transition-opacity"
        >
          <Plane id="logo-icon" className="text-secondary-container w-6 h-6 rotate-90" />
          <span id="logo-text">SkyJet Recovery</span>
        </div>

        {/* Support CTA Option */}
        <button
          id="btn-header-support"
          onClick={() => setChatOpen(prev => !prev)}
          className="hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 font-semibold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full border border-white/20 cursor-pointer"
        >
          <span>Talk to an agent</span>
          <Headphones className="w-4 h-4 text-secondary-container" />
        </button>
      </header>

      {/* Main Flow Canvas Rendering */}
      <main id="main-workflow-canvas" className="flex-grow flex flex-col justify-start">
        {(screen as any) === 'login' && (
          <LoginScreen onLogin={handleLogin} />
        )}
        
        {screen === 'lookup' && (
          <LookupScreen
            onSearch={handleSearch}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {screen === 'disrupted' && booking && (
          <DisruptedScreen
            booking={booking}
            onSeeOptions={() => setScreen('rebook')}
            onCheckRefund={() => setScreen('refund_eligible')}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {screen === 'rebook' && booking && (
          <RebookScreen
            booking={booking}
            onSelectFlight={handleSelectAlternative}
            onOpenChat={() => setChatOpen(true)}
            onGoBack={() => setScreen('disrupted')}
          />
        )}

        {screen === 'confirmation' && booking && (
          <ConfirmationScreen
            selectedFlight={booking.selectedFlight}
            onReturnToDashboard={() => setScreen('dashboard')}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {screen === 'dashboard' && booking && (
          <DashboardScreen
            user={user}
            booking={booking}
            onOpenChat={() => setChatOpen(true)}
            onReset={handleReset}
            onSelectBooking={(b) => { setBooking(b); setScreen('disrupted'); }}
            onNewBooking={() => setScreen('new_booking')}
          />
        )}

        {screen === 'new_booking' && (
          <NewBookingScreen 
            onSelectFlight={handleBookNewFlight}
            onGoBack={() => setScreen('dashboard')}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {screen === 'refund_eligible' && booking && (
          <RefundScreen
            booking={booking}
            onRequestRefund={handleRequestRefund}
            onGoBack={() => setScreen('disrupted')}
            onOpenChat={() => setChatOpen(true)}
            onGoHome={() => setScreen('dashboard')}
          />
        )}
      </main>

      {/* Footer Component */}
      <footer id="global-footer" className="w-full py-6 px-6 md:px-10 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-dim border-t border-outline-variant/35 text-xs text-on-surface">
        <div id="footer-logo-container" className="font-bold text-sm text-primary select-none flex items-center gap-1.5">
          <Plane className="w-4 h-4 rotate-90 text-primary" />
          <span>SkyJet Recovery</span>
        </div>
        <div id="footer-copyright" className="text-on-surface-variant text-center md:text-left">
          &copy; 2026 SkyJet Airways. Dedicated to getting you back on track.
        </div>
        <div id="footer-legal-links" className="flex gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-on-surface-variant hover:text-primary transition-colors font-semibold">Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-on-surface-variant hover:text-primary transition-colors font-semibold">Terms of Service</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-on-surface-variant hover:text-primary transition-colors font-semibold">Accessibility</a>
        </div>
      </footer>

      {/* Floating Stateful Chat Assistant Widget */}
      {booking && (
        <ChatWidget
          booking={booking}
          isOpen={chatOpen}
          onToggle={() => setChatOpen(prev => !prev)}
          onNavigateToRebook={() => {
            if (booking.refundStatus === 'Processing' || booking.refundStatus === 'Completed') return;
            if (screen === 'lookup' || (screen as any) === 'login') {
              handleSearch('SJR8X9', 'Smith');
            }
            setScreen('rebook');
          }}
          onNavigateToRefund={() => {
            if (booking.selectedFlight) return;
            if (screen === 'lookup' || (screen as any) === 'login') {
              handleSearch('SJR8X9', 'Smith');
            }
            setScreen('refund_eligible');
          }}
          onConfirmRebook={(pnr, flightCode) => {
            if (booking.refundStatus === 'Refunded' || booking.refundStatus === 'Processing' || booking.refundStatus === 'Completed') return;
            const flight = ALTERNATIVE_FLIGHTS.find(f => f.code === flightCode);
            if (flight && booking) {
              updateBooking({ ...booking, selectedFlight: flight });
              setScreen('confirmation');
            }
          }}
          onConfirmNewBooking={(flightCode) => {
            const flight = ALTERNATIVE_FLIGHTS.find(f => f.code === flightCode);
            if (flight) {
              handleBookNewFlight(flight);
            }
          }}
        />
      )}

    </div>
  );
}
