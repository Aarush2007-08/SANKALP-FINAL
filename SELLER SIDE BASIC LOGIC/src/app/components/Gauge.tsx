interface GaugeProps {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: string;
  max?: string;
}

const TICK_COUNT = 40;
const CX = 100;
const CY = 100;
const R = 80;

export default function Gauge({
  value,
  color = '#ef4d23',
  showLabels = false,
  min = '389K',
  max = '425K',
}: GaugeProps) {
  const activeCount = Math.round((value / 100) * TICK_COUNT);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = Math.PI + (i / (TICK_COUNT - 1)) * Math.PI;
    const x1 = CX + (R - 10) * Math.cos(angle);
    const y1 = CY + (R - 10) * Math.sin(angle);
    const x2 = CX + R * Math.cos(angle);
    const y2 = CY + R * Math.sin(angle);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i < activeCount ? color : '#d4d4d8'}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[260px]" aria-hidden>
        {ticks}
        <text x={CX} y={105} textAnchor="middle" fontSize={22} fontWeight={600} fill="#171717">
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className="flex justify-between w-full max-w-[260px] text-[11px] text-neutral-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
