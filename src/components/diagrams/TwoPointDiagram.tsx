import CoordGrid from './CoordGrid'
import { toSvg, FONT } from './coordBase'

interface Props {
  A: [number, number]
  B: [number, number]
}

export default function TwoPointDiagram({ A, B }: Props) {
  const [ax, ay] = toSvg(A[0], A[1])
  const [bx, by] = toSvg(B[0], B[1])

  const rise = B[1] - A[1]
  const run = B[0] - A[0]

  // Corner of the right-angle triangle: (B[0], A[1]) in math coords
  const [cx, cy] = toSvg(B[0], A[1])

  const runMidX = (ax + cx) / 2
  const runMidY = cy + 13
  const riseMidX = cx + 14
  const riseMidY = (cy + by) / 2

  return (
    <CoordGrid>
      {/* Connecting line A→B (dashed) */}
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="var(--color-ink)" strokeWidth={2} strokeDasharray="5 3" />

      {/* Run segment (gold) */}
      <line x1={ax} y1={cy} x2={cx} y2={cy} stroke="var(--color-gold)" strokeWidth={2} strokeLinecap="round" />
      <text x={runMidX} y={runMidY} textAnchor="middle" fontSize={10} fontWeight={800} fontFamily={FONT} fill="var(--color-gold-d)">
        {run}
      </text>

      {/* Rise segment (coral) */}
      <line x1={cx} y1={cy} x2={cx} y2={by} stroke="var(--color-coral)" strokeWidth={2} strokeLinecap="round" />
      <text x={riseMidX} y={riseMidY + 4} textAnchor="start" fontSize={10} fontWeight={800} fontFamily={FONT} fill="var(--color-coral-d)">
        {rise}
      </text>

      {/* Point A */}
      <circle cx={ax} cy={ay} r={6} fill="var(--color-mint)" stroke="white" strokeWidth={2} />
      <text
        x={ax - 10}
        y={ay - 10}
        textAnchor="end"
        fontSize={11}
        fontWeight={800}
        fontFamily={FONT}
        fill="var(--color-ink)"
      >
        A({A[0]},{A[1]})
      </text>

      {/* Point B */}
      <circle cx={bx} cy={by} r={6} fill="var(--color-blue)" stroke="white" strokeWidth={2} />
      <text
        x={bx + 10}
        y={by - 10}
        textAnchor="start"
        fontSize={11}
        fontWeight={800}
        fontFamily={FONT}
        fill="var(--color-ink)"
      >
        B({B[0]},{B[1]})
      </text>
    </CoordGrid>
  )
}
