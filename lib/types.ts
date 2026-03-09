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

export type Tone = (typeof TONES)[number];
export type Context = (typeof CONTEXTS)[number];

export interface RewriteOption {
  id: string;
  text: string;
  label?: string;
}
