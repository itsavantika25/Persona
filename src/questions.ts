// Revised questions.ts — scoring model is exploratory, not psychometrically validated.

export type Dimension =

  | 'Creativity' | 'Curiosity' | 'Discipline' | 'Leadership' | 'Empathy'

  | 'Adaptability' | 'Confidence' | 'Resilience' | 'Sociability'

  | 'Analytical Thinking' | 'Emotional Stability';



export type Category =

  | 'Decision Making' | 'Social Interaction' | 'Learning Style' | 'Work Habits'

  | 'Communication' | 'Emotional Responses' | 'Leadership' | 'Creativity' | 'Self Perception';



export type QuestionType = 'scenario' | 'statement';



export interface ScenarioOption {

  text: string;

  weights: Partial<Record<Dimension, number>>;

  reverseScore?: true;

  validityFlag?: true;

}

export interface ScenarioQuestion {

  id: string; type: 'scenario'; category: Category; text: string; options: ScenarioOption[];

}

export interface StatementQuestion {

  id: string; type: 'statement'; category: Category; text: string;

  weights: Partial<Record<Dimension, number>>;

  reverseScore?: true; validityFlag?: true;

}

export type Question = ScenarioQuestion | StatementQuestion;



export const dimensions: Dimension[] = [

  'Creativity','Curiosity','Discipline','Leadership','Empathy',

  'Adaptability','Confidence','Resilience','Sociability','Analytical Thinking','Emotional Stability',

];



/**
 * Legacy constant retained for compatibility with any existing UI imports.
 * The revised scoring model does NOT use decaying positive-only points.
 */
export const RANK_DECAY = [1.0, 0.6, 0.25, 0.05] as const;

/**
 * Centered utilities for forced ranking. Rank 1 contributes +1, rank 4 -1.
 * This makes lower-ranked options count against their assigned trait rather
 * than adding positive points regardless of preference.
 */
export const RANK_UTILITY = [1, 1 / 3, -1 / 3, -1] as const;



