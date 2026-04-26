import CoordGrid from './CoordGrid'
import { toSvg, clipLine, FONT, RANGE } from './coordBase'

interface Props {
  k: number
  b: number
  targetPoints?: [number, number][]
}

export default function LinearDiagram({ k, b, targetPoints }: Props) {
  const [[mx1, my1], [mx2, my2]] = clipLine(k, b)
  const [sx1, sy1] = toSvg(mx1, my1)
  const [sx2, sy2] = toSvg(mx2, my2)

  // y-intercept: (0, b)
  const bInRange = b >= -RANGE && b <= RANGE
  const [yiX, yiY] = toSvg(0, b)

  // x-intercept: y=0 → x = -b/k
  const xIntercept = k !== 0 ? -b / k : null
  const xInRange = xIntercept !== null && Math.abs(xIntercept) <= RANGE
  const [xiX, xiY] = xInRange && xIntercept !== null ? toSvg(xIntercept, 0) : [0, 0]

  return (
    <CoordGrid>
      {/* The line */}
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="var(--color-ink)" strokeWidth={2.5} />

      {/* y-intercept dot + label */}
      {bInRange && (
        <>
          <circle cx={yiX} cy={yiY} r={5} fill="var(--color-violet)" stroke="white" strokeWidth={2} />
          <text
            x={yiX + 10}
            y={yiY - 6}
            fontSize={10}
            fontWeight={800}
            fontFamily={FONT}
            fill="var(--color-violet-d)"
          >
            (0, {b})
          </text>
        </>
      )}

      {/* x-intercept dot (if within range and different from origin) */}
      {xInRange && xIntercept !== null && Math.abs(xIntercept) > 0.1 && (
        <>
          <circle cx={xiX} cy={xiY} r={4} fill="var(--color-ink-soft)" stroke="white" strokeWidth={1.5} />
        </>
      )}

      {/* Target points (for dual-slider context) */}
      {targetPoints?.map(([px, py], i) => {
        const [spx, spy] = toSvg(px, py)
        return (
          <g key={i}>
            <circle cx={spx} cy={spy} r={6} fill="var(--color-gold)" stroke="white" strokeWidth={2} />
            <text
              x={spx + 10}
              y={spy - 8}
              fontSize={10}
              fontWeight={800}
              fontFamily={FONT}
              fill="var(--color-gold-d)"
            >
              ({px},{py})
            </text>
          </g>
        )
      })}
    </CoordGrid>
  )
}
