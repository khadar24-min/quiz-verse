import { supabase } from "./supabase";

export async function signUp(email, password, displayName) {
  if (!supabase) throw new Error("Add your Supabase URL and anon key to .env.local first.");
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
  if (error) throw error;
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({ id: data.user.id, display_name: displayName || "Player" });
    if (profileError) throw profileError;
  }
  return data;
}
export async function signIn(email, password) {
  if (!supabase) throw new Error("Add your Supabase URL and anon key to .env.local first.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error; return data;
}
export async function signOut() { if (!supabase) return; const { error } = await supabase.auth.signOut(); if (error) throw error; }
export async function saveCloudAttempt(attempt) {
  if (!supabase) return { saved: false, reason: "local-only" };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false, reason: "sign-in-required" };
  const row = { user_id: user.id, category: attempt.category, topic: attempt.topic || "All topics", difficulty: attempt.difficulty || "All levels", total_questions: attempt.total, correct_answers: attempt.score, duration_seconds: attempt.duration || 0 };
  const { error } = await supabase.from("quiz_attempts").insert(row); if (error) throw error; return { saved: true };
}
export async function getMyAttempts() {
  if (!supabase) return []; const { data, error } = await supabase.from("quiz_attempts").select("*").order("completed_at", { ascending: false }); if (error) throw error; return data || [];
}
export async function getLeaderboard() {
  if (!supabase) return []; const { data, error } = await supabase.rpc("get_leaderboard", { limit_count: 50 }); if (error) throw error; return data || [];
}