export const questions: Question[] = [

  { id:'q1',type:'scenario',category:'Decision Making',

    text:'When faced with a complex problem that has no clear right answer, you typically:',

    options:[

      {text:'Break it into smaller logical components and work through each one systematically.',weights:{'Analytical Thinking':3,'Discipline':2}},

      {text:'Trust your gut and move — analysis without momentum is just elegant stalling.',weights:{'Confidence':3,'Adaptability':2}},

      {text:'Brainstorm ten ideas first, including the ones that sound completely impossible.',weights:{'Creativity':4,'Curiosity':1}},

      {text:'Pull in everyone who has a stake and pressure-test the options as a group.',weights:{'Empathy':2,'Sociability':2,'Leadership':2}},

    ]},

  { id:'q9',type:'scenario',category:'Decision Making',

    text:"You're choosing between a safe, high-paying job and a risky startup you're genuinely passionate about. You:",

    options:[

      {text:'Build a detailed model mapping both scenarios out over five years before deciding.',weights:{'Analytical Thinking':4,'Discipline':2}},

      {text:'Leap at the startup. Recovering from failure is something you know how to do.',weights:{'Confidence':3,'Resilience':4}},

      {text:'Find a middle path — negotiate a bridge arrangement and explore both simultaneously.',weights:{'Creativity':3,'Adaptability':3}},

      {text:'Ask the people whose judgment you trust most what they would do in your position.',weights:{'Sociability':2,'Empathy':2}},

    ]},

  { id:'q12',type:'scenario',category:'Decision Making',

    text:"You discover an old building that is closed to visitors, but its history fascinates you. You:",

    options:[

      {text:'Look up its history and see whether there is a public tour or exhibit.',weights:{'Curiosity':4,'Discipline':1}},

      {text:'Imagine in detail the lives that might once have filled it.',weights:{'Empathy':2,'Creativity':4}},

      {text:'Research its architecture, condition, and visitor rules before making plans.',weights:{'Analytical Thinking':4,'Discipline':2}},

      {text:'Ask a friend to join you for an official tour if one is available.',weights:{'Sociability':3,'Emotional Stability':1}},

    ]},

  { id:'q19',type:'scenario',category:'Decision Making',

    text:'You have $10,000 to invest right now. Where does it go?',

    options:[

      {text:'A diversified, low-risk index fund. Methodical, boring, and correct.',weights:{'Analytical Thinking':3,'Discipline':4}},

      {text:'An emerging technology you have been watching closely for months.',weights:{'Curiosity':4,'Confidence':2}},

      {text:'A creative project or business idea you have been sketching in notebooks.',weights:{'Creativity':4,'Leadership':2}},

      {text:'A community project or cause you genuinely believe in.',weights:{'Empathy':4,'Sociability':1}},

    ]},

  { id:'q24',type:'scenario',category:'Decision Making',

    text:'You have to deliver genuinely bad news to a client. Your approach:',

    options:[

      {text:'Direct, factual, and immediate. No softening, no preamble.',weights:{'Confidence':3,'Analytical Thinking':3}},

      {text:'Careful and empathetic — lead with acknowledgment, close with concrete support.',weights:{'Empathy':4,'Sociability':2}},

      {text:'Reframe it as a pivot and show up with three alternative paths already prepared.',weights:{'Creativity':4,'Adaptability':2}},

      {text:'Present a structured timeline showing exactly when and how you will fix it.',weights:{'Discipline':4,'Leadership':2}},

    ]},

  { id:'q2',type:'scenario',category:'Social Interaction',

    text:'You arrive at a packed networking event where you know absolutely nobody. Your move:',

    options:[

      {text:'Walk straight into the largest group and introduce yourself.',weights:{'Sociability':4,'Confidence':3}},

      {text:'Find one person standing alone and have an actual conversation.',weights:{'Empathy':4,'Sociability':1}},

      {text:'Read the room first — find the most interesting cluster, then move in.',weights:{'Analytical Thinking':2,'Curiosity':3}},

      {text:'Drift toward the food and let conversations find you naturally.',weights:{'Adaptability':3,'Emotional Stability':1}},

    ]},

  { id:'q11',type:'scenario',category:'Social Interaction',

    text:"A group discussion is moving toward a decision you're fairly confident is wrong. You:",

    options:[

      {text:'Say so — directly, out loud, in the room.',weights:{'Confidence':4,'Leadership':2}},

      {text:'Ask probing questions that make them reason their way to the flaw themselves.',weights:{'Empathy':3,'Analytical Thinking':3}},

      {text:'Let them try it. Failing is sometimes the only way people actually learn.',weights:{'Adaptability':2,'Resilience':1}},

      {text:'Pitch a completely sideways alternative that reframes the whole premise.',weights:{'Creativity':4,'Curiosity':2}},

    ]},

  { id:'q18',type:'scenario',category:'Social Interaction',

    text:"You're stuck in a broken elevator with a stranger for two hours. You:",

    options:[

      {text:'Get their full life story before the second hour is up.',weights:{'Sociability':4,'Curiosity':2}},

      {text:'Trace the emergency wiring, look for tools, try to solve the problem.',weights:{'Analytical Thinking':3,'Resilience':3}},

      {text:'Sit quietly. This is an unexpected gift of forced stillness.',weights:{'Adaptability':3,'Emotional Stability':3}},

      {text:'If they seem panicked, focus entirely on making them feel safe first.',weights:{'Empathy':4,'Leadership':2}},

    ]},

  { id:'q3',type:'scenario',category:'Learning Style',

    text:'You need to learn a completely new software tool by tomorrow. Where do you start?',

    options:[

      {text:'Read the official documentation cover to cover before touching anything.',weights:{'Discipline':4,'Analytical Thinking':2}},

      {text:'Click every button and learn by breaking things — chaos is a teacher.',weights:{'Curiosity':4,'Adaptability':2}},

      {text:'Find the fastest expert nearby and get them to walk you through it live.',weights:{'Sociability':3,'Empathy':1}},

      {text:'Find workarounds so you only have to learn the critical 20% today.',weights:{'Creativity':3,'Adaptability':2}},

    ]},

  { id:'q17',type:'scenario',category:'Learning Style',

    text:"You're visiting a foreign city for the first time with no obligations. Your itinerary is:",

    options:[

      {text:'Planned down to the hour, with researched backups for every major stop.',weights:{'Discipline':4,'Analytical Thinking':2}},

      {text:'Non-existent. You will wander and see what the day delivers.',weights:{'Adaptability':4,'Curiosity':3}},

      {text:'Focused on meeting locals and understanding how they actually live.',weights:{'Sociability':4,'Empathy':2}},

      {text:'Built around strange art, unusual architecture, and anything nobody else notices.',weights:{'Creativity':4,'Curiosity':2}},

    ]},

  { id:'q26',type:'scenario',category:'Learning Style',

    text:'You finish a book that genuinely blows your mind. Your immediate next step:',

    options:[

      {text:'Buy copies for everyone you know and make them read it.',weights:{'Sociability':4,'Leadership':2}},

      {text:'Start writing your own response — thoughts, pushback, or work inspired by its ideas.',weights:{'Creativity':4,'Discipline':2}},

      {text:'Research the author, the counterarguments, and the historical context.',weights:{'Curiosity':4,'Analytical Thinking':3}},

      {text:'Change a major life habit based on what you read — immediately, not someday.',weights:{'Adaptability':4,'Confidence':3}},

    ]},

  { id:'q4',type:'scenario',category:'Work Habits',

    text:'A senior colleague publicly tears apart your work in front of the team. You:',

    options:[

      {text:'Feel the sting, let it land, then mine it for useful signal.',weights:{'Resilience':3,'Emotional Stability':3}},

      {text:"Calmly state your reasoning. You know the work and you'll defend it.",weights:{'Confidence':4,'Emotional Stability':2}},

      {text:'Let the criticism dominate your thinking for the rest of the day and struggle to refocus.',weights:{'Emotional Stability':3},reverseScore:true},

      {text:'Act unaffected, but replay the criticism internally for hours.',weights:{'Emotional Stability':2},reverseScore:true},

    ]},

  { id:'q10',type:'scenario',category:'Work Habits',

    text:'A major deadline just moved up by a full week without warning. Your first move:',

    options:[

      {text:'Restructure the timeline immediately. Cut non-essentials. Get surgical.',weights:{'Discipline':3,'Analytical Thinking':3}},

      {text:'Shrug it off. You do your clearest work under pressure anyway.',weights:{'Adaptability':4,'Resilience':2,'Emotional Stability':2}},

      {text:'Gather the team, boost morale, and delegate hard.',weights:{'Leadership':4,'Sociability':2}},

      {text:'Find a completely unorthodox shortcut and deliver something impressive early.',weights:{'Creativity':4,'Confidence':1}},

    ]},

  { id:'q16',type:'scenario',category:'Work Habits',

    text:'The standard rules of your workplace or industry feel outdated and inefficient. You:',

    options:[

      {text:"Quietly operate your own way. Rules exist for people who can't think around them.",weights:{'Adaptability':3,'Confidence':3}},

      {text:'Build a fully prepared case and bring it to leadership — campaign to rewrite them.',weights:{'Leadership':4,'Confidence':2}},

      {text:'Find the exploitable loopholes inside the rules and work through them creatively.',weights:{'Creativity':3,'Analytical Thinking':3}},

      {text:'Follow them anyway. Structure exists for a reason and stability matters.',weights:{'Discipline':4,'Resilience':1}},

    ]},

  { id:'q20',type:'scenario',category:'Work Habits',

    text:"A project you've worked on for six months gets cancelled by leadership. Your response:",

    options:[

      {text:'Request a meeting and make a structured, passionate case to revive it.',weights:{'Confidence':4,'Leadership':2}},

      {text:'Archive the files cleanly. The work may be recyclable later.',weights:{'Adaptability':3,'Analytical Thinking':2,'Emotional Stability':2}},

      {text:'Take the team out. Mourning shared work together is important.',weights:{'Sociability':4,'Empathy':3}},

      {text:'Feel crushed for a day, then immediately start looking for the next meaningful thing.',weights:{'Resilience':4,'Emotional Stability':3}},

    ]},

  { id:'q22',type:'scenario',category:'Work Habits',

    text:"It's 3 PM and you hit a hard wall of brain fog mid-task. You:",

    options:[

      {text:'Push through it. The work needs to get done and discomfort is temporary.',weights:{'Discipline':4,'Resilience':3}},

      {text:'Take a walk and let your mind wander until something clicks.',weights:{'Creativity':3,'Curiosity':2,'Adaptability':1}},

      {text:'Switch to easy tasks — clear the inbox, organise files, reset.',weights:{'Analytical Thinking':2,'Adaptability':3}},

      {text:'Go find someone to talk to. Human contact resets your battery.',weights:{'Sociability':4,'Empathy':1}},

    ]},

  { id:'q6',type:'scenario',category:'Emotional Responses',

    text:'You receive harsh, unexpected criticism on a project you poured yourself into. You:',

    options:[

      {text:'Feel the sting, but immediately extract the useful data.',weights:{'Resilience':4,'Analytical Thinking':2,'Emotional Stability':2}},

      {text:'Argue your case. You know the work is good.',weights:{'Confidence':4,'Leadership':1}},

      {text:'Scrap it and start over with a radically different approach.',weights:{'Adaptability':3,'Creativity':2}},

      {text:'Ruminate on the criticism for a long time and struggle to settle before taking a next step.',weights:{'Emotional Stability':3},reverseScore:true},

    ]},

  { id:'q13',type:'scenario',category:'Emotional Responses',

    text:'You fail spectacularly and publicly at something new — surfing, pottery, a language. You:',

    options:[

      {text:'Sign up for a proper class and master the fundamentals from the ground up.',weights:{'Discipline':3,'Resilience':3}},

      {text:'Post the failure video, laugh about it, and move on without overthinking.',weights:{'Confidence':3,'Sociability':2,'Emotional Stability':2}},

      {text:'Obsessively research what went wrong until you fully understand the mechanics.',weights:{'Analytical Thinking':3,'Curiosity':4}},

      {text:"Decide the rules of the discipline don't apply to you and invent your own version.",weights:{'Creativity':4,'Adaptability':2}},

    ]},

  { id:'q15',type:'scenario',category:'Emotional Responses',

    text:"An important relationship has become noticeably cold and distant — and you don't know why. You:",

    options:[

      {text:'Address it directly. Ask them plainly what has changed.',weights:{'Confidence':3,'Emotional Stability':3}},

      {text:'Give it time and space. You trust things will clarify on their own.',weights:{'Adaptability':3,'Emotional Stability':2}},

      {text:'Replay every recent interaction looking for the exact moment it shifted.',weights:{'Analytical Thinking':2,'Emotional Stability':2},reverseScore:true},

      {text:'Assume the worst and find it hard to think about much else until it resolves.',weights:{'Emotional Stability':4},reverseScore:true},

    ]},

  { id:'q25',type:'scenario',category:'Emotional Responses',

    text:"You're watching a deeply tragic film with other people. You:",

    options:[

      {text:"Cry openly. You feel strongly connected to what the characters are experiencing.",weights:{'Empathy':4}},

      {text:'Find yourself analyzing the cinematography and narrative structure.',weights:{'Analytical Thinking':4,'Curiosity':2}},

      {text:"Make a joke to break the tension. You hate sitting in collective discomfort.",weights:{'Sociability':3,'Adaptability':2}},

      {text:'Feel the scene deeply, then regain your emotional balance when it ends.',weights:{'Empathy':2,'Emotional Stability':2}},

    ]},

  { id:'q5',type:'scenario',category:'Communication',

    text:"You've explained something twice and the person still isn't getting it. You:",

    options:[

      {text:'Rebuild the explanation entirely from their perspective — what do they already know?',weights:{'Empathy':4,'Adaptability':2}},

      {text:'Draw it, diagram it, or find a physical metaphor.',weights:{'Creativity':4,'Empathy':1}},

      {text:'Simplify it to the fewest possible words and tell them exactly what to do.',weights:{'Leadership':3,'Confidence':2}},

      {text:'Break it into a numbered, step-by-step logical sequence.',weights:{'Analytical Thinking':4,'Discipline':1}},

    ]},

  { id:'q21',type:'scenario',category:'Communication',

    text:'When you are telling a story to a group of friends, you:',

    options:[

      {text:'Embellish the details dramatically. The story should be better than life.',weights:{'Creativity':4,'Sociability':2}},

      {text:'Stick to the precise facts in logical sequence. Accuracy is a form of respect.',weights:{'Analytical Thinking':4,'Discipline':1}},

      {text:'Focus mostly on how it felt — the emotional texture of the moment.',weights:{'Empathy':4,'Sociability':1}},

      {text:'Stand up, use gestures, and take total command of the room.',weights:{'Confidence':4,'Leadership':2}},

    ]},

  { id:'q7',type:'scenario',category:'Leadership',

    text:"You've been handed a team that is visibly failing. Your first move:",

    options:[

      {text:"Set a bold, clear vision. People fail when they can't see where they're going.",weights:{'Leadership':4,'Confidence':2}},

      {text:'Map every workflow and find the actual bottleneck before touching anything.',weights:{'Analytical Thinking':4,'Discipline':2}},

      {text:"Meet everyone individually first. You can't fix a system without its people.",weights:{'Empathy':4,'Leadership':2}},

      {text:'Blow up the existing structure and experiment with something new.',weights:{'Creativity':3,'Adaptability':3}},

    ]},

  { id:'q14',type:'scenario',category:'Leadership',

    text:"You're planning a trip with friends and nobody can agree on a destination. You:",

    options:[

      {text:'Make a decisive call, book the tickets, and tell them to pack.',weights:{'Leadership':4,'Confidence':3}},

      {text:'Find a compromise destination with something genuinely for everyone.',weights:{'Empathy':4,'Adaptability':2}},

      {text:'Build a weighted scoring matrix for each option and share the results.',weights:{'Analytical Thinking':4,'Discipline':2}},

      {text:'Throw a dart at a map and commit to wherever it lands.',weights:{'Curiosity':3,'Creativity':3}},

    ]},

  { id:'q23',type:'scenario',category:'Leadership',

    text:'A colleague takes credit for your idea in a group meeting. You:',

    options:[

      {text:'Call it out immediately, in front of everyone, publicly.',weights:{'Confidence':4,'Leadership':2}},

      {text:'Wait until afterward and have a direct, private conversation.',weights:{'Discipline':3,'Empathy':2,'Emotional Stability':2}},

      {text:'Let it go and build a system to stop it happening again.',weights:{'Analytical Thinking':4,'Resilience':2}},

      {text:'Build visibly on the idea in the room — prove you understand it far more deeply.',weights:{'Creativity':3,'Adaptability':3}},

    ]},

  { id:'q8',type:'scenario',category:'Creativity',

    text:'You have a completely free weekend with zero obligations. You:',

    options:[

      {text:'Dive into a strange internet rabbit hole. The weirder the topic, the better.',weights:{'Curiosity':4,'Analytical Thinking':1}},

      {text:'Make something — art, code, music, an invention, anything with your hands.',weights:{'Creativity':4,'Discipline':1}},

      {text:'Organise a spontaneous group adventure that nobody planned in advance.',weights:{'Sociability':4,'Leadership':2}},

      {text:'Protect the routine — gym, meal prep, sleep schedule intact.',weights:{'Discipline':4,'Resilience':1}},

    ]},

  { id:'sq1',type:'statement',category:'Self Perception',

    text:'Over the past few months, I have often worried about things that might go wrong even when there was little evidence of a problem.',

    weights:{'Emotional Stability':5},reverseScore:true},

  { id:'sq2',type:'statement',category:'Self Perception',

    text:'Over the past few months, small setbacks have often made it difficult for me to regain my usual perspective.',

    weights:{'Emotional Stability':4},reverseScore:true},

  { id:'sq3',type:'statement',category:'Self Perception',

    text:"Over the past few months, I have often started important tasks and left them unfinished.",

    weights:{'Discipline':5},reverseScore:true},

  { id:'sq4',type:'statement',category:'Self Perception',

    text:'After a significant setback, I can usually return to the task after taking time to process what happened.',

    weights:{'Resilience':4}},

  { id:'sq5',type:'statement',category:'Self Perception',

    text:'I often hold back a view because I worry that other people might disagree.',

    weights:{'Confidence':4},reverseScore:true},


  // Two additional behavior-focused items per dimension improve coverage.
  // These are newly authored items and still require pilot testing.
  { id:'sq7',type:'statement',category:'Self Perception',
    text:'I can usually think of several different approaches to an unfamiliar problem.',
    weights:{'Creativity':4}},
  { id:'sq8',type:'statement',category:'Self Perception',
    text:'When my first approach fails, I struggle to come up with another way forward.',
    weights:{'Creativity':4},reverseScore:true},
  { id:'sq9',type:'statement',category:'Self Perception',
    text:'When something interests me, I look for explanations beyond the first answer I find.',
    weights:{'Curiosity':4}},
  { id:'sq10',type:'statement',category:'Self Perception',
    text:'Once I have enough information to finish a task, I rarely explore the topic further.',
    weights:{'Curiosity':4},reverseScore:true},
  { id:'sq11',type:'statement',category:'Self Perception',
    text:'I usually follow through on tasks even after the initial excitement has faded.',
    weights:{'Discipline':4}},
  { id:'sq12',type:'statement',category:'Self Perception',
    text:'I often postpone important tasks until the time available becomes uncomfortably short.',
    weights:{'Discipline':4},reverseScore:true},
  { id:'sq13',type:'statement',category:'Self Perception',
    text:'When a group is unsure what to do next, I am willing to help it agree on a direction.',
    weights:{'Leadership':4}},
  { id:'sq14',type:'statement',category:'Self Perception',
    text:'When a group lacks direction, I generally wait for someone else to organise the next step.',
    weights:{'Leadership':4},reverseScore:true},
  { id:'sq15',type:'statement',category:'Self Perception',
    text:'Before responding to someone, I try to understand what might be shaping their point of view.',
    weights:{'Empathy':4}},
  { id:'sq16',type:'statement',category:'Self Perception',
    text:'I rarely make an effort to understand why someone feels differently from me.',
    weights:{'Empathy':4},reverseScore:true},
  { id:'sq17',type:'statement',category:'Self Perception',
    text:'When plans change unexpectedly, I can usually adjust my approach and keep going.',
    weights:{'Adaptability':4}},
  { id:'sq18',type:'statement',category:'Self Perception',
    text:'Unexpected changes usually make it difficult for me to switch to a new plan.',
    weights:{'Adaptability':4},reverseScore:true},
  { id:'sq19',type:'statement',category:'Self Perception',
    text:'I can share my view even when I am unsure whether other people will agree.',
    weights:{'Confidence':4}},
  { id:'sq20',type:'statement',category:'Self Perception',
    text:'I often avoid expressing an opinion because I worry that others may disagree.',
    weights:{'Confidence':4},reverseScore:true},
  { id:'sq21',type:'statement',category:'Self Perception',
    text:'After a setback, I can usually find a way to re-engage with what matters to me.',
    weights:{'Resilience':4}},
  { id:'sq22',type:'statement',category:'Self Perception',
    text:'A disappointing result often keeps me from trying again for a long time.',
    weights:{'Resilience':4},reverseScore:true},
  { id:'sq23',type:'statement',category:'Self Perception',
    text:'I usually feel comfortable starting a conversation when I have a reason to connect with someone new.',
    weights:{'Sociability':4}},
  { id:'sq24',type:'statement',category:'Self Perception',
    text:'In unfamiliar social settings, I usually avoid starting conversations even when I would like to connect.',
    weights:{'Sociability':4},reverseScore:true},
  { id:'sq25',type:'statement',category:'Self Perception',
    text:'I tend to break complicated questions into smaller parts before deciding what to do.',
    weights:{'Analytical Thinking':4}},
  { id:'sq26',type:'statement',category:'Self Perception',
    text:'I sometimes settle on my first impression before checking whether the evidence supports it.',
    weights:{'Analytical Thinking':4},reverseScore:true},
  { id:'sq27',type:'statement',category:'Self Perception',
    text:'Under pressure, I can usually manage my immediate reactions well enough to choose how to respond.',
    weights:{'Emotional Stability':4}},
  { id:'sq28',type:'statement',category:'Self Perception',
    text:'Stress often makes it difficult for me to regain perspective after a problem.',
    weights:{'Emotional Stability':4},reverseScore:true},

  { id:'sq6',type:'statement',category:'Self Perception',

    text:'I have never said something hurtful to someone, even completely by accident.',

    weights:{},validityFlag:true},

];



