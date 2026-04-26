import CoordGrid from './CoordGrid'
import { toSvg, clipLine, FONT } from './coordBase'

interface Props {
  k: number
  value: number // controlled b
}

export default function LinearShiftDiagram({ k, value: b }: Props) {
  const [[mx1, my1], [mx2, my2]] = clipLine(k, b)
  const [sx1, sy1] = toSvg(mx1, my1)
  const [sx2, sy2] = toSvg(mx2, my2)

  // y-intercept marker
  const [yiX, yiY] = toSvg(0, b)
  const bStr = b % 1 === 0 ? String(b) : b.toFixed(1)

  return (
    <CoordGrid>
      {/* The line */}
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="var(--color-violet)" strokeWidth={2.5} />

      {/* y-intercept dot */}
      <circle cx={yiX} cy={yiY} r={6} fill="var(--color-violet)" stroke="white" strokeWidth={2} />

      {/* b badge */}
      <rect x={yiX + 10} y={yiY - 14} width={52} height={20} rx={8} fill="var(--color-violet)" />
      <text
        x={yiX + 36}
        y={yiY + 1}
        textAnchor="middle"
        fontSize={13}
        fontWeight={800}
        fontFamily={FONT}
        fill="white"
      >
        b = {bStr}
      </text>
    </CoordGrid>
  )
}
