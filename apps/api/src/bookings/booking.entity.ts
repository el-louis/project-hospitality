export type BookingRecord = {
  id: string;
  reference: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  apartmentPreference?: string;
  notes?: string;
  estimatedTotal: number;
  status: 'pending' | 'confirmed' | 'cancelled';
};
