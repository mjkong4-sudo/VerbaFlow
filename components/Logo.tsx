/** VerbaFlow logo: speech bubble → flowing line → clean sentence */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Speech bubble shape */}
      <path
        d="M8 4h24a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H14l-4 4V4a4 4 0 0 1 4-4Z"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flowing line into clean line */}
      <path
        d="M42 12h8M42 16h14M42 20h6"
        stroke="var(--color-accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Word mark */}
      <text
        x="58"
        y="20"
        fill="var(--color-neutral)"
        fontSize="14"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        VerbaFlow
      </text>
    </svg>
  );
}
