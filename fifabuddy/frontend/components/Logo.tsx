"use client";

type Props = {
  size?: number;
  animated?: boolean;
};

export function Logo({ size = 32, animated = true }: Props) {
  const s = size;
  const pulseClass = animated ? "anim-glow" : "";

  return (
    <div
      className={pulseClass}
      style={{
        width: s, height: s, borderRadius: 10,
        background: "linear-gradient(135deg, var(--green), var(--emerald))",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", flexShrink: 0,
      }}
    >
      <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#06060e" />
      </svg>
      {animated && (
        <div style={{
          position: "absolute", inset: -3, borderRadius: 13,
          border: "1.5px solid rgba(0,232,122,0.15)",
          animation: "logoSpin 4s linear infinite",
        }} />
      )}
    </div>
  );
}
