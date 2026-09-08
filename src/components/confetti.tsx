const COLORS = [
  "var(--coral)",
  "var(--matcha)",
  "var(--gold)",
  "var(--sky)",
  "var(--coral-soft)",
];

export function ConfettiBurst({ pieces = 40 }: { pieces?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: pieces }).map((_, i) => {
        const left = Math.random() * 100;
        const dx = Math.round((Math.random() - 0.5) * 220);
        const delay = Math.random() * 0.5;
        const duration = 1.2 + Math.random() * 1.1;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              background: COLORS[i % COLORS.length],
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              ["--dx" as string]: `${dx}px`,
            }}
          />
        );
      })}
    </div>
  );
}
