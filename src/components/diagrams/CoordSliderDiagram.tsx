const SIZE = 280;
const MID = SIZE / 2;
const RANGE = 5;
const SCALE = MID / RANGE;

function toSvg(mx: number, my: number): [number, number] {
  return [MID + mx * SCALE, MID - my * SCALE];
}

interface Props {
  value: number;
}

export default function CoordSliderDiagram({ value }: Props) {
  const ticks = [-4, -3, -2, -1, 1, 2, 3, 4];
  const [ptX, ptY] = toSvg(0, value);

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

      {/* Ticks + numbers */}
      {ticks.map((t) => {
        const [px] = toSvg(t, 0);
        const [, py] = toSvg(0, t);
        return (
          <g key={t}>
            <line x1={px} y1={MID - 4} x2={px} y2={MID + 4} stroke="var(--color-ink)" strokeWidth={1} />
            <line x1={MID - 4} y1={py} x2={MID + 4} y2={py} stroke="var(--color-ink)" strokeWidth={1} />
            <text x={px} y={MID + 15} textAnchor="middle" fontSize={9} fontFamily="Nunito, system-ui, sans-serif" fill="var(--color-ink-soft)">
              {t}
            </text>
            <text x={MID - 7} y={py + 3} textAnchor="end" fontSize={9} fontFamily="Nunito, system-ui, sans-serif" fill="var(--color-ink-soft)">
              {t}
            </text>
          </g>
        );
      })}

      {/* Axis labels */}
      <text x={SIZE - 4} y={MID - 10} textAnchor="end" fontSize={12} fontWeight={800} fontFamily="Nunito, system-ui, sans-serif" fill="var(--color-ink)">x</text>
      <text x={MID + 8} y={18} fontSize={12} fontWeight={800} fontFamily="Nunito, system-ui, sans-serif" fill="var(--color-ink)">y</text>

      {/* Vertical guide line on y-axis */}
      <line
        x1={MID}
        y1={ptY}
        x2={MID}
        y2={ptY}
        stroke="var(--color-blue)"
        strokeWidth={2}
        strokeDasharray="4 3"
      />

      {/* Moveable point */}
      <circle
        cx={ptX}
        cy={ptY}
        r={9}
        fill="var(--color-blue)"
        stroke="white"
        strokeWidth={2.5}
      />

      {/* y-value badge */}
      <rect
        x={ptX + 14}
        y={ptY - 14}
        width={44}
        height={22}
        rx={8}
        fill="var(--color-blue)"
      />
      <text
        x={ptX + 36}
        y={ptY + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={800}
        fontFamily="Nunito, system-ui, sans-serif"
        fill="white"
      >
        y = {value}
      </text>
    </svg>
  );
}
