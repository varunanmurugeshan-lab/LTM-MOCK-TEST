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
