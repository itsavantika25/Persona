import { useEffect, useRef, useState } from 'react';
import { dimensions } from '../questions';
import type { Dimension } from '../questions';
import { DIM_COLORS, getBand } from '../constants';

interface Props {
  scores: Record<Dimension, number>;
}

export default function BarChart({ scores }: Props) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const sorted = [...dimensions].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sorted.map((dim) => {
        const score = Math.round(scores[dim] ?? 0);
        const band = getBand(score);
        const color = DIM_COLORS[dim];
        const w = animated ? score : 0;
        const textColor = color === '#1C1A1A' ? '#FAF8F8' : (color === '#CCFF00' ? '#1C1A1A' : '#fff');
        return (
          <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem',
              letterSpacing: '0.07em', textTransform: 'uppercase',
              width: 145, flexShrink: 0,
            }}>{dim}</span>
            <div style={{
              flex: 1, background: '#E8E6E6', borderRadius: 4, height: 22,
              border: '1.5px solid #1C1A1A', overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                background: color,
                width: `${w}%`,
                borderRadius: 2,
                transition: animated ? 'width 0.9s cubic-bezier(0.16,1,0.3,1)' : 'none',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem',
              width: 30, textAlign: 'right', flexShrink: 0,
            }}>{score}</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.65rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: color, color: textColor,
              border: '1.5px solid #1C1A1A', borderRadius: 4,
              padding: '3px 6px', width: 38, textAlign: 'center', flexShrink: 0,
            }}>{band.short}</span>
          </div>
        );
      })}
    </div>
  );
}