export function scoreScenarioQuestion(options: ScenarioOption[], ranking: number[]): Partial<Record<Dimension,number>> {
  const delta: Partial<Record<Dimension,number>> = {};
  const n = options.length;
  const validRanks = ranking.filter(rank => Number.isInteger(rank) && rank >= 1 && rank <= n);
  // A complete forced ranking must assign each rank exactly once. If invalid,
  // ignore invalid/missing ranks rather than silently inventing a preference.
  const complete = ranking.length === n && validRanks.length === n && new Set(validRanks).size === n;

  options.forEach((opt, i) => {
    const rank = ranking[i];
    if (!complete || !Number.isInteger(rank) || rank < 1 || rank > n) return;
    const utility = RANK_UTILITY[rank - 1] ?? 0;
    const signedUtility = opt.reverseScore ? -utility : utility;
    (Object.entries(opt.weights) as [Dimension,number][]).forEach(([dim,w]) => {
      delta[dim] = (delta[dim] ?? 0) + w * signedUtility;
    });
  });
  return delta;
}

export function scoreStatementQuestion(q: StatementQuestion, likertValue: number): Partial<Record<Dimension,number>> {

  const delta: Partial<Record<Dimension,number>> = {};

  let normalised = (likertValue-3)/2;

  if (q.reverseScore) normalised = -normalised;

  (Object.entries(q.weights) as [Dimension,number][]).forEach(([dim,w]) => {

    delta[dim] = (delta[dim]??0) + w*normalised;

  });

  return delta;

}



