import type {
  Apartment,
  AuthFormState,
  AuthResponse,
  BookingRequest,
  BookingResponse,
  BookingSummary,
  ProfileResponse,
  ProfileUpdatePayload,
  PublicFeatureFlags,
  RedMasaiProfile,
  ProtectedRedMasaiProfile,
  Offering,
  OfferingCategory,
  PublicOffering,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const AUTH_STATE_EVENT = "hospitality-auth-state";

async function request<T>(
  path: string,
  options?: RequestInit,
  allowRefresh = true,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (response.status === 401 && allowRefresh && !path.startsWith("/auth/")) {
    const refreshed = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (refreshed.ok) return request<T>(path, options, false);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: unknown;
    } | null;
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : "The request could not be completed. Please try again.";
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function announceAuthChange(): void {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

export const fetchApartments = () => request<Apartment[]>("/apartments");
export const fetchApartment = (id: string) =>
  request<Apartment>(`/apartments/${id}`);
export const submitBooking = (booking: BookingRequest) =>
  request<BookingResponse>("/bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });

export async function register(payload: AuthFormState): Promise<AuthResponse> {
  const response = await request<AuthResponse>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    false,
  );
  announceAuthChange();
  return response;
}

export async function login(payload: AuthFormState): Promise<AuthResponse> {
  const response = await request<AuthResponse>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(payload) },
    false,
  );
  announceAuthChange();
  return response;
}

export async function logout(): Promise<void> {
  await request<void>("/auth/logout", { method: "POST", body: "{}" }, false);
  announceAuthChange();
}

export const getCurrentUser = () => request<AuthResponse>("/auth/me");
export const getProfile = () => request<ProfileResponse>("/users/me");
export const updateProfile = (payload: ProfileUpdatePayload) =>
  request<ProfileResponse>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
export const getUserBookings = () => request<BookingSummary[]>("/bookings/me");
export const cancelBooking = (reference: string) =>
  request<BookingSummary>(`/bookings/${encodeURIComponent(reference)}/cancel`, {
    method: "POST",
    body: "{}",
  });

export const fetchPublicFeatures = () =>
  request<PublicFeatureFlags>("/features/public");
export const fetchRedMasaiProfile = () =>
  request<RedMasaiProfile>("/red-masai/public");
export const fetchOfferings = (category?: OfferingCategory) =>
  request<PublicOffering[]>(
    `/offerings${category ? `?category=${encodeURIComponent(category)}` : ""}`,
  );
export const getManagedProfile = () =>
  request<ProtectedRedMasaiProfile>("/red-masai");
export const updateManagedProfile = (
  payload: Partial<ProtectedRedMasaiProfile>,
) =>
  request<ProtectedRedMasaiProfile>("/red-masai", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
export const getManagedOfferings = () =>
  request<Offering[]>("/offerings/manage");
export const createOffering = (payload: Omit<Offering, "id">) =>
  request<Offering>("/offerings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateOffering = (id: string, payload: Partial<Offering>) =>
  request<Offering>(`/offerings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
