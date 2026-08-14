import React, { useState, useEffect, useRef } from "react"
import { Sign, FaceExpr } from "./types"
import { C } from "./dictionary"
import { HandSVG } from "./HandSVG"

export const SPEEDS = [{ label: "Lento", fps: 16 }, { label: "Normal", fps: 34 }, { label: "Rápido", fps: 58 }]

export function useAvatarAnim(playing: boolean, speedIdx: number) {
  const [frame, setFrame] = useState(0)
  const rafRef = useRef<number>(0)
  const lastRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!playing) return
    const ms = 1000 / SPEEDS[speedIdx].fps
    const loop = (now: number) => {
      if (now - lastRef.current >= ms) {
        frameRef.current = (frameRef.current + 1) % 100
        setFrame(frameRef.current)
        lastRef.current = now
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, speedIdx])

  return { frame, frameRef }
}

export function Avatar({ sign, animFrame, isPlaying, scale = 1 }: {
  sign: Sign; animFrame: number; isPlaying: boolean; scale?: number
}) {
  const t = (animFrame / 100) * Math.PI * 2
  const ease = Math.sin(t)
  const abs = Math.abs(ease)

  type ArmPos = { lx: number; ly: number; rx: number; ry: number; lRot: number; rRot: number }
  const base: ArmPos = { lx: -62, ly: 18, rx: 62, ry: 18, lRot: -22, rRot: 22 }

  const locationY: Record<Sign["location"], number> = {
    chest: 28, head: -52, chin: -28, forehead: -56, side: 8, center: 0, low: 58,
  }
  const locY = locationY[sign.location]

  const arm = ((): ArmPos => {
    switch (sign.movement) {
      case "up-down":       return { ...base, ly: 18 + ease * 24, ry: 18 + ease * 24 }
      case "left-right":    return { ...base, lx: -62 + ease * 20, rx: 62 - ease * 20 }
      case "circular":      return { ...base, lx: -55 + Math.cos(t) * 22, ly: 14 + Math.sin(t) * 16, rx: 55 - Math.cos(t) * 22, ry: 14 + Math.sin(t) * 16 }
      case "toward-chest":  return { ...base, lx: -62 + abs * 26, rx: 62 - abs * 26 }
      case "away-chest":    return { ...base, lx: -62 - abs * 22, rx: 62 + abs * 22 }
      case "tap":           return { ...base, lx: -52 + abs * 18 }
      case "forward":       return { ...base, lx: -62 + ease * 16, rx: 62 - ease * 16, ly: 18 + ease * 7, ry: 18 + ease * 7 }
      case "rise":          return { ...base, ly: 18 - abs * 34, ry: 18 - abs * 34, lRot: -30, rRot: 30 }
      case "down":          return { ...base, ly: 12 + abs * 30, ry: 12 + abs * 30 }
      case "clap":          return { ...base, lx: -62 + abs * 50, rx: 62 - abs * 50 }
      case "wave":          return { ...base, lRot: -22 + ease * 28, rRot: 22 - ease * 28 }
      default:              return base
    }
  })()

  const faceMap: Record<FaceExpr, { brow: string; mouth: string; eyeRy: number }> = {
    neutral:  { brow: "M-12,-3 L-4,-5",       mouth: "M-7,10 Q0,13 7,10",  eyeRy: 4.5 },
    affirm:   { brow: "M-12,-7 L-4,-9",        mouth: "M-10,7 Q0,17 10,7",  eyeRy: 4.5 },
    question: { brow: "M-12,-3 Q-8,-9 -4,-5",  mouth: "M-5,10 Q0,8 5,13",   eyeRy: 5 },
    concern:  { brow: "M-12,-4 Q-8,1 -4,-2",   mouth: "M-8,13 Q0,9 8,13",   eyeRy: 3.5 },
    warm:     { brow: "M-12,-7 Q-8,-11 -4,-9", mouth: "M-10,6 Q0,19 10,6",  eyeRy: 4.5 },
  }
  const fd = faceMap[sign.faceExpr]
  const W = 320, H = 430, cx = W / 2, bodyY = 158

  return (
    <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible" }}
      aria-label={`Avatar LSP realizando la seña: ${sign.word}`}>
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.1" />
          <stop offset="100%" stopColor={C.navy} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="skinG" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={C.skin} />
          <stop offset="100%" stopColor={C.skinDark} />
        </radialGradient>
        <filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="8" floodColor={C.navy} floodOpacity="0.5" /></filter>
        <filter id="handGlow"><feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={C.gold} floodOpacity="0.3" /></filter>
      </defs>

      <ellipse cx={cx} cy={H - 24} rx={115} ry={20} fill="url(#bgGlow)" />

      <g filter="url(#shadow)">
        <path d={`M${cx-54} ${bodyY+58} Q${cx-60} ${bodyY+165} ${cx-40} ${bodyY+205} L${cx+40} ${bodyY+205} Q${cx+60} ${bodyY+165} ${cx+54} ${bodyY+58} Q${cx} ${bodyY+38} ${cx-54} ${bodyY+58}z`} fill={C.shirt} />
        <path d={`M${cx-24} ${bodyY+56} Q${cx} ${bodyY+80} ${cx+24} ${bodyY+56}`} stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" fill="none" />
        <circle cx={cx-20} cy={bodyY+92} r="7.5" fill={C.gold} />
        <path d="M-3,-3 L0,4 L3,-3 L0,-1z" fill="#fff" transform={`translate(${cx-20},${bodyY+91})`} />
      </g>

      <rect x={cx-15} y={bodyY+8} width={30} height={56} rx={11} fill="url(#skinG)" />

      <g filter="url(#shadow)">
        <ellipse cx={cx} cy={bodyY-30} rx={54} ry={62} fill="url(#skinG)" />
        <path d={`M${cx-54} ${bodyY-30} Q${cx-58} ${bodyY-86} ${cx-28} ${bodyY-96} Q${cx} ${bodyY-106} ${cx+28} ${bodyY-96} Q${cx+58} ${bodyY-86} ${cx+54} ${bodyY-30} Q${cx+42} ${bodyY-55} ${cx} ${bodyY-57} Q${cx-42} ${bodyY-55} ${cx-54} ${bodyY-30}z`} fill={C.hair} />
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse cx={cx + side * 55} cy={bodyY-24} rx="8" ry="11" fill="url(#skinG)" />
          </g>
        ))}
        {[-20, 20].map((ex) => (
          <g key={ex} transform={`translate(${cx+ex},${bodyY-36})`}>
            <ellipse cx="0" cy="0" rx="6.5" ry={fd.eyeRy + 2} fill="white" />
            <circle cx="0" cy="1" r={fd.eyeRy - 0.5} fill={C.navy} />
            <circle cx="1.5" cy="-1.5" r="1.8" fill="white" />
            <path d={ex < 0 ? fd.brow : fd.brow.replace(/(-?\d+(?:\.\d+)?),/g, (_, n) => `${-parseFloat(n)},`)} stroke={C.hair} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        ))}
        <path d={`M${cx-7} ${bodyY-16} Q${cx} ${bodyY-7} ${cx+7} ${bodyY-16}`} stroke={C.skinDark} strokeWidth="1.5" fill="none" opacity="0.45" />
        <g transform={`translate(${cx},${bodyY-5})`}>
          <path d={fd.mouth} stroke={C.skinDark} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.75" />
        </g>
      </g>

      <g transform={`translate(${cx + arm.lx}, ${bodyY + 80 + arm.ly + locY}) rotate(${arm.lRot})`}>
        <rect x="-10" y="-52" width="20" height="57" rx="10" fill={C.shirt} />
        <rect x="-9" y="2" width="18" height="47" rx="9" fill="url(#skinG)" />
        <g transform="translate(-32,-10)" filter="url(#handGlow)">
          <HandSVG shape={sign.dominant} size={66} color={C.skin} darkColor={C.skinDark} />
        </g>
      </g>

      {sign.twoHands ? (
        <g transform={`translate(${cx + arm.rx}, ${bodyY + 80 + arm.ry + locY}) rotate(${arm.rRot})`}>
          <rect x="-10" y="-52" width="20" height="57" rx="10" fill={C.shirt} />
          <rect x="-9" y="2" width="18" height="47" rx="9" fill="url(#skinG)" />
          <g transform="translate(-32,-10)" filter="url(#handGlow)">
            <HandSVG shape={sign.nonDominant} size={66} color={C.skin} darkColor={C.skinDark} mirrored />
          </g>
        </g>
      ) : (
        <g transform={`translate(${cx + 62}, ${bodyY + 98})`}>
          <rect x="-10" y="-32" width="20" height="52" rx="10" fill={C.shirt} />
          <rect x="-9" y="18" width="18" height="38" rx="9" fill="url(#skinG)" />
          <g transform="translate(-28,44)">
            <HandSVG shape="flat" size={54} color={C.skin} darkColor={C.skinDark} mirrored />
          </g>
        </g>
      )}

      {isPlaying && [0.18, 0.45, 0.72].map((off, i) => {
        const tt = ((animFrame / 100 + off) % 1) * Math.PI * 2
        const trailX = cx + arm.lx + Math.cos(tt) * (sign.movement === "circular" ? 22 : 8)
        const trailY = bodyY + 80 + arm.ly + locY + Math.sin(tt) * (sign.movement === "up-down" ? 20 : 6)
        return <circle key={i} cx={trailX} cy={trailY} r={4.5 - i * 1.2} fill={C.gold} opacity={(0.9 - i * 0.28) * 0.5} />
      })}
    </svg>
  )
}
