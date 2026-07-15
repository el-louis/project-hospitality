import type { Apartment, AuthFormState, AuthResponse, BookingRequest, BookingResponse, BookingSummary, ProfileResponse, ProfileUpdatePayload } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SESSION_STORAGE_KEY = 'hospitality-auth-session';

export function saveSession(session: AuthResponse) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getStoredSession(): AuthResponse | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthResponse;
  } catch {
    return null;
  }
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const session = getStoredSession();
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (session) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  if (options?.headers) {
    new Headers(options.headers).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchApartments(): Promise<Apartment[]> {
  return request<Apartment[]>('/apartments');
}

export async function fetchApartment(id: string): Promise<Apartment> {
  return request<Apartment>(`/apartments/${id}`);
}

export async function submitBooking(booking: BookingRequest): Promise<BookingResponse> {
  return request<BookingResponse>('/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  });
}

export async function register(payload: AuthFormState): Promise<AuthResponse> {
  const response = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  saveSession(response);
  return response;
}

export async function login(payload: AuthFormState): Promise<AuthResponse> {
  const response = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  saveSession(response);
  return response;
}

export async function getProfile(id: string): Promise<ProfileResponse> {
  return request<ProfileResponse>(`/users/${id}`);
}

export async function updateProfile(id: string, payload: ProfileUpdatePayload): Promise<ProfileResponse> {
  return request<ProfileResponse>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getUserBookings(userId: string): Promise<BookingSummary[]> {
  return request<BookingSummary[]>(`/bookings/${userId}`);
}