export function applyDelta(totals: Record<Dimension,number>, delta: Partial<Record<Dimension,number>>): Record<Dimension,number> {

  const out = {...totals};

  (Object.entries(delta) as [Dimension,number][]).forEach(([dim,v]) => { out[dim] = (out[dim]??0)+v; });

  return out;

}



export interface ScoreBounds {
  min: Record<Dimension,number>;
  max: Record<Dimension,number>;
}

function getPermutations(values: number[]): number[][] {
  if (values.length <= 1) return [values.slice()];
  const out: number[][] = [];
  values.forEach((value, index) => {
    const rest = values.filter((_, i) => i !== index);
    getPermutations(rest).forEach(tail => out.push([value, ...tail]));
  });
  return out;
}

/** Exact mathematical bounds for the current scoring rules and question set.
 * These are attainable score limits, not population norms or evidence of validity.
 */
export function getScoreBounds(questionSet: Question[] = questions): ScoreBounds {
  const min = {} as Record<Dimension,number>;
  const max = {} as Record<Dimension,number>;
  dimensions.forEach(d => { min[d] = 0; max[d] = 0; });

  questionSet.forEach(q => {
    if (q.type === 'scenario') {
      const rankings = getPermutations(q.options.map((_, i) => i + 1));
      dimensions.forEach(dim => {
        const values = rankings.map(ranking => scoreScenarioQuestion(q.options, ranking)[dim] ?? 0);
        min[dim] += Math.min(...values);
        max[dim] += Math.max(...values);
      });
    } else {
      dimensions.forEach(dim => {
        const low = scoreStatementQuestion(q, 1)[dim] ?? 0;
        const high = scoreStatementQuestion(q, 5)[dim] ?? 0;
        min[dim] += Math.min(low, high);
        max[dim] += Math.max(low, high);
      });
    }
  });
  return { min, max };
}

