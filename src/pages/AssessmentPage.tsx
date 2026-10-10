import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, getArchetype, getProfileCode } from '../questions';
import type { Question, ScenarioQuestion, StatementQuestion } from '../questions';
import { computeScores, buildValidityAnswers, getValidityWarning } from '../scoring';
import type { StoredAnswer } from '../scoring';
import { saveAnswers, loadAnswers, saveProgress, loadProgress, clearQuizProgress, saveResults } from '../storage';
import './AssessmentPage.css';

// Question ordering: 26 scenarios interleaved with 6 statements at positions 4, 9, 14, 19, 24, and sq6 at the end.
function buildQuestionOrder(): Question[] {
  const scenarios = questions.filter(q => q.type === 'scenario');
  const statements = questions.filter(q => q.type === 'statement');
  const sq6 = statements.find(q => q.id === 'sq6')!;
  const otherStatements = statements.filter(q => q.id !== 'sq6');

  const result: Question[] = [];
  let sIdx = 0;
  const insertPositions = [4, 9, 14, 19, 24];

  scenarios.forEach((q, i) => {
    result.push(q);
    if (insertPositions.includes(i) && sIdx < otherStatements.length) {
      result.push(otherStatements[sIdx++]);
    }
  });
  result.push(sq6);
  return result;
}

const ORDERED_QUESTIONS = buildQuestionOrder();
const TOTAL = ORDERED_QUESTIONS.length;

// Page colour. Rate questions are always cobalt; rank questions cycle through the rest.
const SCENARIO_THEMES = ['violet', 'orange', 'lime', 'magenta'] as const;
const THEMES: string[] = (() => {
  let s = 0;
  return ORDERED_QUESTIONS.map(q => (q.type === 'statement' ? 'cobalt' : SCENARIO_THEMES[s++ % SCENARIO_THEMES.length]));
})();

type AnswerMap = Record<string, StoredAnswer>;

