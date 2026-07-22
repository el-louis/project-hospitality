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

export type PublicFeatureFlags = {
  conceptPreview: boolean;
  publicWebsite: boolean;
  onlineBooking: boolean;
  guestAccounts: boolean;
  guestBookingHistory: boolean;
  whatsappContact: boolean;
};

export type ContentConfidence = "CONFIRMED" | "ASSUMED_DEMO" | "OWNER_REQUIRED";

export type RedMasaiProfile = {
  displayName: string;
  tagline: string;
  valueProposition: string;
  shortDescription: string;
  fullDescription: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city: string;
  region: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  instagramUrl?: string | null;
  socialLinks: Record<string, string>;
  timezone: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  defaultCurrency: string;
  bookingInstructions?: string | null;
  cancellationSummary?: string | null;
  previewNotice?: string | null;
};

export type ProtectedRedMasaiProfile = RedMasaiProfile & {
  id: number;
  fieldConfidence: Record<string, ContentConfidence>;
  createdAt: string;
  updatedAt: string;
};

export type OfferingCategory = "STAY" | "CELEBRATE" | "EXPERIENCE" | "CREATE";
export type OfferingBookingMethod = "DIRECT_BOOKING" | "ENQUIRY" | "WHATSAPP";

export type Offering = {
  id: string;
  category: OfferingCategory;
  slug: string;
  title: string;
  shortSummary: string;
  fullDescription: string;
  startingPrice?: number | null;
  currency: string;
  pricingNote?: string | null;
  capacity?: number | null;
  durationNote?: string | null;
  includedItems: string[];
  additionalChargeNote?: string | null;
  bookingMethod: OfferingBookingMethod;
  whatsappAction: boolean;
  imageUrl?: string | null;
  active?: boolean;
  featured: boolean;
  displayOrder: number;
  contentConfidence?: ContentConfidence;
};

export type PublicOffering = Omit<
  Offering,
  "id" | "active" | "contentConfidence"
>;
