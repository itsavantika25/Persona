import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import RadarChart from '../components/RadarChart';
import { dimensions, getTraitDescription, getArchetype, getProfileCode, curatedPairs } from '../questions';
import type { Dimension } from '../questions';
import { DIM_COLORS, DIM_TEXT_COLORS, DIM_DESCRIPTIONS, getBand } from '../constants';
import { loadResults, clearResults } from '../storage';
import './ResultsPage.css';

interface ResultsData {
  scores: Record<Dimension, number>;
  archetype: {
    name: string;
    description: string;
    tagline: string;
  };
  profileCode: string;
  validityWarning?: string | null;
}

/* Shown only when someone opens /results without having taken the quiz.
   Archetype and code come from the real engine so the sample matches a real result. */
const SAMPLE_SCORES: Record<Dimension, number> = {
  'Creativity': 78,
  'Curiosity': 85,
  'Discipline': 52,
  'Leadership': 71,
  'Empathy': 66,
  'Adaptability': 80,
  'Confidence': 61,
  'Resilience': 74,
  'Sociability': 47,
  'Analytical Thinking': 69,
  'Emotional Stability': 55,
};

const SAMPLE_DATA: ResultsData = {
  scores: SAMPLE_SCORES,
  archetype: getArchetype(SAMPLE_SCORES),
  profileCode: getProfileCode(SAMPLE_SCORES),
  validityWarning: null,
};

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export default function ResultsPage() {
  const navigate = useNavigate();

  const [{ results, isSample }] = useState(() => {
    const stored = loadResults() as ResultsData | null;
    return stored && stored.scores && stored.archetype
      ? { results: stored, isSample: false }
      : { results: SAMPLE_DATA, isSample: true };
  });

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const listRef = useRef<HTMLDivElement>(null);
  const [chartRef, chartWidth] = useElementWidth<HTMLDivElement>();
  const radarSize = Math.max(240, Math.min(400, chartWidth - 8 || 320));

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  // Open every row while printing, then put them back
  useEffect(() => {
    const closed: HTMLDetailsElement[] = [];
    const before = () => {
      listRef.current?.querySelectorAll('details').forEach((d) => {
        if (!d.open) { closed.push(d); d.open = true; }
      });
    };
    const after = () => {
      closed.splice(0).forEach((d) => { d.open = false; });
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }

  function handleRetake() {
    clearResults();
    navigate('/assessment');
  }

  function handleShare() {
    const text = `I got "${results.archetype.name}" (${results.profileCode}) on PERSONA. ${results.archetype.tagline}. ${window.location.origin}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Copied. Paste it anywhere.'))
        .catch(() => showToast("Couldn't copy. Your browser blocked it."));
    } else {
      showToast("Couldn't copy. Your browser blocked it.");
    }
  }

  function handleDownloadJSON() {
    const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', `persona-profile-${results.profileCode}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Saved as JSON');
  }

  const scores = results.scores;
  const sorted = [...dimensions].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const top = sorted[0];
  const heroBg = DIM_COLORS[top];
  const heroFg = DIM_TEXT_COLORS[top];

  const groups = [
    { title: 'Leading with', items: sorted.slice(0, 3), open: true },
    { title: 'In the middle', items: sorted.slice(3, sorted.length - 3), open: false },
    { title: 'Turned down', items: sorted.slice(-3), open: false },
  ];

  // Curated archetypes the scores nearly landed on: best average across each pair's two dimensions
  const nearMisses = curatedPairs
    .filter((p) => p.name !== results.archetype.name)
    .map((p) => ({
      ...p,
      a: Math.round(scores[p.pair[0]] ?? 0),
      b: Math.round(scores[p.pair[1]] ?? 0),
    }))
    .sort((x, y) => y.a + y.b - (x.a + x.b))
    .slice(0, 2);

  const analytical = Math.round(scores['Analytical Thinking'] ?? 0);
  const creative = Math.round(scores['Creativity'] ?? 0);

  return (
    <div className="rs">
      <SiteNav startHref="/assessment" />

      {isSample && (
        <div className="rs-strip">
          <div className="rs-wrap rs-strip-in">
            <p>This is a sample result.</p>
            <Link to="/assessment" className="rs-textlink">Take the quiz to get yours</Link>
          </div>
        </div>
      )}

      {/* Archetype + radar */}
      <section
        className="rs-hero"
        style={{ '--hero-bg': heroBg, '--hero-fg': heroFg } as CSSProperties}
        aria-labelledby="archetype-name"
      >
        <div className="rs-wrap rs-hero-grid">
          <div className="rs-hero-copy">
            <p className="rs-serif rs-kicker">You came out as</p>
            <h1 className="rs-name" id="archetype-name">{results.archetype.name}</h1>
            <p className="rs-serif rs-tagline">{results.archetype.tagline}</p>
            <p className="rs-desc">{results.archetype.description}</p>
            <p className="rs-code">
              <span>Your code</span>
              <strong>{results.profileCode}</strong>
            </p>
          </div>

          <div className="rs-panel rs-hero-chart" ref={chartRef}>
            <RadarChart scores={scores} size={radarSize} />
          </div>
        </div>
      </section>

      {results.validityWarning && (
        <div className="rs-wrap">
          <div className="rs-note" role="note">
            <strong>A note on your answers</strong>
            <p>{results.validityWarning}</p>
          </div>
        </div>
      )}

      {/* Ranked dimensions: the only place trait descriptions appear */}
      <section className="rs-rank" aria-labelledby="rank-title">
        <div className="rs-wrap">
          <header className="rs-rank-head">
            <h2 className="rs-h2" id="rank-title">All {dimensions.length}, ranked</h2>
            <p className="rs-serif rs-rank-sub">Tap a row for the detail.</p>
          </header>

          <div ref={listRef}>
            {groups.map((g) => (
              <div key={g.title} className="rs-group">
                <h3 className="rs-group-title rs-serif">{g.title}</h3>
                {g.items.map((dim, i) => {
                  const score = Math.round(scores[dim] ?? 0);
                  const band = getBand(score);
                  return (
                    <details
                      key={dim}
                      className="rs-row"
                      open={g.open && i === 0}
                      style={{ '--c': DIM_COLORS[dim] } as CSSProperties}
                    >
                      <summary>
                        <span className="rs-row-name">
                          {dim}
                          <small>{band.label}</small>
                        </span>
                        <span className="rs-bar" aria-hidden="true">
                          <span style={{ width: `${score}%` }} />
                        </span>
                        <span className="rs-row-score">{score}</span>
                        <span className="rs-plus" aria-hidden="true">+</span>
                      </summary>
                      <div className="rs-row-body">
                        <p className="rs-what rs-serif">{DIM_DESCRIPTIONS[dim]}</p>
                        <p>{getTraitDescription(dim, score)}</p>
                      </div>
                    </details>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One derived picture: analytical vs creative */}
      <section className="rs-think" aria-labelledby="think-title">
        <div className="rs-wrap rs-think-grid">
          <div className="rs-think-copy">
            <h2 className="rs-h2" id="think-title">How you think</h2>
            <p className="rs-serif rs-think-line">{thinkingLine(analytical, creative)}</p>
            <p className="rs-think-nums">
              Analytical thinking {analytical}. Creativity {creative}.
            </p>
          </div>
          <div className="rs-panel rs-think-map">
            <ThinkingMap analytical={analytical} creative={creative} />
          </div>
        </div>
      </section>

      {/* Near misses */}
      <section className="rs-near" aria-labelledby="near-title">
        <div className="rs-wrap">
          <header className="rs-near-head">
            <h2 className="rs-h2" id="near-title">Close calls</h2>
            <p className="rs-serif rs-near-sub">Archetypes your scores nearly landed on.</p>
          </header>
          <div className="rs-near-grid">
            {nearMisses.map((n) => (
              <article key={n.name} className="rs-near-card">
                <h3 className="rs-near-name">{n.name}</h3>
                <p className="rs-serif rs-near-tag">{n.tagline}</p>
                <p className="rs-near-pair">
                  <span style={{ '--c': DIM_COLORS[n.pair[0]] } as CSSProperties}>
                    {n.pair[0]} <b>{n.a}</b>
                  </span>
                  <span style={{ '--c': DIM_COLORS[n.pair[1]] } as CSSProperties}>
                    {n.pair[1]} <b>{n.b}</b>
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Keep / retake */}
      <section className="rs-keep" aria-labelledby="keep-title">
        <div className="rs-wrap rs-keep-grid">
          <div className="rs-keep-copy">
            <h2 className="rs-h2" id="keep-title">Keep it.</h2>
            <p>
              Your result lives in this browser only. Copy it, print it, or save it as a PDF.
            </p>
          </div>
          <div className="rs-keep-actions">
            <button type="button" className="rs-btn rs-btn--lime" onClick={handleShare} id="share-summary-btn">
              Copy summary
            </button>
            <button type="button" className="rs-btn rs-btn--white" onClick={() => window.print()} id="print-results-btn">
              Print or save PDF
            </button>
            <button type="button" className="rs-btn rs-btn--ghost" onClick={handleRetake} id="retake-quiz-btn">
              Retake
            </button>
          </div>
          <p className="rs-fine">
            A self-reflection tool, not a clinical assessment. These scores come from one sitting and your own answers.
          </p>
        </div>
      </section>

      {toast && (
        <div className="rs-toast" role="status">{toast}</div>
      )}

      <SiteFooter />
    </div>
  );
}

function thinkingLine(a: number, c: number) {
  if (a >= 50 && c >= 50) return 'Both turned up. You imagine it, then check it.';
  if (c >= 50) return 'Leaning creative. Ideas first, structure second.';
  if (a >= 50) return 'Leaning analytical. Structure first, then the leap.';
  return "Neither is your default mode, which isn't the same as lacking them.";
}

/* Plot: x = Analytical Thinking, y = Creativity, both 0 to 100 */
function ThinkingMap({ analytical, creative }: { analytical: number; creative: number }) {
  const L = 52, T = 16, W = 332, H = 332;
  const x = L + (analytical / 100) * W;
  const y = T + H - (creative / 100) * H;
  const labelRight = x < L + W * 0.7;

  return (
    <svg
      className="rs-map"
      viewBox="0 0 400 400"
      role="img"
      aria-label={`Map of analytical thinking (${analytical}) against creativity (${creative})`}
    >
      <rect className="rs-map-box" x={L} y={T} width={W} height={H} rx="10" />
      <line className="rs-map-mid" x1={L + W / 2} y1={T} x2={L + W / 2} y2={T + H} />
      <line className="rs-map-mid" x1={L} y1={T + H / 2} x2={L + W} y2={T + H / 2} />
      <circle className="rs-map-dot" cx={x} cy={y} r="15" />
      <text
        className="rs-map-you"
        x={labelRight ? x + 24 : x - 24}
        y={y + 5}
        textAnchor={labelRight ? 'start' : 'end'}
      >
        You
      </text>
      <text className="rs-map-axis" x={L + W / 2} y="388" textAnchor="middle">Analytical thinking</text>
      <text className="rs-map-axis" transform={`translate(18 ${T + H / 2}) rotate(-90)`} textAnchor="middle">Creativity</text>
    </svg>
  );
}