function scrollToTop() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Look for saved progress once, on mount
  useEffect(() => {
    const savedAnswers = loadAnswers();
    const savedProgress = loadProgress();
    if (savedAnswers && savedAnswers.length > 0 && savedProgress !== null && savedProgress > 0) {
      setResumeAt(savedProgress);
    }
  }, []);

  // Move focus to the question whenever it changes, so screen readers announce it
  useEffect(() => {
    if (resumeAt === null) headingRef.current?.focus({ preventScroll: true });
  }, [currentIdx, resumeAt]);

  // Keys 1 to 5 answer statement questions. Escape closes the exit dialog.
  useEffect(() => {
    if (resumeAt !== null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showExitModal) {
        setShowExitModal(false);
        return;
      }
      if (showExitModal || e.metaKey || e.ctrlKey || e.altKey) return;
      const q = ORDERED_QUESTIONS[currentIdx];
      if (q?.type === 'statement') {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 5) handleStatementAnswer(q.id, n);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIdx, answers, showExitModal, resumeAt]);

  function resume() {
    const savedAnswers = loadAnswers();
    const savedProgress = loadProgress();
    if (savedAnswers && savedProgress !== null) {
      const map: AnswerMap = {};
      savedAnswers.forEach(a => { map[a.questionId] = a; });
      setAnswers(map);
      setCurrentIdx(Math.min(savedProgress, TOTAL - 1));
    }
    setResumeAt(null);
  }

  function startOver() {
    clearQuizProgress();
    setAnswers({});
    setCurrentIdx(0);
    setResumeAt(null);
  }

  function persist(newAnswers: AnswerMap, idx: number) {
    saveAnswers(Object.values(newAnswers));
    saveProgress(idx);
  }

  function goNext() {
    const nextIdx = currentIdx + 1;
    if (nextIdx < TOTAL) {
      setCurrentIdx(nextIdx);
      persist(answers, nextIdx);
      scrollToTop();
    } else {
      finish();
    }
  }

  function goBack() {
    if (currentIdx > 0) {
      const prev = currentIdx - 1;
      setCurrentIdx(prev);
      persist(answers, prev);
      scrollToTop();
    }
  }

  function handleScenarioAnswer(questionId: string, ranking: number[]) {
    const newAnswers = { ...answers, [questionId]: { questionId, type: 'scenario' as const, ranking } };
    setAnswers(newAnswers);
    persist(newAnswers, currentIdx);
  }

  function handleStatementAnswer(questionId: string, likertValue: number) {
    const newAnswers = { ...answers, [questionId]: { questionId, type: 'statement' as const, likertValue } };
    setAnswers(newAnswers);
    persist(newAnswers, currentIdx);
  }

  function finish() {
    const arr = Object.values(answers);
    const scores = computeScores(arr);
    const archetype = getArchetype(scores);
    const profileCode = getProfileCode(scores);
    const validityAnswers = buildValidityAnswers(arr);
    const { warning } = getValidityWarning(validityAnswers);
    saveResults({ scores, archetype, profileCode, validityWarning: warning });
    clearQuizProgress();
    navigate('/results');
  }

  /* ── Resume screen ─────────────────────────────────────────────────── */
  if (resumeAt !== null) {
    return (
      <div className="as as-resume" data-theme="violet">
        <div className="as-halftone as-halftone--resume" aria-hidden="true" />
        <div className="as-card as-card--resume" role="dialog" aria-labelledby="resume-title">
          <h1 className="as-card-title" id="resume-title">Pick up where you left off?</h1>
          <p className="as-card-body">
            You're on question {resumeAt + 1} of {TOTAL}. Carry on, or wipe it and begin again.
          </p>
          <div className="as-card-actions">
            <button className="as-btn as-btn--lime" onClick={resume} id="resume-btn" autoFocus>
              Resume at question {resumeAt + 1}
            </button>
            <button className="as-btn as-btn--white" onClick={startOver} id="start-over-btn">
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz ──────────────────────────────────────────────────────────── */
  const q = ORDERED_QUESTIONS[currentIdx];
  const currentAnswer = answers[q.id];
  const ranking = q.type === 'scenario' ? normaliseRanking(currentAnswer?.ranking, (q as ScenarioQuestion).options.length) : [];
  const rankedCount = ranking.filter(r => r > 0).length;

  const canAdvance = Boolean(
    (q.type === 'scenario' && rankedCount === (q as ScenarioQuestion).options.length) ||
    (q.type === 'statement' && currentAnswer?.likertValue !== undefined),
  );

  return (
    <div className="as" data-theme={THEMES[currentIdx]}>
      {/* Top bar */}
      <header className="as-top">
        <div className="as-wrap">
          <div className="as-top-row">
            <button type="button" className="as-exit" onClick={() => setShowExitModal(true)} id="exit-assessment-btn">
              Exit
            </button>
            <span className="as-counter">{currentIdx + 1} / {TOTAL}</span>
          </div>

          {/* One tick per question. Round pink ticks are the rate-a-statement questions. */}
          <div
            className="as-progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL}
            aria-valuenow={currentIdx + 1}
            aria-valuetext={`Question ${currentIdx + 1} of ${TOTAL}`}
          >
            <ol className="as-ticks" aria-hidden="true">
              {ORDERED_QUESTIONS.map((oq, i) => (
                <li
                  key={oq.id}
                  data-type={oq.type}
                  data-state={i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'todo'}
                />
              ))}
            </ol>
          </div>
        </div>
      </header>

      <main className="as-main" data-type={q.type}>
        <div className="as-wrap">
          {q.type === 'scenario' ? (
            <div className="as-split">
              <div className="as-split-q">
                <h1 className="as-q as-q--scenario" ref={headingRef} tabIndex={-1}>{q.text}</h1>
              </div>
              <div className="as-split-a">
                <ScenarioAnswerArea
                  key={q.id}
                  question={q as ScenarioQuestion}
                  ranking={ranking}
                  onChange={(r) => handleScenarioAnswer(q.id, r)}
                />
              </div>
            </div>
          ) : (
            <div className="as-poster">
              <h1 className="as-q as-q--statement" ref={headingRef} tabIndex={-1}>{q.text}</h1>
              <StatementAnswerArea
                key={q.id}
                question={q as StatementQuestion}
                value={currentAnswer?.likertValue}
                onChange={(v) => handleStatementAnswer(q.id, v)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Action dock */}
      <footer className="as-dock">
        <div className="as-wrap as-dock-in">
          {currentIdx > 0 ? (
            <button className="as-btn as-btn--white" onClick={goBack} id="back-btn">Back</button>
          ) : (
            <span className="as-dock-gap" aria-hidden="true" />
          )}

          {/* Screen-reader status only. Sighted users see the ranks on the cards. */}
          <p className="as-dock-hint as-sr" id="dock-hint" aria-live="polite">
            {q.type === 'scenario'
              ? `${rankedCount} of ${(q as ScenarioQuestion).options.length} ranked`
              : currentAnswer?.likertValue !== undefined ? 'Answer selected' : 'Choose an answer'}
          </p>

          <button
            className="as-btn as-btn--lime"
            onClick={goNext}
            disabled={!canAdvance}
            aria-describedby="dock-hint"
            id="next-btn"
          >
            {currentIdx === TOTAL - 1 ? 'See results' : 'Next'}
          </button>
        </div>
      </footer>

      {/* Exit dialog */}
      {showExitModal && (
        <div className="as-modal-bg" role="dialog" aria-modal="true" aria-labelledby="exit-title">
          <div className="as-card as-card--exit">
            <h2 className="as-card-title as-card-title--sm" id="exit-title">Leave the quiz?</h2>
            <p className="as-card-body">
              Your answers are saved on this device. Come back whenever and carry on.
            </p>
            <div className="as-card-actions">
              <button className="as-btn as-btn--lime" onClick={() => setShowExitModal(false)} id="stay-btn" autoFocus>
                Keep going
              </button>
              <button className="as-btn as-btn--white" onClick={() => navigate('/')} id="confirm-exit-btn">
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function normaliseRanking(existing: number[] | undefined, n: number): number[] {
  return existing && existing.length === n ? existing : new Array(n).fill(0);
}

/* ── Scenario: tap to rank ─────────────────────────────────────────────────
   Controlled. The ranking lives in the parent, so there's one source of truth. */
const LETTERS = ['A', 'B', 'C', 'D'];

function ScenarioAnswerArea({
  question,
  ranking,
  onChange,
}: {
  question: ScenarioQuestion;
  ranking: number[];
  onChange: (ranking: number[]) => void;
}) {
  const n = question.options.length;
  const nextRank = ranking.filter(r => r > 0).length + 1;

  function tap(i: number) {
    const current = ranking[i];
    if (current > 0) {
      // Remove this rank and close the gap
      onChange(ranking.map((r, idx) => (idx === i ? 0 : r > current ? r - 1 : r)));
    } else {
      onChange(ranking.map((r, idx) => (idx === i ? nextRank : r)));
    }
  }

  return (
    <div className="as-scenario">
      <p className="as-hint as-serif">
        Tap in order. 1 is most like you.
      </p>

      <ul className="as-opts">
        {question.options.map((opt, i) => {
          const rank = ranking[i];
          const ranked = rank > 0;
          return (
            <li key={i} className="as-opt-li">
              <button
                type="button"
                className="as-opt"
                data-ranked={ranked}
                data-rank={ranked ? rank : undefined}
                aria-pressed={ranked}
                aria-label={`${LETTERS[i]}. ${opt.text}${ranked ? ` Ranked ${rank}.` : ''}`}
                onClick={() => tap(i)}
                id={`option-${i}`}
              >
                <span className="as-badge" aria-hidden="true">{ranked ? rank : LETTERS[i]}</span>
                <span className="as-opt-text">{opt.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="as-reset-row">
        {countRanked(ranking) > 0 && (
          <button
            type="button"
            className="as-reset"
            onClick={() => onChange(new Array(n).fill(0))}
            id="reset-ranking-btn"
          >
            Clear my ranking
          </button>
        )}
      </div>
    </div>
  );
}

function countRanked(ranking: number[]) {
  return ranking.filter(r => r > 0).length;
}

/* ── Statement: five-point scale ───────────────────────────────────────── */
const LIKERT = [
  { value: 1, label: 'Strongly disagree', size: 'lg' },
  { value: 2, label: 'Disagree',          size: 'md' },
  { value: 3, label: 'Neutral',           size: 'sm' },
  { value: 4, label: 'Agree',             size: 'md' },
  { value: 5, label: 'Strongly agree',    size: 'lg' },
];

function StatementAnswerArea({
  question,
  value,
  onChange,
}: {
  question: StatementQuestion;
  value: number | undefined;
  onChange: (val: number) => void;
}) {
  const picked = LIKERT.find(l => l.value === value);

  return (
    <div className="as-statement">
      <div className="as-scale" role="radiogroup" aria-label={question.text}>
        {LIKERT.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={value === item.value}
            className="as-lk"
            data-v={item.value}
            data-size={item.size}
            data-on={value === item.value}
            onClick={() => onChange(item.value)}
            id={`likert-${item.value}`}
          >
            <span className="as-lk-cell">
              <span className="as-lk-dot">{item.value}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="as-lk-ends" aria-hidden="true">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>

      <p className="as-readout as-serif" aria-live="polite">
        {picked ? `You said: ${picked.label.toLowerCase()}.` : 'Pick the one closest to how you really are.'}
      </p>
    </div>
  );
}