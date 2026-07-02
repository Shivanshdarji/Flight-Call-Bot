import { Booking, AlternativeFlight } from './types';

// Extend types to include login info and multiple bookings
export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bookings: Booking[];
}

export const ALTERNATIVE_FLIGHTS: AlternativeFlight[] = [
  {
    code: 'SJ904',
    departureTime: '14:30',
    arrivalTime: '22:00',
    date: 'Tomorrow',
    duration: '7h 30m',
    stops: 0,
    seatsAvailable: 28,
    type: 'Direct Flight',
    origin: 'JFK',
    destination: 'LHR'
  },
  {
    code: 'SJ912',
    departureTime: '19:45',
    arrivalTime: '03:15',
    date: 'Tomorrow',
    duration: '7h 30m',
    stops: 0,
    seatsAvailable: 12,
    type: 'Direct Flight',
    origin: 'JFK',
    destination: 'LHR'
  },
  {
    code: 'SJ880',
    departureTime: '16:00',
    arrivalTime: '01:00',
    date: 'Tomorrow',
    duration: '9h 00m',
    stops: 1,
    seatsAvailable: 4,
    type: '1 Stop',
    origin: 'JFK',
    destination: 'LHR'
  }
];

export const MOCK_USERS: UserAccount[] = [
  {
    id: 'u_1',
    email: 'user@skyjet.com',
    firstName: 'Alex',
    lastName: 'Smith',
    bookings: [
      {
        pnr: 'SJR8X9',
        lastName: 'Smith',
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
        refundStatus: 'Not Requested',
        disruptionType: 'weather'
      },
      {
        pnr: 'SJM7U9',
        lastName: 'Smith',
        originalFlight: {
          code: 'SJ811',
          origin: 'JFK',
          originName: 'New York JFK',
          destination: 'MIA',
          destinationName: 'Miami International',
          departureTime: '08:15 AM',
          date: 'Oct 20, 2026',
          status: 'Cancelled',
          reason: 'Cancelled due to a medical emergency onboard previous segment.'
        },
        refundAmount: 220.00,
        refundStatus: 'Not Requested',
        disruptionType: 'medical_emergency' // Critical
      }
    ]
  },
  {
    id: 'u_2',
    email: 'jane@skyjet.com',
    firstName: 'Jane',
    lastName: 'Doe',
    bookings: [
      {
        pnr: 'SJT1M4',
        lastName: 'Doe',
        originalFlight: {
          code: 'SJ505',
          origin: 'LAX',
          originName: 'Los Angeles',
          destination: 'SFO',
          destinationName: 'San Francisco',
          departureTime: '09:00 AM',
          date: 'Oct 15, 2026',
          status: 'Cancelled',
          reason: 'Cancelled due to unexpected technical fault with the aircraft.'
        },
        refundAmount: 150.00,
        refundStatus: 'Not Requested',
        disruptionType: 'technical_fault'
      }
    ]
  }
];
