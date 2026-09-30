# Placement Practice Hub
Static site (no build step). Sections: Reasoning, Quant, Verbal, CS Fundamentals, Technical MCQ.

## Deploy
1. `git init && git add . && git commit -m "Practice hub"`
2. Create an empty GitHub repo, then `git remote add origin <url> && git branch -M main && git push -u origin main`
3. vercel.com > Add New > Project > import the repo > Framework Preset: **Other** > Deploy.

## Add or edit questions
Open a file in `data/` and add an item: `[question, [options], correctIndex, explanation]`.
The question counts on the home page update automatically.
