"use client";

export function LearningNote({
  original,
  rewritten,
}: {
  original: string;
  rewritten: string;
}) {
  if (!original?.trim() || !rewritten?.trim()) return null;

  return (
    <div className="rounded-xl border border-[var(--color-border)] border-l-4 border-l-[var(--color-accent)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">
        <LightbulbIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
        Learning note
      </p>
      <p className="text-sm leading-relaxed text-[var(--color-foreground)]">
        <span className="text-[var(--color-muted)] line-through">{original}</span>
        {" → "}
        <span className="font-medium text-[var(--color-accent)]">{rewritten}</span>
      </p>
    </div>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