/** Backward-compatible helper. This is a theoretical maximum, not a norm. */
export function getMaxPossibleScores(): Record<Dimension,number> {
  return getScoreBounds().max;
}

export type ValidityAnswer =

  | { questionId: string; type: 'scenario'; selectedOptionIndex: number }

  | { questionId: string; type: 'statement'; likertValue: number };



export function getValidityWarning(answers: ValidityAnswer[]): { flagCount: number; warning: string|null } {

  let flagCount=0;

  answers.forEach(a => {

    const q = questions.find(q => q.id===a.questionId);

    if (!q) return;

    if (a.type==='scenario' && q.type==='scenario') {

      const opt = q.options[a.selectedOptionIndex];

      if (opt?.validityFlag) flagCount++;

    }

    if (a.type==='statement' && q.type==='statement') {

      if (q.validityFlag && a.likertValue>=4) flagCount++;

    }

  });

  if (flagCount>=1) return { flagCount, warning: 'Your response to one strongly worded statement may reflect an idealised self-description. This single item cannot establish dishonesty and is not a validated validity scale; treat it only as a prompt to review your answers.' };

  return { flagCount, warning: null };

}



export function getTraitDescription(dimension: Dimension, score: number): string {

  const band = score>82?0:score>64?1:score>46?2:score>28?3:4;

  const copy: Record<Dimension,[string,string,string,string,string]> = {

    Creativity:["You perceive the world as raw material. Where others see walls, you see canvases — your mind constantly remixes what exists into what hasn't been made yet.",'You generate fresh angles and connect disparate ideas well, pairing that instinct with enough discipline to actually ship what you imagine.','You appreciate innovation and can think outside the box when the situation genuinely calls for it.','You lean on proven methods more than improvisation, and you prefer refining a known approach over betting on an untested one.',"You find real efficiency in established patterns and would rather perfect something known than gamble on something that doesn't have a track record."],

    Curiosity:["You have an almost compulsive hunger for the 'why.' Rabbit holes aren't a distraction — they're where you do your best thinking.",'You actively chase understanding beyond what is required, often researching a topic well past the point anyone asked you to.',"You're inquisitive about things that interest you, but you know when to stop asking questions and start acting on what you already know.","You gather just enough information to move forward. You'd rather test something directly than read another explainer about it.",'You focus on what is strictly necessary for the task at hand. Open-ended exploration rarely feels worth the detour.'],

    Discipline:['Structure is your competitive edge. You engineer systems and habits that grind out consistent progress long after motivation would fade for anyone else.','You hold yourself to real standards and follow through reliably, even if the occasional day slips.','You can buckle down when it matters, but you deliberately protect room for spontaneity rather than living by a rigid schedule.','You work best in bursts tied to energy and inspiration. Rigid schedules tend to feel more draining than helpful.',"You chafe hard under enforced routines. Your best work comes when you're free to follow whatever pull feels strongest in the moment."],

    Leadership:['You naturally gravitate toward the helm. People look to you for direction because you project certainty and a clear path forward, even inside real ambiguity.',"You step up readily when a group needs direction, and others tend to trust your read of a situation quickly.",'You can lead when required but are equally comfortable operating as a strong individual contributor under someone else.',"You'll offer a perspective if asked, but you generally prefer letting someone else own the direction — and the accountability that comes with it.",'You prefer contributing as an independent specialist rather than taking on the weight of directing other people.'],

    Empathy:["You inhabit other people's emotional realities almost automatically. You're an exceptional listener, mediator, and the person people actually want in the room when things get hard.",'You read people well and adjust how you show up based on what they seem to need, without losing your own footing.',"You're considerate and understanding, balancing genuine compassion with keeping your own emotional limits reasonably intact.",'You care about people but tend to process situations through logic first, returning to feelings once the facts are settled.','You approach most situations with significant detachment, prioritising outcomes and efficiency over emotional undercurrents.'],

    Adaptability:['You are psychological water. When environments change or plans collapse, you recalibrate almost instantly and keep moving while others are still processing the disruption.','You adjust to change quickly, usually finding your footing within a conversation rather than needing much runway.',"You handle change reasonably well once you've had a beat to reset your expectations.",'You can adapt, but sudden pivots cost you real friction. You do noticeably better when you see change coming with any lead time.','You thrive in stable, predictable environments. Abrupt shifts are genuinely disruptive to how you work at your best.'],

    Confidence:['You operate from an unshakeable core of self-belief. You back your own judgment and take up space without needing anyone else to greenlight that.','You trust your instincts in most situations and rarely second-guess a decision once you have actually made it.','Your self-assurance is situational — strong in domains you know well, more cautious in genuinely unfamiliar territory.','You often want a second opinion before fully committing, even when your initial instinct was probably right.','You lean strongly toward external validation before putting a claim on the table. Self-doubt is a recurring internal companion.'],

    Resilience:["Setbacks don't derail you — they fuel you. You absorb impact, extract the lesson almost immediately, and keep moving with remarkably little downtime.",'You recover from failure fairly quickly, treating most setbacks as data rather than verdicts on your fundamental ability.','You recover in due time, needing a real moment to process before you are fully operational again.',"Setbacks tend to linger longer than you'd like, and you often build in extra caution afterward to avoid repeating the experience.",'Failures hit you deeply, and you typically take significant precautions upfront to avoid risk or negative outcomes altogether.'],

    Sociability:['You draw genuine energy from the collective. You move through social webs with ease and create connections everywhere you go.','You enjoy being around people and seek it out often, though you are selective about who gets your deeper attention.','You enjoy social interaction but need real periods of solitude afterward to fully recharge.',"You're fairly reserved socially, preferring a small and trusted circle over expanding your network for its own sake.","You're highly selective with your social energy, strongly preferring one deep conversation over any amount of group dynamics."],

    'Analytical Thinking':["Your mind is a precision instrument. You deconstruct complex systems, isolate the variables that actually matter, and synthesise data with cold, structured clarity.",'You default to breaking problems down methodically and are comfortable sitting with data until a pattern genuinely holds up.','You blend logical deduction with intuition, using data to inform decisions rather than letting it dictate them outright.',"You'll run the numbers when asked, but your first move is usually a gut read rather than a formal breakdown.",'You navigate the world primarily through instinct and holistic impressions rather than raw data and structured analysis.'],

    'Emotional Stability':['You maintain composure under conditions that would visibly destabilise most people. Your emotional baseline is calm, consistent, and hard to disrupt.','You manage stress and emotional turbulence well, recovering quickly and rarely letting your internal state bleed into your external behaviour.','You have a reasonable emotional baseline — generally steady, with spikes of reactivity that tend to pass without lasting disruption.','You feel the emotional weight of setbacks and uncertainty more acutely than average, and recovery sometimes takes longer than you would like.',"You experience significant emotional reactivity to stress, setbacks, or ambiguity. This isn't a flaw — it's data, and it's worth paying attention to."],

  };

  return copy[dimension][band];

}



