export const TONES = [
  "Professional",
  "Friendly",
  "Casual",
  "Formal",
  "Empathetic",
] as const;

export const CONTEXTS = [
  "Email",
  "Slack",
  "Presentation",
  "Doc",
  "Other",
] as const;

export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Korean",
  "Japanese",
] as const;

export type Tone = (typeof TONES)[number];
export type Context = (typeof CONTEXTS)[number];
export type Language = (typeof LANGUAGES)[number];

export interface RewriteOption {
  id: string;
  text: string;
  label?: string;
}

export interface ArchivedNote {
  original: string;
  rewritten: string;
}
