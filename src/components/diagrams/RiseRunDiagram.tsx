import CoordGrid from './CoordGrid'
import { toSvg, clipLine, FONT } from './coordBase'

interface Props {
  rise: number
  run: number
}

export default function RiseRunDiagram({ rise, run }: Props) {
  const k = run !== 0 ? rise / run : 0

  // Draw the full line y = kx + 0 through origin
  const [[mx1, my1], [mx2, my2]] = clipLine(k, 0)
  const [sx1, sy1] = toSvg(mx1, my1)
  const [sx2, sy2] = toSvg(mx2, my2)

  // Rise-run triangle annotation — anchor at a nice starting point
  const annotX = -run / 2
  const annotY = k * annotX
  const [ax, ay] = toSvg(annotX, annotY)
  const [bx, by] = toSvg(annotX + run, annotY)        // end of run (horizontal)
  const [, cy] = toSvg(annotX + run, annotY + rise)   // end of rise (vertical, same x as b)

  // Midpoints for labels
  const runMidX = (ax + bx) / 2
  const runMidY = ay + (rise >= 0 ? 14 : -6)
  const riseMidX = bx + (run >= 0 ? 14 : -14)
  const riseMidY = (by + cy) / 2

  return (
    <CoordGrid>
      {/* Main line */}
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="var(--color-ink)" strokeWidth={2} />

      {/* Run arrow (horizontal, gold) */}
      <line x1={ax} y1={ay} x2={bx} y2={ay} stroke="var(--color-gold)" strokeWidth={2.5} strokeLinecap="round" />
      {/* run arrowhead */}
      <polygon
        points={`${bx - 6},${ay - 4} ${bx},${ay} ${bx - 6},${ay + 4}`}
        fill="var(--color-gold)"
      />
      <text x={runMidX} y={runMidY} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily={FONT} fill="var(--color-gold-d)">
        juoksu {run}
      </text>

      {/* Rise arrow (vertical, coral) */}
      <line x1={bx} y1={ay} x2={bx} y2={cy} stroke="var(--color-coral)" strokeWidth={2.5} strokeLinecap="round" />
      {/* rise arrowhead — direction depends on sign */}
      {rise >= 0 ? (
        <polygon points={`${bx - 4},${cy + 6} ${bx},${cy} ${bx + 4},${cy + 6}`} fill="var(--color-coral)" />
      ) : (
        <polygon points={`${bx - 4},${cy - 6} ${bx},${cy} ${bx + 4},${cy - 6}`} fill="var(--color-coral)" />
      )}
      <text x={riseMidX} y={riseMidY + 4} textAnchor="start" fontSize={11} fontWeight={800} fontFamily={FONT} fill="var(--color-coral-d)">
        nousu {rise}
      </text>
    </CoordGrid>
  )
}
