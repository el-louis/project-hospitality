export type AvailabilityRange = {
  id?: string;
  source: "booking" | "manual";
  startDate: string;
  endDate: string;
  reason?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getAvailability(
  apartmentId: string,
): Promise<AvailabilityRange[]> {
  const response = await fetch(`${API_BASE_URL}/availability/${apartmentId}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load availability");
  return response.json();
}

export async function blockAvailability(
  apartmentId: string,
  payload: Pick<AvailabilityRange, "startDate" | "endDate" | "reason">,
) {
  const response = await fetch(
    `${API_BASE_URL}/availability/${apartmentId}/blocks`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) throw new Error("Unable to update availability");
  return response.json();
}

export async function removeAvailabilityBlock(
  apartmentId: string,
  blockId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/availability/${apartmentId}/blocks/${blockId}`,
    { method: "DELETE", credentials: "include" },
  );
  if (!response.ok) throw new Error("Unable to remove availability block");
}
