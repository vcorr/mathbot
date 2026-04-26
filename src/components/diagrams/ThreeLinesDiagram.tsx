import CoordGrid from './CoordGrid'
import { toSvg, clipLine, FONT } from './coordBase'

interface LineSpec {
  k: number
  b: number
  label: string
  color: string
}

interface Props {
  lines: LineSpec[]
}

export default function ThreeLinesDiagram({ lines }: Props) {
  return (
    <CoordGrid>
      {lines.map(({ k, b, label, color }) => {
        const [[mx1, my1], [mx2, my2]] = clipLine(k, b)
        const [sx1, sy1] = toSvg(mx1, my1)
        const [sx2, sy2] = toSvg(mx2, my2)

        // Place label near the right end (or left for negative k)
        // Pick the end with the larger x value for labeling
        const labelAtRight = mx2 > mx1
        const [lx, ly] = labelAtRight ? [sx2, sy2] : [sx1, sy1]
        const labelOffX = labelAtRight ? 8 : -8
        const labelAnchor = labelAtRight ? 'start' : 'end'

        // Badge background for readability
        const badgeX = lx + labelOffX
        const badgeY = ly - 8

        return (
          <g key={label}>
            <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={2.5} />
            {/* Label badge */}
            <rect
              x={labelAnchor === 'start' ? badgeX - 2 : badgeX - 22}
              y={badgeY - 11}
              width={24}
              height={16}
              rx={5}
              fill={color}
              opacity={0.9}
            />
            <text
              x={badgeX + (labelAnchor === 'start' ? 10 : -12)}
              y={badgeY + 2}
              textAnchor="middle"
              fontSize={12}
              fontWeight={800}
              fontFamily={FONT}
              fill="white"
            >
              {label}
            </text>
          </g>
        )
      })}
    </CoordGrid>
  )
}

