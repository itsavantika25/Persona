import type { Dimension } from '../questions';
import { DIM_COLORS } from '../constants';
import './ArchetypeCard.css';

interface Props {
  name: string;
  tagline: string;
  description: string;
  profileCode: string;
  topDimension: Dimension;
  rotate?: number;
  sample?: boolean;
}

export default function ArchetypeCard({ name, tagline, description, profileCode, topDimension, rotate = 0, sample }: Props) {
  const color = DIM_COLORS[topDimension];
  const isDark = color !== '#CCFF00';
  const textColor = isDark ? '#fff' : '#1C1A1A';

  return (
    <div
      className="archetype-card"
      style={{
        background: color,
        color: textColor,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {sample && <div className="archetype-sample-badge">Sample</div>}
      <p className="archetype-label">Archetype</p>
      <h2 className="archetype-name">{name}</h2>
      <p className="archetype-tagline serif">{tagline}</p>
      <p className="archetype-desc">{description}</p>
      <div
        className="archetype-code"
        style={{
          background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
          border: isDark ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid rgba(0,0,0,0.25)',
        }}
      >
        {profileCode}
      </div>
    </div>
  );
}
