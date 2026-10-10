import type { Dimension } from './questions';

export const DIM_COLORS: Record<Dimension, string> = {
'Creativity':           '#3B5BFF',
'Curiosity':             '#3B5BFF',
'Discipline':            '#211D2B',
'Leadership':            '#FF4F79',
'Empathy':               '#3B5BFF',
'Adaptability':          '#C6FF00',
'Confidence':            '#FF4F79',
'Resilience':            '#211D2B',
'Sociability':           '#FF4F79',
'Analytical Thinking':   '#211D2B',
'Emotional Stability':   '#7B2FFF',
};

// High-contrast text pairings:
// Lime (#CCFF00) uses dark ink #1C1A1A; all dark tones use white #FAF8F8
export const DIM_TEXT_COLORS: Record<Dimension, string> = {
  'Creativity':          '#FAF8F8',
  'Curiosity':           '#FAF8F8',
  'Discipline':          '#FAF8F8',
  'Leadership':          '#FAF8F8',
  'Empathy':             '#FAF8F8',
  'Adaptability':        '#1C1A1A',
  'Confidence':          '#FAF8F8',
  'Resilience':          '#FAF8F8',
  'Sociability':         '#FAF8F8',
  'Analytical Thinking': '#FAF8F8',
  'Emotional Stability': '#FAF8F8',
};

export const DIM_DESCRIPTIONS: Record<Dimension, string> = {
  'Creativity':          'How you generate and value novel ideas',
  'Curiosity':           'Your hunger for understanding beyond what is needed',
  'Discipline':          'How consistently you follow through on commitments',
  'Leadership':          'Your inclination to direct and take accountability',
  'Empathy':             "How readily you inhabit other people's experience",
  'Adaptability':        'How quickly you recalibrate when plans change',
  'Confidence':          'How much you trust your own judgment without external validation',
  'Resilience':          'How fast you recover and re-engage after setbacks',
  'Sociability':         'How much energy you draw from social interaction',
  'Analytical Thinking': 'Your tendency to decompose problems into structured logic',
  'Emotional Stability': 'How steady your internal state is under pressure',
};

export const SCORE_BANDS = [
  { min: 83, label: 'Exceptional', short: 'EXC' },
  { min: 65, label: 'High',        short: 'HI'  },
  { min: 47, label: 'Moderate',    short: 'MID' },
  { min: 29, label: 'Low',         short: 'LO'  },
  { min: 0,  label: 'Emerging',    short: 'EMG' },
];

export function getBand(score: number) {
  return SCORE_BANDS.find(b => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}