const traitProfile: Record<Dimension,{adjective:string;noun:string;essence:string}> = {

  Creativity:{adjective:'Visionary',noun:'Alchemist',essence:'turning raw imagination into tangible form'},

  Curiosity:{adjective:'Insatiable',noun:'Explorer',essence:"chasing whatever question hasn't been answered yet"},

  Discipline:{adjective:'Relentless',noun:'Architect',essence:'engineering order out of chaos, one system at a time'},

  Leadership:{adjective:'Commanding',noun:'Strategist',essence:'rallying people toward a vision before they can see it themselves'},

  Empathy:{adjective:'Attuned',noun:'Healer',essence:"sensing what other people can't quite say out loud"},

  Adaptability:{adjective:'Fluid',noun:'Shapeshifter',essence:'bending without breaking whenever the ground shifts'},

  Confidence:{adjective:'Unshaken',noun:'Sovereign',essence:"trusting your own read of the room over anyone else's"},

  Resilience:{adjective:'Unbreakable',noun:'Survivor',essence:'turning setbacks into fuel instead of evidence to quit'},

  Sociability:{adjective:'Magnetic',noun:'Connector',essence:"pulling people into orbit around whatever you're building"},

  'Analytical Thinking':{adjective:'Precise',noun:'Analyst',essence:'reducing noise to signal faster than everyone else in the room'},

  'Emotional Stability':{adjective:'Unruffled',noun:'Anchor',essence:'holding your centre when everything around you is shifting'},

};



