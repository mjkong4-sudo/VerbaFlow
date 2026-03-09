"use client";

import { useState } from "react";

export function RefinementForm({
  onSubmit,
  disabled,
  placeholder = "e.g. shorter, more formal, focus on X",
}: {
  onSubmit: (feedback: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = feedback.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setFeedback("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] shadow-[var(--shadow-sm)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
      <button
        type="submit"
        disabled={disabled || !feedback.trim()}
        className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
      >
        Refine
      </button>
    </form>
  );
}
