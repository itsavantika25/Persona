import {
  dimensions,
  questions,
  scoreScenarioQuestion,
  scoreStatementQuestion,
  getScoreBounds,
  getValidityWarning,
  type Dimension,
  type Question,
  type ScenarioQuestion,
  type StatementQuestion,
  type ValidityAnswer,
} from './questions';

/**
 * Scenario rankings are arrays indexed by option position. Each value is that
 * option's rank: 1 = most like you, 4 = least like you. Every rank must appear
 * exactly once for a scenario to be scored.
 */
export type ScenarioAnswer = {
  questionId: string;
  type: 'scenario';
  ranking?: number[];
  rankings?: number[];
  selectedOptionIndex?: number;
};

/** Likert values use 1 = strongly disagree through 5 = strongly agree. */
export type StatementAnswer = {
  questionId: string;
  type: 'statement';
  likertValue?: number;
  value?: number;
};

export type Answer = ScenarioAnswer | StatementAnswer;
export type AnswersInput = Answer[] | Record<string, number[] | number>;

export interface DimensionBounds {
  min: number;
  max: number;
}

export type ScoreBoundsByDimension = Record<Dimension, DimensionBounds>;

function isCompleteRanking(ranking: unknown, optionCount: number): ranking is number[] {
  if (!Array.isArray(ranking) || ranking.length !== optionCount) return false;
  const values = ranking as unknown[];
  return values.every(value => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= optionCount)
    && new Set(values).size === optionCount;
}

function normalizeAnswers(input: AnswersInput): Answer[] {
  if (Array.isArray(input)) return input;

  const normalized: Answer[] = [];
  Object.entries(input).forEach(([questionId, value]) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    if (question.type === 'scenario' && Array.isArray(value)) {
      normalized.push({ questionId, type: 'scenario', ranking: value });
    } else if (question.type === 'statement' && typeof value === 'number') {
      normalized.push({ questionId, type: 'statement', likertValue: value });
    }
  });
  return normalized;
}

function getScenarioRanking(answer: ScenarioAnswer): number[] | undefined {
  return answer.ranking ?? answer.rankings;
}

function getLikertValue(answer: StatementAnswer): number | undefined {
  return answer.likertValue ?? answer.value;
}

function getScorableEntries(input: AnswersInput): Array<{ answer: Answer; question: Question }> {
  const seen = new Set<string>();
  const entries: Array<{ answer: Answer; question: Question }> = [];

  normalizeAnswers(input).forEach(answer => {
    if (seen.has(answer.questionId)) return;
    const question = questions.find(q => q.id === answer.questionId);
    if (!question || question.type !== answer.type) return;

    if (question.type === 'scenario' && answer.type === 'scenario') {
      const ranking = getScenarioRanking(answer);
      if (!isCompleteRanking(ranking, question.options.length)) return;
    } else if (question.type === 'statement' && answer.type === 'statement') {
      const value = getLikertValue(answer);
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) return;
    }

    seen.add(answer.questionId);
    entries.push({ answer, question });
  });
  return entries;
}

/**
 * Exact theoretical limits for the current set of questions and scoring rules.
 * These are not population norms, percentiles, or a claim of psychological
 * accuracy. The returned object keeps the original per-dimension shape.
 */
export function simulateBounds(questionSet: Question[] = questions): ScoreBoundsByDimension {
  const bounds = getScoreBounds(questionSet);
  const result = {} as ScoreBoundsByDimension;
  dimensions.forEach(dimension => {
    result[dimension] = { min: bounds.min[dimension], max: bounds.max[dimension] };
  });
  return result;
}

/** Convert a raw total to the theoretical attainable 0–100 range. */
export function rescale(dimension: Dimension, raw: number, bounds = simulateBounds()): number {
  const { min, max } = bounds[dimension];
  if (!Number.isFinite(raw) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 50;
  const score = ((raw - min) / (max - min)) * 100;
  return Math.round(Math.max(0, Math.min(100, score)) * 10) / 10;
}

/** Sum raw weighted evidence without normalizing it. Useful for debugging. */
export function computeRawScores(input: AnswersInput): Record<Dimension, number> {
  const totals = {} as Record<Dimension, number>;
  dimensions.forEach(dimension => { totals[dimension] = 0; });

  getScorableEntries(input).forEach(({ answer, question }) => {
    let delta: Partial<Record<Dimension, number>> = {};
    if (question.type === 'scenario' && answer.type === 'scenario') {
      const ranking = getScenarioRanking(answer)!;
      delta = scoreScenarioQuestion((question as ScenarioQuestion).options, ranking);
    } else if (question.type === 'statement' && answer.type === 'statement') {
      delta = scoreStatementQuestion(question as StatementQuestion, getLikertValue(answer)!);
    }
    Object.entries(delta).forEach(([key, value]) => {
      const dimension = key as Dimension;
      totals[dimension] += value ?? 0;
    });
  });

  return totals;
}

/**
 * Return an exploratory 0–100 profile. Bounds are recalculated for the valid
 * answered items, so partial submissions are not automatically penalized for
 * unanswered questions. A dimension with no answered evidence is set to 50
 * and should be treated as unavailable/neutral, not as an observed average.
 */
export function computeScores(input: AnswersInput): Record<Dimension, number> {
  const entries = getScorableEntries(input);
  const questionSet = entries.map(entry => entry.question);
  const rawScores = computeRawScores(entries.map(({ answer }) => answer));
  const bounds = simulateBounds(questionSet);
  const scores = {} as Record<Dimension, number>;

  dimensions.forEach(dimension => {
    const hasEvidence = entries.some(({ question }) => {
      if (question.type === 'scenario') return question.options.some(option => (option.weights[dimension] ?? 0) !== 0);
      return (question.weights[dimension] ?? 0) !== 0;
    });
    scores[dimension] = hasEvidence ? rescale(dimension, rawScores[dimension], bounds) : 50;
  });
  return scores;
}

/** Adapt answers to the validity-warning helper in questions.ts. */
export function buildValidityAnswers(input: AnswersInput): ValidityAnswer[] {
  const output: ValidityAnswer[] = [];
  getScorableEntries(input).forEach(({ answer, question }) => {
    if (question.type === 'scenario' && answer.type === 'scenario') {
      const ranking = getScenarioRanking(answer)!;
      const selectedOptionIndex = ranking.findIndex(rank => rank === 1);
      if (selectedOptionIndex >= 0) {
        output.push({ questionId: answer.questionId, type: 'scenario', selectedOptionIndex });
      }
    } else if (question.type === 'statement' && answer.type === 'statement') {
      output.push({
        questionId: answer.questionId,
        type: 'statement',
        likertValue: getLikertValue(answer)!,
      });
    }
  });
  return output;
}

export { getValidityWarning };
