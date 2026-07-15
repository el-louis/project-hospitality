export type Apartment = {
  id: string;
  title: string;
  description?: string;
  location: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests?: number;
  imageUrl?: string;
  status?: string;
};

export type BookingRequest = {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  apartmentPreference?: string;
  notes?: string;
};

export type BookingResponse = {
  message: string;
  reference: string;
  estimatedTotal: number;
  request: BookingRequest;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    role: 'user' | 'owner' | 'admin';
  };
};

export type AuthFormState = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string;
  password: string;
};

export type ProfileResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'user' | 'owner' | 'admin';
  phone?: string;
};

export type ProfileUpdatePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type BookingSummary = {
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