export const curatedPairs: {pair:[Dimension,Dimension];name:string;tagline:string;description:string}[] = [

  {pair:['Creativity','Analytical Thinking'],name:'Quantum Architect',tagline:'Logic meets radical imagination',description:'You build castles in the sky and then work out the precise mathematics to make them hover. Wild vision backed by structural rigor is a rare combination — and yours.'},

  {pair:['Leadership','Empathy'],name:'Resonant Commander',tagline:'Visionary force with deep humanity',description:"You don't just command a room — you read its frequency. You lead by elevating the people around you, turning individuals into a synchronised force."},

  {pair:['Adaptability','Resilience'],name:'Kinetic Survivor',tagline:'Unbreakable momentum in chaos',description:"You're impossible to pin down and impossible to break. When systems collapse, you're already building the next iteration from the wreckage."},

  {pair:['Curiosity','Discipline'],name:'Obsessive Scholar',tagline:'Relentless pursuit of mastery',description:"Your curiosity isn't casual — it's a weapon. When you find an interest, you deconstruct it with terrifying focus until you reach real mastery."},

  {pair:['Sociability','Confidence'],name:'Social Catalyst',tagline:'The centre of gravity in any room',description:'You operate as the nucleus of any network — the gravity that pulls people together and the spark that converts a group into collective momentum.'},

  {pair:['Analytical Thinking','Discipline'],name:'System Prime',tagline:'Flawless operational precision',description:'You see the world as interconnected mechanisms waiting to be optimised. You bring order to entropy and execute with a consistency most people find unnerving.'},

  {pair:['Creativity','Empathy'],name:'Narrative Architect',tagline:'Making the invisible visible for others',description:"You create things that make people feel seen. Whether it's a design, a story, or a conversation — you translate inner human experience into something tangible."},

  {pair:['Emotional Stability','Leadership'],name:'Calm Center',tagline:'The eye of every storm',description:"When everything escalates, you anchor the room. People instinctively look to you when pressure peaks because you don't perform composure — you actually have it."},

  {pair:['Curiosity','Creativity'],name:'Perpetual Inventor',tagline:'Questions are blueprints',description:"For you, a question is never just a question — it's the start of something new. You follow threads until they become something, and you can't help building along the way."},

  {pair:['Resilience','Confidence'],name:'Undefeated',tagline:'You come back swinging every time',description:'Setbacks genuinely do not stick to you. You have an almost irrational faith in your ability to recover — and the track record to back it up.'},

  {pair:['Empathy','Adaptability'],name:'The Translator',tagline:'Fluent in any room, any register',description:"You read people fast and shift how you show up to meet them exactly where they are. You're not a chameleon — you're a mirror that helps people feel genuinely understood."},

];



