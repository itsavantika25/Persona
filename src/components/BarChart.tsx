import { useEffect, useRef, useState } from 'react';
import { dimensions } from '../questions';
import type { Dimension } from '../questions';
import { DIM_COLORS, getBand } from '../constants';
import './BarChart.css';

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
    <div ref={ref} className="bc-container">
      {sorted.map((dim) => {
        const score = Math.round(scores[dim] ?? 0);
        const band = getBand(score);
        const color = DIM_COLORS[dim];
        const w = animated ? score : 0;
        const textColor = color === '#1C1A1A' ? '#FAF8F8' : (color === '#CCFF00' ? '#1C1A1A' : '#fff');
        return (
          <div key={dim} className="bc-row">
            <span className="bc-label" title={dim}>{dim}</span>
            <div className="bc-bar-track">
              <div
                className="bc-bar-fill"
                style={{
                  background: color,
                  width: `${w}%`,
                  transition: animated ? 'width 0.9s cubic-bezier(0.16,1,0.3,1)' : 'none',
                }}
              />
            </div>
            <span className="bc-score">{score}</span>
            <span
              className="bc-badge"
              style={{ background: color, color: textColor }}
            >
              {band.short}
            </span>
          </div>
        );
      })}
    </div>
  );
}
