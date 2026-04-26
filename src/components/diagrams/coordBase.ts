export const SIZE = 280
export const MID = SIZE / 2 // 140
export const RANGE = 5
export const SCALE = MID / RANGE // 28 px per unit

export const FONT = 'Nunito, system-ui, sans-serif'

export function toSvg(mx: number, my: number): [number, number] {
  return [MID + mx * SCALE, MID - my * SCALE]
}

/** Clip line y = kx + b to the ±RANGE box. Returns [[x1,y1],[x2,y2]] in math coords. */
export function clipLine(k: number, b: number): [[number, number], [number, number]] {
  if (!isFinite(k) || Math.abs(k) > 1000) {
    // Near-vertical — just draw vertical line at x=0 (or wherever b puts it)
    return [[0, -RANGE], [0, RANGE]]
  }

  // Candidate endpoints at x = ±RANGE
  let x1 = -RANGE
  let y1 = k * x1 + b
  let x2 = RANGE
  let y2 = k * x2 + b

  // Clip to y ∈ [-RANGE, RANGE]
  if (k !== 0) {
    if (y1 < -RANGE) { y1 = -RANGE; x1 = (-RANGE - b) / k }
    if (y1 > RANGE)  { y1 =  RANGE; x1 = ( RANGE - b) / k }
    if (y2 < -RANGE) { y2 = -RANGE; x2 = (-RANGE - b) / k }
    if (y2 > RANGE)  { y2 =  RANGE; x2 = ( RANGE - b) / k }
  } else {
    // Horizontal line — clip y
    y1 = Math.max(-RANGE, Math.min(RANGE, b))
    y2 = y1
  }

  return [[x1, y1], [x2, y2]]
}
