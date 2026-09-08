# Revise — GCSE Revision App (v1)

A revision app for Year 11, built to run in Safari on your iPhone as an installed
app icon. Everything — subjects, sessions, quizzes, progress — is stored **only
on your phone** using browser storage. Nothing is uploaded anywhere.

## What's in v3
- Everything from v2, plus:
- **AI Tutor** — a real chat with Claude (Haiku 4.5), aware of the subject/topic you're currently on. Quick-action buttons for "Explain this", "Quiz me", "Give me a hint", "Simplify it", "Give me an exam question". Uses the Socratic method when testing you rather than just handing over answers, and says so when it isn't sure a detail matches your exact exam board.

## Setting up the AI Tutor (~5 minutes, free)

**This is the only part of the app that needs a paid API key — everything else works with zero setup.**

### Step 1 — Get an Anthropic API key
1. Go to **console.anthropic.com** and create an account (separate from a claude.ai subscription — this is pay-as-you-go).
2. Add a small amount of credit (a few dollars covers a huge number of tutor conversations — this app uses the cheap Haiku model).
3. Go to **API Keys** and create a new key. Copy it somewhere safe temporarily — you won't be able to see it again.

### Step 2 — Deploy the backend on Cloudflare Workers (this is what keeps your key safe)
1. Go to **dash.cloudflare.com** and create a free account.
2. Go to **Workers & Pages → Create → Create Worker**. Give it any name (e.g. `revise-ai`) and deploy the default template.
3. Click **Edit code**, delete everything in the editor, and paste in the contents of `worker.js` from this folder. Click **Deploy**.
4. Go to the worker's **Settings → Variables and Secrets → Add**. Name it exactly `ANTHROPIC_API_KEY`, paste in your key from Step 1, mark it as **Secret**, and save.
5. Your worker now has a public URL like `https://revise-ai.yourname.workers.dev` — copy it.

### Step 3 — Connect the app
1. Open the app → Settings (gear icon) → **AI Assistant** → paste the worker URL from Step 2 → **Save changes**.
2. Go to the **Tutor** tab and try it.

### Important — keep `worker.js` out of your GitHub repo, or upload it without the key
`worker.js` itself contains no secret (the key lives only in Cloudflare's secret storage, added via
the dashboard in Step 2.4), so it's safe to include in your repo for reference if you want. **Never**
paste your actual API key into any file you upload to GitHub, GitHub Pages, or anywhere public —
only into the Cloudflare Secrets field.

If the Tutor tab shows "Not connected yet," it just means Step 3 hasn't been done yet — everything
else in the app (revision timer, quizzes, flashcards, progress) works fully offline without this.


- Dashboard: streak, today/week totals, average quiz score, topics needing revision, recent sessions
- Subjects: pick from preset GCSE subjects or add your own, edit topics, set an **exam board per subject** (or leave as "Not sure yet" and set it whenever you find out — editable any time from the Subjects tab)
- Revise: start/pause/finish a timed session, rate confidence after, or log a past session manually
- Quizzes: sample question banks for Maths (Algebra), Biology (Cell structure), Chemistry (Atomic structure), Physics (Energy), English Language (Fiction reading) — mixed multiple-choice, true/false, and short-answer questions, marked instantly with explanations
- **Flashcards**: create cards per subject/topic, study them with a simple spaced-repetition schedule (Again/Hard/Good/Easy), cards you get wrong resurface sooner
- Progress: total time, streaks, time per subject, weakest/strongest topics
- Settings: name, **dark/light theme**, goals, export/import your data as a `.json` backup, reset

**Not in v2 yet** (from your original brief — can be added next): the AI tutor
chat, AI-generated quizzes/flashcards, notes section, the auto-suggested
revision planner, and gamification (XP/achievements). The data structures are
already there to build these on top of.

### If you already added v1 to your home screen
Just re-upload these updated files to the same GitHub Pages / Netlify link —
the app will pick up the new version next time you open it (it checks for
updates automatically in the background).

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
