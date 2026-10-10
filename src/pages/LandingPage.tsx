import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import RadarChart from '../components/RadarChart';
import BarChart from '../components/BarChart';
import ArchetypeCard from '../components/ArchetypeCard';
import { dimensions, questions, getArchetype, getProfileCode } from '../questions';
import type { Dimension } from '../questions';
import { DIM_COLORS, DIM_DESCRIPTIONS } from '../constants';
import './LandingPage.css';

/* ── Sample data ───────────────────────────────────────────────────────────
   Invented scores. The archetype, tagline, description and profile code are
   all produced by the real engine in questions.ts, so the sample can never
   drift from what a real result looks like. */
const SAMPLE_SCORES: Record<Dimension, number> = {
  'Creativity':          78,
  'Curiosity':           85,
  'Discipline':          52,
  'Leadership':          71,
  'Empathy':             66,
  'Adaptability':        80,
  'Confidence':          61,
  'Resilience':          74,
  'Sociability':         47,
  'Analytical Thinking': 69,
  'Emotional Stability': 55,
};

const SAMPLE_ARCHETYPE = getArchetype(SAMPLE_SCORES);
const SAMPLE_CODE = getProfileCode(SAMPLE_SCORES);
const SAMPLE_TOP = (Object.entries(SAMPLE_SCORES) as [Dimension, number][])
  .sort((a, b) => b[1] - a[1])[0][0];

/* ── Copy ──────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'rank',
    n: '1',
    title: 'Rank',
    body: "Most questions are little scenarios with four options. Tap them in the order that sounds like you: 1 for the closest, 4 for the furthest. You can't love them all.",
  },
  {
    id: 'rate',
    n: '2',
    title: 'Rate',
    body: 'The rest are plain statements. Slide from Strongly Disagree to Strongly Agree and be straight with yourself. A few are blunt on purpose.',
  },
  {
    id: 'read',
    n: '3',
    title: 'Read',
    body: 'Each answer nudges several scores at once. You end up with an archetype, a radar map, ranked bars, and a short read on every trait.',
  },
];

type Tone = 'ink' | 'lime' | 'paper' | 'orange' | 'pink';

// PLACEHOLDERS: swap these for real quotes from real people before launch.
const TESTIMONIALS: { quote: string; author: string; tone: Tone }[] = [
{
    quote: "I thought it'd just tell me I'm an introvert or extrovert lol. The breakdown was actually way more interesting than I expected.",
    author: 'Anonymous',
    tone: 'ink',
  },
  {
    quote: "Okay the discipline score was a little too accurate. Made me rethink life choices.",
    author: 'Akshar A.',
    tone: 'lime',
  },
  {
    quote: "I took it twice because I was curious. The results were pretty similar, which was nice to see.",
    author: 'Mohit A.',
    tone: 'paper',
  },
  {
    quote: "Made my friends take it too and we spent way too long comparing results.",
    author: 'Devanshi P.',
    tone: 'orange',
  },
  {
    quote: "Loved that I could just take the quiz without making an account or being asked to pay halfway through.",
    author: 'Avantika A.',
    tone: 'pink',
  },
];

const FAQS = [
  {
    "q": "Do I need to sign up?",
    "a": "No account, no email, no paywall. Open it and start."
  },
  {
    "q": "Where do my answers and results go?",
    "a": "Your answers and results stay in your browser and aren't sent to a server. Your progress is saved locally, so you can resume if you close the tab. Clearing browser data or switching devices may erase or make your results inaccessible, so use Copy Summary or Print on the results page to keep a copy."
  },
  {
    "q": "How long does the test take?",
    "a": "The full assessment takes around 7–10 minutes on average, depending on how long you spend on ranking questions. There's no timer, so take as long as you need."
  },
  {
    "q": "Should I answer as I am or as I'd like to be?",
    "a": "Answer based on how you usually think and behave on an ordinary day, rather than how you'd ideally like to be. Some questions are designed to flag overly flattering response patterns, which may be noted in your results without removing your scores."
  },
  {
    "q": "Why do some questions make me rank things?",
    "a": "Rating everything as 'very me' tells us little. Ranking forces trade-offs between preferences, helping distinguish which tendencies come more naturally to you."
  },
  {
    "q": "How do I read a low score?",
    "a": "A low score isn't a flaw. It simply suggests that a particular tendency may be less characteristic of your usual behaviour. That isn't necessarily a weakness, and it may even reflect a deliberate choice."
  },
  {
    "q": "Is this scientifically validated?",
    "a": "No. This is a self-reflection tool, not a scientifically validated psychological assessment. It has no established clinical norms or representative population data, so it doesn't provide percentiles or comparisons with other people. Treat your results as a starting point for reflection, not a diagnosis."
  },
  {
    "q": "Can I retake the assessment?",
    "a": "Yes. Select Retake on your results page. The new assessment may replace your previous result on this device, so use Copy Summary, Print, or take a screenshot before retaking it if you want to keep the old result."
  }
];

const BARCODE = [62, 40, 78, 30, 55, 88, 46, 70, 34, 60, 50];

/* ── Helpers ───────────────────────────────────────────────────────────── */
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

