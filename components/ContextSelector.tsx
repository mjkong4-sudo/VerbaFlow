"use client";

import { CONTEXTS, type Context } from "@/lib/types";

export function ContextSelector({
  value,
  onChange,
  disabled,
}: {
  value: Context;
  onChange: (c: Context) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Context)}
      disabled={disabled}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2 text-sm font-medium text-[var(--color-foreground)] shadow-[var(--shadow-sm)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
    >
      {CONTEXTS.map((ctx) => (
        <option key={ctx} value={ctx}>
          {ctx}
        </option>
      ))}
    </select>
  );
}
