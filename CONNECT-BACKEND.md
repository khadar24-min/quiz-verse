# Quiz Verse Supabase connection

This project is configured for the Supabase project `questionverse` in Mumbai.

- Project URL: https://lxkpdvnoajpnwicjhzqi.supabase.co
- Client config is in `.env.local` (publishable key only; safe for browser use when RLS is enabled).
- Database schema has already been applied to the hosted project through Supabase.
- Tables: `profiles`, `questions`, `quiz_attempts`, `quiz_attempt_answers`.
- RLS is enabled. Users can only read/write their own quiz attempts and answer details. Published questions can be read publicly. Leaderboard uses an authenticated RPC that exposes aggregate stats only.
- New auth users receive a profile row through a database trigger.

## Important current limitation
The Supabase project and schema are live, and `src/lib/cloudData.js` contains helpers for sign-up, sign-in, sign-out, saving attempts, retrieving history, and loading the leaderboard. The current `src/App.jsx` UI still uses browser-local history/profile and has not yet been wired to call these helpers. Therefore cloud sign-in, cloud-saved history, analytics, and leaderboard are not active in the UI yet.

## Run
```bash
npm install
npm run dev
```

Never add a Supabase service-role/secret key to a Vite frontend. `.env.local` is ignored by Git; keep it that way. For deployment, add the same two `VITE_SUPABASE_*` values to your hosting provider's environment variables and set the deployed URL in Supabase Authentication URL Configuration.
