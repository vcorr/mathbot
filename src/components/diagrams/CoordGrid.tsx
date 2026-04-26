import type { ReactNode } from 'react'
import { SIZE, MID, FONT, toSvg } from './coordBase'

interface Props {
  children?: ReactNode
  showLabels?: boolean
}

const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4]

export default function CoordGrid({ children, showLabels = true }: Props) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      overflow="hidden"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      {/* Grid lines */}
      {TICKS.map((t) => {
        const [px] = toSvg(t, 0)
        const [, py] = toSvg(0, t)
        return (
          <g key={t}>
            <line x1={px} y1={0} x2={px} y2={SIZE} stroke="var(--color-line)" strokeWidth={0.5} />
            <line x1={0} y1={py} x2={SIZE} y2={py} stroke="var(--color-line)" strokeWidth={0.5} />
          </g>
        )
      })}

      {/* x-axis */}
      <line x1={0} y1={MID} x2={SIZE - 10} y2={MID} stroke="var(--color-ink)" strokeWidth={1.5} />
      <polygon points={`${SIZE - 10},${MID - 5} ${SIZE},${MID} ${SIZE - 10},${MID + 5}`} fill="var(--color-ink)" />

      {/* y-axis */}
      <line x1={MID} y1={SIZE} x2={MID} y2={10} stroke="var(--color-ink)" strokeWidth={1.5} />
      <polygon points={`${MID - 5},10 ${MID},0 ${MID + 5},10`} fill="var(--color-ink)" />

      {/* Ticks + numbers */}
      {TICKS.map((t) => {
        const [px] = toSvg(t, 0)
        const [, py] = toSvg(0, t)
        return (
          <g key={t}>
            <line x1={px} y1={MID - 4} x2={px} y2={MID + 4} stroke="var(--color-ink)" strokeWidth={1} />
            <line x1={MID - 4} y1={py} x2={MID + 4} y2={py} stroke="var(--color-ink)" strokeWidth={1} />
            {showLabels && (
              <>
                <text x={px} y={MID + 15} textAnchor="middle" fontSize={9} fontFamily={FONT} fill="var(--color-ink-soft)">{t}</text>
                <text x={MID - 7} y={py + 3} textAnchor="end" fontSize={9} fontFamily={FONT} fill="var(--color-ink-soft)">{t}</text>
              </>
            )}
          </g>
        )
      })}

      {/* Axis labels */}
      {showLabels && (
        <>
          <text x={SIZE - 4} y={MID - 10} textAnchor="end" fontSize={12} fontWeight={800} fontFamily={FONT} fill="var(--color-ink)">x</text>
          <text x={MID + 8} y={18} fontSize={12} fontWeight={800} fontFamily={FONT} fill="var(--color-ink)">y</text>
        </>
      )}

      {children}
    </svg>
  )
}
