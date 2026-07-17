// Original seal artwork for the fictional C.R.E.S.T. joint task force
// (LSPD + LSSD). Not a reproduction of any real municipal seal — composed
// from scratch: generic badge/star iconography split into the two
// department colors, not the specific flag/bear/eagle/castle elements a
// real city seal would use.
export function CrestSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="C.R.E.S.T. Task Force seal"
    >
      <title>C.R.E.S.T. Task Force — Los Santos</title>

      <defs>
        <clipPath id="crestLeftHalf">
          <rect x="0" y="0" width="100" height="200" />
        </clipPath>
        <clipPath id="crestRightHalf">
          <rect x="100" y="0" width="100" height="200" />
        </clipPath>
        <path
          id="crestTopArc"
          d="M 26.7,73.3 A 78,78 0 0,1 173.3,73.3"
          fill="none"
        />
        <path
          id="crestBottomArc"
          d="M 173.3,126.7 A 78,78 0 0,0 26.7,126.7"
          fill="none"
        />
        <path
          id="crestShield"
          d="M100,50 L146,66 L146,112 C146,140 126,157 100,164 C74,157 54,140 54,112 L54,66 Z"
        />
      </defs>

      {/* outer rings */}
      <circle cx="100" cy="100" r="96" fill="#c9a15a" stroke="#2b2b2b" strokeWidth="2" />
      <circle cx="100" cy="100" r="88" fill="#d8d8d8" stroke="#2b2b2b" strokeWidth="1.5" />
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * 2 * Math.PI;
        const x = 100 + 92 * Math.cos(angle);
        const y = 100 + 92 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="1.8" fill="#2b2b2b" />;
      })}
      <circle cx="100" cy="100" r="78" fill="#fff" stroke="#2b2b2b" strokeWidth="1.5" />

      {/* curved wordmark */}
      <text fontSize="10.5" fontWeight="bold" letterSpacing="1.2" fill="#2b2b2b">
        <textPath href="#crestTopArc" startOffset="50%" textAnchor="middle">
          C.R.E.S.T. TASK FORCE
        </textPath>
      </text>
      <text fontSize="10.5" fontWeight="bold" letterSpacing="1.5" fill="#2b2b2b">
        <textPath href="#crestBottomArc" startOffset="50%" textAnchor="middle">
          LOS SANTOS
        </textPath>
      </text>

      {/* center shield: LSPD navy / LSSD tan, joined */}
      <use href="#crestShield" fill="#0a1f44" clipPath="url(#crestLeftHalf)" />
      <use href="#crestShield" fill="#8a7648" clipPath="url(#crestRightHalf)" />
      <use href="#crestShield" fill="none" stroke="#2b2b2b" strokeWidth="2.5" />
      <line x1="100" y1="50" x2="100" y2="164" stroke="#2b2b2b" strokeWidth="1.2" />

      <path
        d="M100,79 L103.8,89.7 L115.2,90.1 L106.2,97.0 L109.4,107.9 L100,101.5 L90.6,107.9 L93.8,97.0 L84.8,90.1 L96.2,89.7 Z"
        fill="#d4af37"
        stroke="#2b2b2b"
        strokeWidth="1"
      />

      <text
        x="77"
        y="145"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fill="#fff"
      >
        LSPD
      </text>
      <text
        x="123"
        y="145"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fill="#fff"
      >
        LSSD
      </text>

      <text
        x="100"
        y="118"
        fontSize="6.5"
        fontWeight="bold"
        letterSpacing="0.5"
        textAnchor="middle"
        fill="#2b2b2b"
      >
        JOINT OPERATIONS
      </text>
    </svg>
  );
}
