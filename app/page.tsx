"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { TextInput } from "@/components/TextInput";
import { ToneSelector } from "@/components/ToneSelector";
import { ContextSelector } from "@/components/ContextSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { RewriteOptions } from "@/components/RewriteOptions";
import { RefinementForm } from "@/components/RefinementForm";
import { LearningNote } from "@/components/LearningNote";
import { EmptyState } from "@/components/EmptyState";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { ImageUpload } from "@/components/ImageUpload";
import type { Context, Tone, Language } from "@/lib/types";
import type { RewriteOption } from "@/lib/types";

const SAMPLE_TEXT = "Revert the change when you can.";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ResultsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [context, setContext] = useState<Context>("Email");
  const [language, setLanguage] = useState<Language>("English");
  const [options, setOptions] = useState<RewriteOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refineLoading, setRefineLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const selectedOption = options.find((o) => o.id === selectedId);

  const handleVoiceTranscript = (transcript: string) => {
    setInputText((prev) => (prev ? prev + " " + transcript : transcript));
  };

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim(), tone, context, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refine expression. Please try again.");
      setOptions(data.options);
      setSelectedId(data.options[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (feedback: string) => {
    if (!selectedOption?.text.trim()) return;
    setError(null);
    setRefineLoading(true);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText: selectedOption.text,
          feedback,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refine expression. Please try again.");
      const newOpt = data.options[0];
      if (newOpt) {
        setOptions((prev) => [...prev, newOpt]);
        setSelectedId(newOpt.id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setRefineLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-20 focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]"
      >
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen flex flex-col relative z-[1]">
        <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-md px-6 py-5 shadow-[var(--shadow-sm)]">
          <Logo className="h-9 w-auto text-[var(--color-primary)]" />
        </header>

        <div className="flex flex-1 flex-col lg:flex-row gap-8 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {/* Input panel – subtle "source" identity */}
          <section
            aria-label="Input"
            className="flex flex-col gap-6 lg:min-w-[340px] lg:max-w-[400px] rounded-2xl border-l-4 border-l-[var(--color-primary)]/30 bg-[var(--color-card)]/50 pl-6 pr-2 py-5 lg:py-6"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                AI-powered rewriting
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)] tracking-tight max-w-[22ch] leading-tight">
                Turn rough words into clear, natural expression.
              </h1>
              <p className="mt-2 text-sm text-[var(--color-muted)] max-w-[28ch]">
                Choose your tone and context, then refine until it fits.
              </p>
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-muted-strong)] tracking-tight">
              Your text
            </h2>
          <ImageUpload
            onTextExtracted={(text) => setInputText(text)}
            disabled={isLoading}
          />
          <div className="relative">
            <TextInput
              value={inputText}
              onChange={setInputText}
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3">
              <VoiceInputButton
                onTranscript={handleVoiceTranscript}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="rounded-xl bg-[var(--color-surface)]/60 p-3.5">
            <label className="mb-2 block text-sm font-semibold text-[var(--color-muted-strong)] tracking-tight">
              Tone
            </label>
            <ToneSelector
              value={tone}
              onChange={setTone}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-muted-strong)] tracking-tight">
              Context
            </label>
            <ContextSelector
              value={context}
              onChange={setContext}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-muted-strong)] tracking-tight">
              Output language
            </label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            onClick={handleRewrite}
            disabled={isLoading || !inputText.trim()}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-md)] hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-lg)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                Rewriting…
              </>
            ) : (
              <>
                <SparkleIcon className="h-5 w-5" aria-hidden />
                Refine expression
              </>
            )}
          </button>
          </section>

          {/* Output panel – glass/depth when content present (app-market trend) */}
          <section
            aria-label="Rewritten options"
            aria-live="polite"
            aria-atomic="false"
            className={`flex-1 flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] p-6 md:p-8 min-h-[320px] ${
              options.length > 0
                ? "bg-[var(--color-card)]/90 backdrop-blur-sm shadow-[var(--shadow-lg)]"
                : "bg-[var(--color-card)] shadow-[var(--shadow-sm)]"
            }`}
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted-strong)] tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]" aria-hidden>
                <ResultsIcon className="h-3.5 w-3.5" />
              </span>
              Rewritten options
            </h2>
            {error && (
              <div
                className="error-message-enter rounded-xl border-l-4 px-4 py-3 text-sm bg-[var(--color-error-bg)] border-l-[var(--color-error-border)] text-[var(--color-error-text)]"
                role="alert"
              >
                {error}
              </div>
            )}
          <RewriteOptions
            options={options}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onCopy={handleCopy}
            onSpeak={(id) => setSpeakingId(id)}
            speakingId={speakingId}
            isLoading={isLoading}
          />
          {options.length > 0 && selectedOption && (
            <>
              <LearningNote
                original={inputText.trim()}
                rewritten={selectedOption.text}
              />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Refine further
                </label>
                <RefinementForm
                  onSubmit={handleRefine}
                  disabled={refineLoading}
                  placeholder='e.g. "shorter", "more formal", "focus on X"'
                />
              </div>
            </>
          )}
            {options.length === 0 && !isLoading && (
              <EmptyState
                onTrySample={() => setInputText(SAMPLE_TEXT)}
              />
            )}
            {copied && (
              <div
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/15 px-4 py-2 text-sm font-medium text-[var(--color-accent)] border border-[var(--color-accent)]/30"
                role="status"
              >
                <CheckIcon className="h-4 w-4" aria-hidden />
                Copied
              </div>
            )}
          </section>
        </div>

        <footer className="border-t-2 border-t-[var(--color-primary)]/20 bg-[var(--color-card)]/80 py-6 px-6 text-center">
          <p className="text-xs text-[var(--color-muted)]">
            Your text is not stored. Processed only for rewriting.
          </p>
        </footer>
      </main>
    </>
  );
}
