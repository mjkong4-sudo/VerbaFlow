"use client";

import { LANGUAGES, type Language } from "@/lib/types";

export function LanguageSelector({
  value,
  onChange,
  disabled,
}: {
  value: Language;
  onChange: (l: Language) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      disabled={disabled}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2 text-sm font-medium text-[var(--color-foreground)] shadow-[var(--shadow-sm)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
      aria-label="Output language"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
}
