# Revise — GCSE Revision App (v1)

A revision app for Year 11, built to run in Safari on your iPhone as an installed
app icon. Everything — subjects, sessions, quizzes, progress — is stored **only
on your phone** using browser storage. Nothing is uploaded anywhere.

## What's in v1
- Dashboard: streak, today/week totals, average quiz score, topics needing revision, recent sessions
- Subjects: pick from preset GCSE subjects or add your own, edit topics
- Revise: start/pause/finish a timed session, rate confidence after, or log a past session manually
- Quizzes: sample question banks for Maths (Algebra), Biology (Cell structure), Chemistry (Atomic structure), Physics (Energy), English Language (Fiction reading) — mixed multiple-choice, true/false, and short-answer questions, marked instantly with explanations
- Progress: total time, streaks, time per subject, weakest/strongest topics
- Settings: name, theme, goals, export/import your data as a `.json` backup, reset

**Not in v1 yet** (from your original brief — can be added next): the AI tutor
chat, AI-generated quizzes/flashcards, flashcard system, notes section, the
auto-suggested revision planner, spaced-repetition scheduling, and gamification
(XP/achievements). The data structures are already there to build these on top of.

## Getting it onto your iPhone

A phone can't "install" a raw folder of files the way Windows can run a `.exe` —
Safari needs to load the app from a real web address first. Easiest free options:

**Option A — GitHub Pages (free, permanent link)**
1. Create a free GitHub account and a new repository.
2. Upload all the files in this folder (`index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, `icon.png`).
3. In the repo, go to Settings → Pages → set source to the main branch.
4. GitHub gives you a URL like `https://yourname.github.io/revise/`.
5. Open that URL in **Safari on your iPhone**.
6. Tap the Share icon → **Add to Home Screen**.

**Option B — Netlify Drop (free, fastest, no account needed for a quick link)**
1. Go to https://app.netlify.com/drop on a computer.
2. Drag this whole folder onto the page.
3. It gives you a live URL instantly. Open that URL in Safari on your iPhone.
4. Tap the Share icon → **Add to Home Screen**.

Once added to your home screen, it opens full-screen like a normal app and
keeps working without internet (your data stays on your phone either way).

## Backing up your data
Settings → Export data (.json) saves a backup file you can keep safe or move
to another device. Settings → Import data restores from that file.

## Adding more quiz questions
Open `app.js` and find the `QUIZ_BANK` object near the top. Each entry is keyed
`"Subject Name::Topic Name"` — copy the pattern of an existing entry to add more.
