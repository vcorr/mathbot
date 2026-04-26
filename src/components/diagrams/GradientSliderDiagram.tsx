import CoordGrid from './CoordGrid'
import { toSvg, clipLine, FONT, MID } from './coordBase'

interface Props {
  value: number
  pivot?: [number, number]
}

export default function GradientSliderDiagram({ value: k, pivot = [0, 0] }: Props) {
  const b = pivot[1] - k * pivot[0]
  const [[mx1, my1], [mx2, my2]] = clipLine(k, b)
  const [sx1, sy1] = toSvg(mx1, my1)
  const [sx2, sy2] = toSvg(mx2, my2)
  const [px, py] = toSvg(pivot[0], pivot[1])

  // k badge — position top-right area
  const badgeX = MID + 60
  const badgeY = 24

  const kStr = k % 1 === 0 ? String(k) : k.toFixed(1)

  return (
    <CoordGrid>
      {/* Rotating line */}
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="var(--color-blue)" strokeWidth={2.5} />

      {/* Pivot point */}
      <circle cx={px} cy={py} r={5} fill="var(--color-blue)" stroke="white" strokeWidth={2} />

      {/* k badge */}
      <rect x={badgeX - 4} y={badgeY - 13} width={56} height={20} rx={8} fill="var(--color-blue)" />
      <text
        x={badgeX + 24}
        y={badgeY + 2}
        textAnchor="middle"
        fontSize={13}
        fontWeight={800}
        fontFamily={FONT}
        fill="white"
      >
        k = {kStr}
      </text>
    </CoordGrid>
  )
}
