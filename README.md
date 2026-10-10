# Quiz Verse

A redesigned React + Vite quiz experience.

## Run locally
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. Open Terminal > New Terminal.
4. Run `npm install` if needed.
5. Run `npm run dev`.
6. Open the local URL printed by Vite (usually http://localhost:5173).

## Included
- Six categories and topic selection
- Searchable category explorer
- Difficulty and question-count setup
- Question feedback and explanations
- Results summary and answer review
- Responsive desktop/mobile layout

## Starter question bank
The app includes a small sample bank to demonstrate the experience. Question counts are capped to the number of matching questions available. Add more entries to the `bank` array in `src/App.jsx` to expand it. A live timer display and persistent user accounts are not implemented in this frontend starter.


## Quiz Verse 3.0
See `DEPLOYMENT.md` for Supabase schema, environment setup, and deployment steps. Cloud schema/client helpers are included; app UI must be wired to them before cloud accounts/results are live.
