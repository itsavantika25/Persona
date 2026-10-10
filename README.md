# PERSONA

A personality quiz that scores you on eleven dimensions instead of filing you under a type. It runs entirely in the browser: no accounts, no backend, nothing sent anywhere.

You answer 32 questions in about ten minutes and get an archetype, a radar map, every dimension ranked with a short read, and a couple of extra views of your scores.

## What's in it

- **Landing page** with a hero, how it works, the eleven dimensions, a sample result built by the real scoring code, testimonials, and an FAQ.
- **Assessment** with two question formats, each with its own layout:
  - *Rank*: four options, tapped in order from most to least like you.
  - *Rate*: a statement answered on a five-point scale from Strongly Disagree to Strongly Agree. Keys 1 to 5 work too.
- **Results** with an archetype, a radar chart, all dimensions ranked with expandable detail, an analytical vs creative map, and the two nearest archetypes ("Close calls").
- Progress is saved as you go, so closing the tab mid-quiz is fine. There's a resume prompt when you return.
- Copy, print (or save as PDF) and export your result.
- Privacy policy, terms, cookie banner and footer.
- Responsive from 360px up, keyboard friendly, respects reduced-motion settings.

## Tech

Vite, React, TypeScript and React Router. Plain CSS with a separate stylesheet per page. No UI library and no chart library; the charts are hand-built SVG.

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

These are the standard Vite scripts. If your `package.json` names them differently, use those.

## Project structure

Roughly, based on how the files import each other:

```
src/
  pages/
    LandingPage.tsx / .css
    AssessmentPage.tsx / .css
    ResultsPage.tsx / .css
    (privacy and terms pages)
  components/
    SiteNav, SiteFooter
    RadarChart, BarChart
    ArchetypeCard
    (cookie banner)
  questions.ts     question bank, scoring helpers, trait copy, archetypes
  scoring.ts       turns stored answers into 0 to 100 scores and validity checks
  storage.ts       saves and loads answers, progress and results
  constants.ts     dimension colors, descriptions, score bands
```

## How scoring works

All of it lives in `questions.ts` and `scoring.ts`.

**Rank questions.** The user ranks every option. Each rank gets a multiplier: 1st is 1.0, 2nd is 0.6, 3rd is 0.25 and 4th is 0.05. Each option's weights are multiplied by that and added to the running dimension totals. An option marked `reverseScore` has its rank flipped before the lookup.

**Rate questions.** The 1 to 5 answer maps to -1 to +1, with 3 as zero. It's flipped if the question is reverse-scored, then multiplied by the question's weights.

**Normalising.** Totals are scaled to 0 to 100 against the theoretical maximum for each dimension (`getMaxPossibleScores`).

**Validity.** A few answers are implausibly flattering ("I have never said something hurtful, even by accident"). If two or more are triggered, the results page shows a short note. Scores are still shown.

**Archetypes.** The top two dimensions are checked against a list of hand-written pairs. If there's no match, a name is built from the top three traits. The "Close calls" section shows the two curated archetypes whose pair of dimensions best fits the user's scores.

**Question order.** The 26 rank questions are in a fixed order, with five rate questions interleaved after them, and the validity question last. The order is built in `AssessmentPage.tsx`.

## Changing the questions

Edit `questions.ts`. A few things to know:

- Each option's `weights` map decides which dimensions it moves, and by how much.
- Add `reverseScore` to an option or statement where agreement should lower a score.
- The question total is read from the array, so the counter and progress ticks adjust on their own.
- `curatedPairs` must be exported, because the results page imports it.
- After changing weights, test a few extreme answer sets (everything ranked first, everything ranked last, a random one) and check that scores spread across the bands instead of bunching in the middle. Only one option per question can be ranked first, so reaching the theoretical maximum is practically impossible.

## Design system

The look is bold and colorful: lime, violet, magenta, cobalt, orange and pink on near-black and paper, with hard offset shadows on things you can press.

- Each page scopes its classes and color tokens (`lp-` and `--l-` for landing, `as-` and `--a-` for the assessment, `rs-` and `--r-` for results) so nothing leaks between pages.
- Colored text sits on colored fills only when the contrast works. Lime, orange and pink are fills with dark text.
- The assessment page changes color per question. Rate questions are always cobalt, and rank questions cycle through the other colors.
- The nav and footer use your global styles. The pages read `--bg` from there for the paper color.

## Privacy

Answers, progress and results are stored in the browser's local storage and nowhere else. Clearing browser data, or switching devices, removes them. The privacy policy and terms pages say the same, so update them if you ever add analytics or a backend.

## Before you launch

- Replace the placeholder testimonials in `LandingPage.tsx` with real quotes.
- Fill in the operator name and contact email in the privacy policy and terms.
- Decide whether the quiz is free and whether it has an age limit, then say so in the terms.

## Known limitations

- **Not validated.** The dimensions and weights are hand-assigned, with no clinical norms and no comparison group. The site says so, and the results never show percentiles.
- **No adaptivity.** Everyone gets the same questions in the same order. Making it adaptive properly needs response data to calibrate against.
- **Results live on one device.** There's no way to recover a lost result, which is why copy, print and export exist.

## Ideas for later

- A quick mode that stops early once every dimension has enough evidence.
- A shareable link that encodes scores so two people can overlay their radars.
- Remembering the previous result so a retake can show what changed.
