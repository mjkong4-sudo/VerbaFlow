"use client";

import { useCallback, useEffect, useRef } from "react";

export function VoiceOutputButton({
  text,
  isSpeaking,
  onSpeakingChange,
  className = "",
}: {
  text: string;
  isSpeaking: boolean;
  onSpeakingChange: (speaking: boolean) => void;
  className?: string;
}) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onSpeakingChange(false);
  }, [onSpeakingChange]);

  const speak = useCallback(() => {
    if (!text?.trim()) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = () => onSpeakingChange(false);
    u.onerror = () => onSpeakingChange(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    onSpeakingChange(true);
  }, [text, onSpeakingChange]);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) window.speechSynthesis?.cancel();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) stop();
    else speak();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isSpeaking ? "Stop speaking" : "Listen"}
      className={
        "rounded-lg p-2 transition-colors " +
        (isSpeaking
          ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
          : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]") +
        " " +
        className
      }
      aria-label={isSpeaking ? "Stop speaking" : "Listen to this option"}
    >
      {isSpeaking ? (
        <StopIcon className="h-4 w-4" aria-hidden />
      ) : (
        <SpeakerIcon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
