import { HandShape, Movement, Sign } from "./types"
import { LSP_DICTIONARY } from "./dictionary"

export type MPLandmark = { x: number; y: number; z: number }

export function classifyHandShape(lm: MPLandmark[]): HandShape | null {
  if (!lm || lm.length < 21) return null
  const wrist = lm[0], midMCP = lm[9]
  const handUp = wrist.y > midMCP.y
  const dir = handUp ? -1 : 1
  const ext = (tip: number, pip: number) => dir * (lm[tip].y - lm[pip].y) < -0.025
  const index  = ext(8, 6), middle = ext(12, 10), ring = ext(16, 14), pinky = ext(20, 18)
  const thumbSplay = Math.abs(lm[4].x - lm[2].x) > 0.05
  const handSize = Math.hypot(midMCP.x - wrist.x, midMCP.y - wrist.y) * 2.5
  const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y)
  const pinching = pinchDist < Math.max(handSize * 0.3, 0.06)
  const pb = (tip: number, mcp: number) => { const d = Math.hypot(lm[tip].x-lm[mcp].x,lm[tip].y-lm[mcp].y); return d<handSize*0.55&&d>handSize*0.2 }
  const isCup = pb(8,5)&&pb(12,9)&&pb(16,13)&&pb(20,17)

  if (!index && !middle && !ring && !pinky && !thumbSplay) return "fist"
  if (index && middle && ring && pinky && thumbSplay) return "open"
  if (index && middle && ring && pinky && !thumbSplay) return "flat"
  if (index && !middle && !ring && !pinky && !thumbSplay) return "index"
  if (index && middle && !ring && !pinky) return "two"
  if (index && middle && ring && !pinky) return "three"
  if (index && !middle && !ring && pinky) return "horns"
  if (!index && !middle && !ring && !pinky && thumbSplay) return "thumb"
  if (pinching && middle && ring && pinky) return "ok"
  if (pinching && !middle && !ring && !pinky) return "pinch"
  if (isCup) return "cup"
  return "flat"
}

export function detectMovement(hist: Array<{x:number;y:number;t:number}>): Movement {
  const r = hist.slice(-20)
  if (r.length < 8) return "still"
  const xs = r.map(p=>p.x), ys = r.map(p=>p.y)
  const xR = Math.max(...xs)-Math.min(...xs), yR = Math.max(...ys)-Math.min(...ys)
  if (xR < 0.04 && yR < 0.04) return "still"
  let xF = 0, yF = 0
  for (let i=2;i<r.length;i++) {
    if ((r[i-1].x-r[i-2].x)*(r[i].x-r[i-1].x) < -0.0001) xF++
    if ((r[i-1].y-r[i-2].y)*(r[i].y-r[i-1].y) < -0.0001) yF++
  }
  if (xF>=2&&yF>=2) return "circular"
  if (yF>=2) return "up-down"
  if (xF>=2) return "left-right"
  if (yR > xR) return (ys[ys.length-1]-ys[0]) < -0.04 ? "rise" : "down"
  return "left-right"
}

export function matchSigns(shape: HandShape|null, movement: Movement): Array<{sign:Sign;score:number}> {
  if (!shape) return []
  return LSP_DICTIONARY
    .map(sign => {
      let score = 0
      if (sign.dominant === shape) score += 65
      else if (sign.nonDominant === shape) score += 25
      if (sign.movement === movement) score += 35
      else if (movement === "still" && sign.movement === "tap") score += 12
      return { sign, score }
    })
    .filter(r => r.score >= 55)
    .sort((a,b) => b.score - a.score)
    .slice(0, 3)
}
