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
  apartmentId: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes?: string;
};

export type BookingResponse = {
  message: string;
  reference: string;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    role: "user" | "owner" | "admin";
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
  role: "user" | "owner" | "admin";
  phone?: string;
};

export type ProfileUpdatePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type BookingSummary = {
  reference: string;
  apartment: Pick<Apartment, "title">;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";
