# Placement Practice Hub
Static site (no build step). Sections: Reasoning, Quant, Verbal, CS Fundamentals, Technical MCQ.

## Deploy
1. `git init && git add . && git commit -m "Practice hub"`
2. Create an empty GitHub repo, then `git remote add origin <url> && git branch -M main && git push -u origin main`
3. vercel.com > Add New > Project > import the repo > Framework Preset: **Other** > Deploy.

## Add or edit questions
Open a file in `data/` and add an item: `[question, [options], correctIndex, explanation]`.
The question counts on the home page update automatically.

## New features
- **Name**: asked on first visit (saved in the browser, changeable from the header).
- **Timers**: per-question timer on every test; the mock test also has an optional total-exam timer.
- **Report card**: one-page analytics report (name, start/finish time, time taken, marks, percentage, accuracy, section-wise analysis). Uses the browser print window, so choose "Save as PDF".
- **Mock test**: `test.html?s=mock` draws random questions from all five sections, count set by the user.

## Exam mode (full screen + auto-submit)
Applies to every section and the mock test (shared `assets/engine.js`).
- Clicking **Start** opens the test in **full screen**.
- **Leaving full screen (Esc), switching tab, or switching window submits the test automatically.** The result page shows the reason and the report card marks it as auto-submitted.
- If the browser refuses the automatic full screen request, a "Full screen required" box asks the person to click once to enter it.
- Quit and normal Finish leave full screen without counting as a violation.
- Closing or reloading mid-test shows a browser warning.
