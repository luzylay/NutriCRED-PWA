import React, { type ReactElement } from "react"
import { HandShape } from "./types"
import { C } from "./dictionary"

export function HandSVG({ shape, mirrored = false, size = 64, color = C.skin, darkColor = C.skinDark }: {
  shape: HandShape; mirrored?: boolean; size?: number; color?: string; darkColor?: string
}) {
  const shapes: Record<HandShape, ReactElement> = {
    open: <g>
      <ellipse cx="32" cy="44" rx="18" ry="14" fill={color} />
      <ellipse cx="11" cy="36" rx="6" ry="9" fill={color} transform="rotate(-20,11,36)" />
      <rect x="14" y="12" width="8" height="24" rx="4" fill={color} />
      <rect x="24" y="8" width="8" height="26" rx="4" fill={color} />
      <rect x="34" y="10" width="8" height="24" rx="4" fill={color} />
      <rect x="44" y="16" width="7" height="20" rx="3.5" fill={color} />
      <path d="M14 34 Q32 38 50 34" stroke={darkColor} strokeWidth="1.5" fill="none" opacity="0.45" />
    </g>,
    fist: <g>
      <path d="M12 32 Q32 26 52 32 Q52 54 32 58 Q12 54 12 32z" fill={color} />
      <path d="M16 32 Q32 28 48 32" stroke={darkColor} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M14 40 Q32 36 50 40" stroke={darkColor} strokeWidth="1" fill="none" opacity="0.3" />
      <ellipse cx="10" cy="28" rx="7" ry="9" fill={color} transform="rotate(15,10,28)" />
    </g>,
    index: <g>
      <ellipse cx="32" cy="48" rx="18" ry="13" fill={color} />
      <path d="M24 36 Q20 48 18 52 Q26 56 36 52 Q40 48 40 36" fill={color} />
      <rect x="25" y="8" width="10" height="30" rx="5" fill={color} />
      <ellipse cx="12" cy="38" rx="6" ry="8" fill={color} transform="rotate(-15,12,38)" />
    </g>,
    two: <g>
      <ellipse cx="32" cy="48" rx="18" ry="12" fill={color} />
      <rect x="21" y="8" width="9" height="30" rx="4.5" fill={color} />
      <rect x="33" y="8" width="9" height="30" rx="4.5" fill={color} />
      <path d="M18 44 Q32 40 46 44" stroke={darkColor} strokeWidth="1.5" fill="none" opacity="0.4" />
      <ellipse cx="12" cy="40" rx="6" ry="8" fill={color} transform="rotate(-10,12,40)" />
    </g>,
    three: <g>
      <ellipse cx="32" cy="46" rx="18" ry="12" fill={color} />
      <rect x="14" y="10" width="8" height="28" rx="4" fill={color} />
      <rect x="24" y="8" width="8" height="28" rx="4" fill={color} />
      <rect x="34" y="10" width="8" height="26" rx="4" fill={color} />
      <path d="M12 36 Q32 32 52 36" stroke={darkColor} strokeWidth="1.5" fill="none" opacity="0.4" />
      <ellipse cx="8" cy="36" rx="6" ry="8" fill={color} transform="rotate(-15,8,36)" />
    </g>,
    ok: <g>
      <circle cx="24" cy="42" r="11" fill="none" stroke={color} strokeWidth="10" />
      <ellipse cx="24" cy="42" rx="7" ry="7" fill={color} />
      <rect x="32" y="12" width="8" height="24" rx="4" fill={color} />
      <rect x="42" y="14" width="8" height="22" rx="4" fill={color} />
      <rect x="50" y="18" width="7" height="18" rx="3.5" fill={color} />
    </g>,
    pinch: <g>
      <ellipse cx="32" cy="46" rx="16" ry="13" fill={color} />
      <ellipse cx="20" cy="28" rx="6" ry="10" fill={color} transform="rotate(-20,20,28)" />
      <ellipse cx="30" cy="22" rx="5" ry="10" fill={color} transform="rotate(10,30,22)" />
      <circle cx="24" cy="32" r="5" fill={darkColor} opacity="0.45" />
      <rect x="36" y="18" width="7" height="22" rx="3.5" fill={color} />
    </g>,
    claw: <g>
      <ellipse cx="32" cy="42" rx="18" ry="14" fill={color} />
      <path d="M14 28 Q12 18 18 14 Q22 20 20 30" fill={color} />
      <path d="M23 24 Q22 12 28 8 Q33 14 31 26" fill={color} />
      <path d="M33 24 Q33 12 38 9 Q43 14 41 26" fill={color} />
      <path d="M42 28 Q43 18 48 16 Q52 22 50 32" fill={color} />
      <ellipse cx="8" cy="34" rx="6" ry="8" fill={color} transform="rotate(-10,8,34)" />
    </g>,
    horns: <g>
      <ellipse cx="32" cy="48" rx="18" ry="11" fill={color} />
      <path d="M24 38 Q22 48 22 52 Q30 56 36 52 Q40 48 40 38" fill={color} />
      <rect x="14" y="8" width="8" height="30" rx="4" fill={color} />
      <rect x="44" y="10" width="7" height="28" rx="3.5" fill={color} />
    </g>,
    thumb: <g>
      <ellipse cx="32" cy="48" rx="16" ry="11" fill={color} />
      <path d="M20 38 Q18 48 20 54 Q28 58 36 54 Q40 48 38 38" fill={color} />
      <ellipse cx="14" cy="26" rx="7" ry="12" fill={color} transform="rotate(-10,14,26)" />
      <ellipse cx="14" cy="14" rx="6" ry="7" fill={color} />
    </g>,
    flat: <g>
      <ellipse cx="32" cy="46" rx="18" ry="13" fill={color} />
      <rect x="10" y="14" width="44" height="30" rx="6" fill={color} />
      <line x1="22" y1="14" x2="22" y2="40" stroke={darkColor} strokeWidth="1" opacity="0.22" />
      <line x1="32" y1="12" x2="32" y2="40" stroke={darkColor} strokeWidth="1" opacity="0.22" />
      <line x1="42" y1="14" x2="42" y2="40" stroke={darkColor} strokeWidth="1" opacity="0.22" />
      <ellipse cx="6" cy="36" rx="5" ry="8" fill={color} transform="rotate(-10,6,36)" />
    </g>,
    cup: <g>
      <path d="M10 20 Q8 44 14 52 Q32 58 50 52 Q56 44 54 20 Q42 14 32 14 Q22 14 10 20z" fill={color} />
      <path d="M14 26 Q32 32 50 26" stroke={darkColor} strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M12 36 Q32 42 52 36" stroke={darkColor} strokeWidth="1" fill="none" opacity="0.25" />
      <ellipse cx="6" cy="30" rx="5" ry="9" fill={color} transform="rotate(-20,6,30)" />
    </g>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64"
      style={{ transform: mirrored ? "scaleX(-1)" : undefined, overflow: "visible" }}
      aria-hidden="true">
      {shapes[shape]}
    </svg>
  )
}
