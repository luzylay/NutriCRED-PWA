export type HandShape =
  | "open" | "fist" | "index" | "two" | "three"
  | "ok" | "pinch" | "claw" | "horns" | "thumb"
  | "flat" | "cup"

export type Movement =
  | "still" | "up-down" | "left-right" | "circular"
  | "forward" | "toward-chest" | "away-chest"
  | "tap" | "wave" | "rise" | "down" | "spread" | "clap"

export type FaceExpr = "neutral" | "affirm" | "question" | "concern" | "warm"

export interface Sign {
  word: string
  translation: string
  category: string
  dominant: HandShape
  nonDominant: HandShape
  movement: Movement
  location: "chest" | "head" | "chin" | "forehead" | "side" | "center" | "low"
  faceExpr: FaceExpr
  description: string
  twoHands: boolean
}
