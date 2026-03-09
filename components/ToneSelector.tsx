"use client";

import { TONES, type Tone } from "@/lib/types";

export function ToneSelector({
  value,
  onChange,
  disabled,
}: {
  value: Tone;
  onChange: (t: Tone) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TONES.map((tone) => (
        <button
          key={tone}
          type="button"
          onClick={() => onChange(tone)}
          disabled={disabled}
          className={
            "rounded-lg px-3.5 py-2 text-sm font-medium transition-all " +
            (value === tone
              ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]"
              : "bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)]")
          }
        >
          {tone}
        </button>
      ))}
    </div>
  );
}
