import type { StoredAnswer } from './scoring';

const KEY_ANSWERS    = 'persona_answers';
const KEY_RESULTS    = 'persona_results';
const KEY_COOKIES    = 'persona_cookie_choice';
const KEY_PROGRESS   = 'persona_progress_idx';

export function saveAnswers(answers: StoredAnswer[]): void {
  try { localStorage.setItem(KEY_ANSWERS, JSON.stringify(answers)); } catch {}
}

export function loadAnswers(): StoredAnswer[] | null {
  try {
    const raw = localStorage.getItem(KEY_ANSWERS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveProgress(questionIndex: number): void {
  try { localStorage.setItem(KEY_PROGRESS, String(questionIndex)); } catch {}
}

export function loadProgress(): number | null {
  try {
    const raw = localStorage.getItem(KEY_PROGRESS);
    return raw !== null ? parseInt(raw, 10) : null;
  } catch { return null; }
}

export function clearQuizProgress(): void {
  try {
    localStorage.removeItem(KEY_ANSWERS);
    localStorage.removeItem(KEY_PROGRESS);
  } catch {}
}

export function saveResults(results: object): void {
  try { localStorage.setItem(KEY_RESULTS, JSON.stringify(results)); } catch {}
}

export function loadResults(): object | null {
  try {
    const raw = localStorage.getItem(KEY_RESULTS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearResults(): void {
  try { localStorage.removeItem(KEY_RESULTS); } catch {}
}

export function saveCookieChoice(choice: 'accepted' | 'declined'): void {
  try { localStorage.setItem(KEY_COOKIES, choice); } catch {}
}

export function loadCookieChoice(): 'accepted' | 'declined' | null {
  const v = localStorage.getItem(KEY_COOKIES);
  return v === 'accepted' || v === 'declined' ? v : null;
}
