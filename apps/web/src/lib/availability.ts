export type AvailabilityBlock = {
  apartmentId: string;
  startDate: string;
  endDate: string;
  blocked: boolean;
  reason?: string;
};

export async function getAvailability(apartmentId: string): Promise<AvailabilityBlock[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/availability/${apartmentId}`);
  if (!response.ok) {
    throw new Error('Unable to load availability');
  }
  return response.json();
}

export async function blockAvailability(apartmentId: string, payload: Omit<AvailabilityBlock, 'apartmentId'>) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/availability/${apartmentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to update availability');
  }

  return response.json();
}
