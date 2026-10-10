import { dimensions } from '../questions';
import type { Dimension } from '../questions';

interface Props {
  scores: Record<Dimension, number>;
  size?: number;
}

export default function RadarChart({ scores, size = 360 }: Props) {
  const n = dimensions.length;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.31;
  const labelR = size * 0.44;

  function getXY(i: number, dist: number) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  }

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const points = dimensions.map((dim, i) => {
    const v = (scores[dim] ?? 0) / 100;
    return getXY(i, v * r);
  });
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      viewBox={`-40 -25 ${size + 80} ${size + 50}`}
      width="100%"
      height="100%"
      style={{ maxWidth: size + 80, maxHeight: size + 50, overflow: 'visible' }}
      role="img"
      aria-label="Radar chart of all 11 personality dimensions"
    >
      <title>Personality Radar Chart</title>
      {/* Background concentric rings */}
      {rings.map((scale, ri) => {
        const pts = dimensions.map((_, i) => {
          const p = getXY(i, scale * r);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <polygon
            key={ri}
            points={pts}
            fill="none"
            stroke="#1C1A1A"
            strokeWidth="1.2"
            opacity={ri === 4 ? 0.25 : 0.12}
          />
        );
      })}
      {/* Radial grid lines */}
      {dimensions.map((_, i) => {
        const end = getXY(i, r);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#1C1A1A" strokeWidth="1" opacity="0.16" />;
      })}
      {/* Score polygon */}
      <polygon
        points={polyPoints}
        fill="#0057FF"
        fillOpacity="0.2"
        stroke="#0057FF"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Score vertex dots */}
      {dimensions.map((dim, i) => {
        const v = (scores[dim] ?? 0) / 100;
        const pos = getXY(i, v * r);
        return <circle key={dim} cx={pos.x} cy={pos.y} r={4.5} fill="#CCFF00" stroke="#1C1A1A" strokeWidth="2" />;
      })}
      {/* Axis labels with high contrast ink color */}
      {dimensions.map((dim, i) => {
        const pos = getXY(i, labelR);
        const label = dim === 'Analytical Thinking' ? 'Analytical' : dim === 'Emotional Stability' ? 'Emo. Stability' : dim;
        return (
          <text
            key={dim}
            x={pos.x} y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9.5}
            fontWeight="800"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fill="#1C1A1A"
            style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
