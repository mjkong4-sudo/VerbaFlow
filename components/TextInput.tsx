"use client";

export function TextInput({
  value,
  onChange,
  placeholder = "Paste or type your rough draft here...",
  disabled,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={8}
      className={
        "w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3.5 text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] shadow-[var(--shadow-sm)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 " +
        className
      }
    />
  );
}
