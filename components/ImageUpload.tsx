"use client";

import { useState, useRef } from "react";

const ACCEPT = "image/png,image/jpeg,image/webp";

export function ImageUpload({
  onTextExtracted,
  disabled,
}: {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = async (file: File) => {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract text");
      const text = data.text || "";
      onTextExtracted(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to extract text");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file || disabled || isExtracting) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a PNG, JPEG, or WebP image.");
      return;
    }
    extractText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={
          "relative flex min-h-[80px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 text-center transition-colors " +
          (isDragging
            ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)]/50 hover:border-[var(--color-muted)] hover:bg-[var(--color-surface)]") +
          (disabled || isExtracting ? " pointer-events-none opacity-60" : "")
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={handleChange}
          className="sr-only"
          aria-label="Upload image to extract text"
        />
        {isExtracting ? (
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Extracting text…
          </p>
        ) : preview ? (
          <div className="flex items-center gap-2">
            <img
              src={preview}
              alt="Uploaded"
              className="h-10 w-10 rounded object-cover"
            />
            <span className="text-sm text-[var(--color-foreground)]">
              Text extracted. Upload another to replace.
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              className="rounded px-2 py-1 text-xs font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
            >
              Clear
            </button>
          </div>
        ) : (
          <>
            <ImageIcon className="mb-1 h-8 w-8 text-[var(--color-muted)]" />
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              Drop an image or click to upload
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              We’ll extract the text for you to refine
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-[var(--color-error-text)]">{error}</p>
      )}
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
