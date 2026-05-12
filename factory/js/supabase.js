import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://qrjfywdvierugfvjwjpz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyamZ5d2R2aWVydWdmdmp3anB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMjI4NTMsImV4cCI6MjA5Mjg5ODg1M30.2JIyjqi0hyqFfGbpe2rHc-sOHW_q1OD1rUWp8ynMsvg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
