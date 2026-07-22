export enum ContentConfidence {
  CONFIRMED = 'CONFIRMED',
  ASSUMED_DEMO = 'ASSUMED_DEMO',
  OWNER_REQUIRED = 'OWNER_REQUIRED',
}

export type ProfileFieldConfidence = Record<string, ContentConfidence>;