function scrollToSample() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('sample')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [radarRef, radarWidth] = useElementWidth<HTMLDivElement>();
  const radarSize = Math.max(230, Math.min(380, radarWidth || 320));

  return (
    <div className="landing lp">
      <SiteNav />

      {/* Hero */}
      <section className="lp-hero lp-grain" aria-label="Introduction">
        <div className="lp-wrap lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-pill">32 questions, about ten minutes</p>
            <h1 className="lp-h1">
              <span className="lp-h1-line">
                YOU ARE <mark className="lp-mark">MORE</mark>
              </span>
              <span className="lp-h1-line">
                THAN <span className="lp-strike">FOUR</span>
              </span>
              <span className="lp-h1-line">
                <span className="lp-strike">LETTERS</span>.
              </span>
            </h1>
            <p className="lp-serif lp-hero-sub">
              A personality quiz that gives you a map instead of a label.
            </p>
            <div className="lp-hero-cta">
              <Link to="/assessment" className="lp-btn lp-btn--lime lp-btn--lg" id="hero-begin-btn">
                Begin assessment
              </Link>
              <button type="button" className="lp-textlink" onClick={scrollToSample}>
                See a sample result
              </button>
            </div>
          </div>

          <div className="lp-collage" aria-hidden="true">
            <div className="lp-halftone" />
            <div className="lp-id">
              <p className="lp-id-label">Archetype</p>
              <p className="lp-id-name">Calm<br />Center</p>
              <p className="lp-serif lp-id-tag">The eye of every storm</p>
              <div className="lp-barcode">
                {BARCODE.map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="lp-id-code">EL-208</span>
            </div>
            <div className="lp-coin">
              <strong>{dimensions.length}</strong>
              <span>dimensions</span>
            </div>
            <p className="lp-note">Spoiler: nobody scores 100 on everything.</p>
          </div>
        </div>
      </section>

      {/* How it works: a staircase, because it is a sequence */}
      <section className="lp-how lp-grain" aria-labelledby="how-title">
        <div className="lp-wrap lp-how-grid">
          <header className="lp-how-head">
            <h2 className="lp-h2" id="how-title">Rank. Rate. Read.</h2>
          </header>

          {STEPS.map((s) => (
            <article key={s.id} className={`lp-step lp-step--${s.id}`}>
              <span className="lp-step-num" aria-hidden="true">{s.n}</span>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-body">{s.body}</p>
              <div className="lp-spec" aria-hidden="true">
                {s.id === 'rank' && <RankSpecimen />}
                {s.id === 'rate' && <LikertSpecimen />}
                {s.id === 'read' && <MapSpecimen />}
              </div>
            </article>
          ))}

          <p className="lp-serif lp-how-aside">There's no pass mark.</p>
        </div>
      </section>

      {/* Dimensions */}
      <section className="lp-dims lp-dark" aria-labelledby="dims-title">
        <div className="lp-wrap lp-dims-grid">
          <header className="lp-dims-head">
            <h2 className="lp-h2" id="dims-title">What gets scored</h2>
            <p className="lp-serif lp-dims-note">One answer can move several of these at once.</p>
          </header>
          <ul className="lp-dims-list">
            {dimensions.map((dim) => (
              <li
                key={dim}
                className="lp-dim"
                style={{ '--c': DIM_COLORS[dim] } as CSSProperties}
              >
                <span className="lp-dim-dot" aria-hidden="true" />
                <div className="lp-dim-body">
                  <h3 className="lp-dim-name">{dim}</h3>
                  <p className="lp-dim-desc">{DIM_DESCRIPTIONS[dim]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sample result */}
      <section className="lp-sample lp-dark" id="sample" aria-labelledby="sample-title">
        <div className="lp-wrap">
          <header className="lp-sample-head">
            <h2 className="lp-h2" id="sample-title">Your result, something like this.</h2>
            <p className="lp-serif lp-sample-sub">Invented answers, run through the real scoring code.</p>
          </header>

          <div className="lp-board">
            <span className="lp-stamp" aria-hidden="true">Sample</span>

            <div className="lp-board-card">
              <ArchetypeCard
                name={SAMPLE_ARCHETYPE.name}
                tagline={SAMPLE_ARCHETYPE.tagline}
                description={SAMPLE_ARCHETYPE.description}
                profileCode={SAMPLE_CODE}
                topDimension={SAMPLE_TOP}
                sample
              />
            </div>

            <div className="lp-panel lp-board-radar" ref={radarRef} aria-label="Sample radar chart">
              <RadarChart scores={SAMPLE_SCORES} size={radarSize} />
            </div>

            <div className="lp-panel lp-board-bars" aria-label="Sample ranked scores">
              <BarChart scores={SAMPLE_SCORES} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lp-quotes lp-grain" aria-labelledby="quotes-title">
        <div className="lp-wrap">
          <h2 className="lp-h2 lp-quotes-title" id="quotes-title">After they saw their result</h2>
          <div className="lp-q-grid">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className={`lp-q lp-q--${i + 1} lp-tone-${t.tone}`}>
                {i === 0 && <span className="lp-qmark" aria-hidden="true">“</span>}
                <blockquote className="lp-q-text">{t.quote}</blockquote>
                <figcaption className="lp-q-author">{t.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq" aria-labelledby="faq-title">
        <div className="lp-wrap lp-faq-grid">
          <header className="lp-faq-head">
            <h2 className="lp-h2" id="faq-title">Things people ask</h2>
            <p className="lp-serif lp-faq-quip">Short answers. Nobody's paying us by the word.</p>
          </header>
          <div className="lp-faq-list">
            {FAQS.map((f, i) => (
              <details key={i} className="lp-faq-item">
                <summary>
                  <span>{f.q}</span>
                  <span className="lp-faq-plus" aria-hidden="true">+</span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-cta lp-dark" aria-label="Start the assessment">
        <span className="lp-cta-num" aria-hidden="true">{dimensions.length}</span>
        <div className="lp-wrap lp-cta-grid">
          <h2 className="lp-cta-h">
            GO ON,<br />
            <mark className="lp-mark">RANK</mark><br />
            YOURSELF.
          </h2>
          <Link to="/assessment" className="lp-btn lp-btn--lime lp-btn--lg" id="cta-begin-btn">
            Begin assessment
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ── Step specimens: tiny, true-to-life previews of each question format ── */
const RANK_DEMO = [
  { t: 'Trust your gut', r: 2 },
  { t: 'Map it out first', r: 1 },
  { t: 'Ask the room', r: 4 },
  { t: 'Ten wild ideas', r: 3 },
];

function RankSpecimen() {
  return (
    <ul className="lp-rk">
      {RANK_DEMO.map((o) => (
        <li key={o.t}>
          <span className="lp-rk-badge" data-first={o.r === 1}>{o.r}</span>
          <span>{o.t}</span>
        </li>
      ))}
    </ul>
  );
}

const LIKERT_SIZES = [38, 28, 22, 28, 38];

function LikertSpecimen() {
  return (
    <div className="lp-lk">
      <p className="lp-serif lp-lk-text">I bounce back faster than most people.</p>
      <div className="lp-lk-row">
        {LIKERT_SIZES.map((s, i) => (
          <span key={i} className="lp-lk-dot" data-on={i === 3} style={{ width: s, height: s }} />
        ))}
      </div>
      <div className="lp-lk-labels">
        <span>Disagree</span>
        <span>Agree</span>
      </div>
    </div>
  );
}

function MapSpecimen() {
  const top = (Object.entries(SAMPLE_SCORES) as [Dimension, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  return (
    <ul className="lp-mp">
      {top.map(([dim, v]) => (
        <li key={dim} style={{ '--c': DIM_COLORS[dim], '--w': `${v}%` } as CSSProperties}>
          <span />
        </li>
      ))}
    </ul>
  );
}