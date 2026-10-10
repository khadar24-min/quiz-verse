import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Local-only mode remains available until Supabase credentials are configured.
export const supabase = url && anonKey && !url.includes("YOUR_PROJECT_ID") && !anonKey.startsWith("YOUR_")
  ? createClient(url, anonKey)
  : null;
export const cloudEnabled = Boolean(supabase);
