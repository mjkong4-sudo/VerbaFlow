"use client";

export function EmptyState({ onTrySample }: { onTrySample?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-organic)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60 py-20 px-10 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]"
        aria-hidden
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
        Your rewrites will appear here
      </h3>
      <p className="text-sm text-[var(--color-muted)] max-w-[300px] leading-relaxed mb-6">
        Paste your text in the left panel, then click <strong className="text-[var(--color-foreground)]">Refine expression</strong> to get clear, natural alternatives.
      </p>
      {onTrySample && (
        <button
          type="button"
          onClick={onTrySample}
          className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        >
          Try sample
        </button>
      )}
    </div>
  );
}
