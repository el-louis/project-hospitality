// apps/web/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APARTMENT_BOOKING_CURRENCY = "USD";

export function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
