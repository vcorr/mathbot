const SIZE = 280;
const MID = SIZE / 2; // 140
const RANGE = 5;
const SCALE = MID / RANGE; // 28px per unit

function toSvg(mx: number, my: number): [number, number] {
  return [MID + mx * SCALE, MID - my * SCALE];
}

const QUADRANT_PATHS: Record<number, string> = {
  1: `M ${MID} ${MID} H ${SIZE - 10} V 0 H ${MID} Z`,
  2: `M ${MID} ${MID} H 0 V 0 H ${MID} Z`,
  3: `M ${MID} ${MID} H 0 V ${SIZE} H ${MID} Z`,
  4: `M ${MID} ${MID} H ${SIZE - 10} V ${SIZE} H ${MID} Z`,
};

const QUADRANT_LABEL_POS: Record<number, [number, number]> = {
  1: [MID + 34, MID - 34],
  2: [MID - 34, MID - 34],
  3: [MID - 34, MID + 34],
  4: [MID + 34, MID + 34],
};

interface Props {
  point?: [number, number];
  pointLabel?: string;
  highlightQuadrant?: number;
  showQuadrantLabels?: boolean;
  showLabels?: boolean;
}

export default function CoordDiagram({
  point,
  pointLabel,
  highlightQuadrant,
  showQuadrantLabels = false,
  showLabels = true,
}: Props) {
  const ticks = [-4, -3, -2, -1, 1, 2, 3, 4];

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-hidden="true"
    >
      {/* Grid lines */}
      {ticks.map((t) => {
        const [px] = toSvg(t, 0);
        const [, py] = toSvg(0, t);
        return (
          <g key={t}>
            <line x1={px} y1={0} x2={px} y2={SIZE} stroke="var(--color-line)" strokeWidth={0.5} />
            <line x1={0} y1={py} x2={SIZE} y2={py} stroke="var(--color-line)" strokeWidth={0.5} />
          </g>
        );
      })}

      {/* Quadrant highlight */}
      {highlightQuadrant && (
        <path d={QUADRANT_PATHS[highlightQuadrant]} fill="var(--color-mint)" opacity={0.12} />
      )}

      {/* Quadrant labels I–IV */}
      {showQuadrantLabels &&
        ([1, 2, 3, 4] as const).map((q) => (
          <text
            key={q}
            x={QUADRANT_LABEL_POS[q][0]}
            y={QUADRANT_LABEL_POS[q][1]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
            fontWeight={700}
            fontFamily="Nunito, system-ui, sans-serif"
            fill={highlightQuadrant === q ? 'var(--color-mint-deep)' : 'var(--color-ink-soft)'}
          >
            {['I', 'II', 'III', 'IV'][q - 1]}
          </text>
        ))}

      {/* x-axis */}
      <line x1={0} y1={MID} x2={SIZE - 10} y2={MID} stroke="var(--color-ink)" strokeWidth={1.5} />
      <polygon
        points={`${SIZE - 10},${MID - 5} ${SIZE},${MID} ${SIZE - 10},${MID + 5}`}
        fill="var(--color-ink)"
      />

      {/* y-axis */}
      <line x1={MID} y1={SIZE} x2={MID} y2={10} stroke="var(--color-ink)" strokeWidth={1.5} />
      <polygon
        points={`${MID - 5},10 ${MID},0 ${MID + 5},10`}
        fill="var(--color-ink)"
      />

      {/* Tick marks + numbers */}
      {ticks.map((t) => {
        const [px] = toSvg(t, 0);
        const [, py] = toSvg(0, t);
        return (
          <g key={t}>
            <line x1={px} y1={MID - 4} x2={px} y2={MID + 4} stroke="var(--color-ink)" strokeWidth={1} />
            <line x1={MID - 4} y1={py} x2={MID + 4} y2={py} stroke="var(--color-ink)" strokeWidth={1} />
            {showLabels && (
              <>
                <text
                  x={px}
                  y={MID + 15}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="Nunito, system-ui, sans-serif"
                  fill="var(--color-ink-soft)"
                >
                  {t}
                </text>
                <text
                  x={MID - 7}
                  y={py + 3}
                  textAnchor="end"
                  fontSize={9}
                  fontFamily="Nunito, system-ui, sans-serif"
                  fill="var(--color-ink-soft)"
                >
                  {t}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Axis labels */}
      {showLabels && (
        <>
          <text
            x={SIZE - 4}
            y={MID - 10}
            textAnchor="end"
            fontSize={12}
            fontWeight={800}
            fontFamily="Nunito, system-ui, sans-serif"
            fill="var(--color-ink)"
          >
            x
          </text>
          <text
            x={MID + 8}
            y={18}
            fontSize={12}
            fontWeight={800}
            fontFamily="Nunito, system-ui, sans-serif"
            fill="var(--color-ink)"
          >
            y
          </text>
        </>
      )}

      {/* Point */}
      {point && (() => {
        const [svgX, svgY] = toSvg(point[0], point[1]);
        const label =
          pointLabel === undefined
            ? null
            : pointLabel === ''
              ? `(${point[0]}, ${point[1]})`
              : `${pointLabel}(${point[0]}, ${point[1]})`;
        // Position label avoiding edges
        const labelX = svgX > MID ? svgX - 10 : svgX + 10;
        const labelAnchor = svgX > MID ? 'end' : 'start';
        const labelY = svgY > MID ? svgY - 10 : svgY - 10;
        return (
          <g>
            <circle
              cx={svgX}
              cy={svgY}
              r={6}
              fill="var(--color-mint)"
              stroke="white"
              strokeWidth={2}
            />
            {label && (
              <text
                x={labelX}
                y={labelY}
                textAnchor={labelAnchor}
                fontSize={11}
                fontWeight={800}
                fontFamily="Nunito, system-ui, sans-serif"
                fill="var(--color-ink)"
              >
                {label}
              </text>
            )}
          </g>
        );
      })()}
    </svg>
  );
}
