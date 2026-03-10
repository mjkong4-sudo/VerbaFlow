"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function VoiceOutputButton({
  text,
  isSpeaking,
  onSpeakingChange,
  onRegisterActive,
  className = "",
}: {
  text: string;
  isSpeaking: boolean;
  onSpeakingChange: (speaking: boolean) => void;
  /** Call with this button's stop function when starting; parent can call it to stop this when another option starts */
  onRegisterActive?: (stop: () => void) => void;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    setIsLoading(false);
    onSpeakingChange(false);
  }, [onSpeakingChange]);

  const speak = useCallback(async () => {
    if (!text?.trim()) return;
    if (typeof window === "undefined") return;

    stop();

    onRegisterActive?.(stop);
    onSpeakingChange(true);
    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate speech");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        onSpeakingChange(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        onSpeakingChange(false);
      };

      await audio.play();
      onSpeakingChange(true);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error("Voice output error:", e);
      onSpeakingChange(false);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [text, onSpeakingChange, stop]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking || isLoading) stop();
    else speak();
  };

  const busy = isSpeaking || isLoading;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!text?.trim()}
      title={busy ? "Stop" : "Listen (AI voice)"}
      className={
        "rounded-lg p-2 transition-colors disabled:opacity-50 " +
        (busy
          ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
          : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]") +
        " " +
        className
      }
      aria-label={busy ? "Stop speaking" : "Listen to this option (AI voice)"}
    >
      {isLoading ? (
        <SpinnerIcon className="h-4 w-4 animate-spin" aria-hidden />
      ) : isSpeaking ? (
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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
