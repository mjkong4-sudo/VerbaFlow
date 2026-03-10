"use client";

import { useRef } from "react";
import type { RewriteOption } from "@/lib/types";
import { VoiceOutputButton } from "@/components/VoiceOutputButton";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

const STAGGER = ["stagger-1", "stagger-2", "stagger-3"];

export function RewriteOptions({
  options,
  selectedId,
  onSelect,
  onCopy,
  onSpeak,
  speakingId,
  isLoading,
}: {
  options: RewriteOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCopy?: (text: string) => void;
  onSpeak?: (id: string | null) => void;
  speakingId?: string | null;
  isLoading?: boolean;
}) {
  const speakerStopRef = useRef<(() => void) | null>(null);

  const registerSpeakerStop = (stop: () => void) => {
    speakerStopRef.current?.();
    speakerStopRef.current = stop;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {options.map((opt, index) => {
        const isSelected = selectedId === opt.id;
        const stagger = STAGGER[index % 3];
        return (
          <div
            key={opt.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(opt.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(opt.id);
              }
            }}
            className={
              "animate-fade-in opacity-0 " +
              stagger +
              " flex items-start gap-4 rounded-xl border p-5 text-left transition-all duration-200 cursor-pointer " +
              (isSelected
                ? "border-l-4 border-l-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-accent-muted)] shadow-[var(--shadow-md)] ring-2 ring-[var(--color-accent)]/25"
                : "border-l-4 border-l-transparent border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-sm)] hover-lift hover:border-[var(--color-muted)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5")
            }
          >
            <div className="flex-1 min-w-0">
              {opt.label && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--color-surface)] text-[10px] font-bold text-[var(--color-muted-strong)]">
                    {index + 1}
                  </span>
                  {opt.label}
                </span>
              )}
              <p className="text-[var(--color-foreground)] text-[15px] leading-relaxed">
                {opt.text}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {onSpeak && (
                <VoiceOutputButton
                  text={opt.text}
                  isSpeaking={speakingId === opt.id}
                  onSpeakingChange={(v) => onSpeak(v ? opt.id : null)}
                  onRegisterActive={registerSpeakerStop}
                  className="shrink-0"
                />
              )}
              {onCopy && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(opt.text);
                  }}
                  className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                  title="Copy"
                  aria-label="Copy to clipboard"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              )}
              {isSelected && (
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-sm font-medium"
                  aria-hidden
                >
                  ✓
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