function findCuratedPair(top1: Dimension, top2: Dimension) {

  return curatedPairs.find(({pair}) => (pair[0]===top1&&pair[1]===top2)||(pair[0]===top2&&pair[1]===top1));

}



export function getArchetype(scores: Record<Dimension,number>): {name:string;description:string;tagline:string} {

  const sorted = (Object.entries(scores) as [Dimension,number][]).sort((a,b)=>b[1]-a[1]);

  const [top1,top2,top3] = [sorted[0][0],sorted[1][0],sorted[2][0]];

  const curated = findCuratedPair(top1,top2);

  if (curated) return {name:curated.name,tagline:curated.tagline,description:curated.description};

  const p1=traitProfile[top1],p2=traitProfile[top2];

  return {

    name: p1.adjective+' '+p2.noun,

    tagline: 'Where '+top1.toLowerCase()+' meets '+top2.toLowerCase(),

    description: 'You lead with '+top1.toLowerCase()+' — '+p1.essence+' — and back it up with '+top2.toLowerCase()+', '+p2.essence+'. Underneath both, '+top3.toLowerCase()+' keeps showing up, quietly shaping how you actually operate day to day.',

  };

}



export function getProfileCode(scores: Record<Dimension,number>): string {

  const sorted = (Object.entries(scores) as [Dimension,number][]).sort((a,b)=>b[1]-a[1]);

  const initials = sorted.slice(0,2).map(([dim])=>dim.replace(/[^A-Za-z]/g,'')[0]).join('');

  const seed = Math.floor(Math.abs(sorted.reduce((acc,[,score],i)=>acc+score*(i+1),0)))%1000;

  return initials+'-'+seed.toString().padStart(3,'0');

}
