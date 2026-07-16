// Original "Galaxy Archive" mark, drawn in the Samsung One UI / Android visual
// language — a rounded app-icon "squircle" in Samsung blue with a clean white
// phone glyph. This is our own logo, not Samsung's trademark, so the site stays
// clearly unofficial.
export default function BrandMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Galaxy Archive"
    >
      <defs>
        <linearGradient id="ga-mark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f4ede" />
          <stop offset="1" stopColor="#14259c" />
        </linearGradient>
      </defs>
      {/* One UI-style squircle */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="13.5" fill="url(#ga-mark)" />
      {/* subtle top light for depth */}
      <rect x="1.5" y="1.5" width="45" height="22" rx="13.5" fill="#ffffff" opacity="0.10" />
      {/* phone glyph */}
      <rect
        x="17.5"
        y="11.5"
        width="13"
        height="25"
        rx="3.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
      />
      <circle cx="24" cy="31.5" r="1.5" fill="#ffffff" />
    </svg>
  );
}
