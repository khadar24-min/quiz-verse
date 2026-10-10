# Quiz Verse setup

## 1. Run locally
1. Install Node.js LTS if needed.
2. Run `npm install`, then `npm run dev`.
3. The current app works in local mode without a Supabase project.

## 2. Configure Supabase (cloud accounts and shared results)
1. Create a project at https://supabase.com/dashboard.
2. In Project Settings > API, copy the Project URL and publishable/anon key. Never use a `service_role` key in a browser app.
3. Copy `.env.example` to `.env.local`; fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. In Supabase SQL Editor, run `supabase/schema.sql`.
5. Restart Vite (`Ctrl+C`, then `npm run dev`).
6. Auth and cloud helper functions are provided in `src/lib/cloudData.js`. Connect your desired sign-in UI and quiz-completion handler to these functions before claiming the app has live cloud accounts.
7. Configure Authentication > URL Configuration with your local URL and deployed URL. Enable email confirmation if desired.

**Important:** the existing app's current profile/history UI remains browser-local until the sign-in UI and quiz save flow are wired to the helpers. The Supabase schema and client helpers are prepared, but cloud mode is not automatically activated merely by adding keys. Do not expose a service-role key.

## 3. Question bank, filters and analytics
The app includes category, topic and difficulty filters and local quiz history. Review the bank in `src/App.jsx` before using it for formal exams. Add verified questions with an explanation for every answer. Analytics should be computed from saved attempts; cloud analytics need the save flow above wired in.

## 4. Production build and deployment
Run `npm run build` and fix all errors before deployment. Deploy the generated `dist/` folder to Vercel or Netlify. For Vercel: import the Git repository, use build command `npm run build`, output directory `dist`, and add the two `VITE_SUPABASE_*` environment variables in project settings. Redeploy after adding variables. Set the deployed URL in Supabase Auth URL Configuration.

## Security checklist
- Never commit `.env.local`.
- Never put Supabase service-role secrets in frontend code.
- Review RLS policies before production; leaderboard visibility is intentionally public in this starter schema.
- Test sign-up, email confirmation, sign-in, sign-out, data isolation, mobile layout and production build.
