
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xqqizxdgulmuhzdqwmyn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcWl6eGRndWxtdWh6ZHF3bXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzUzNDQsImV4cCI6MjA1ODA1MTM0NH0.G8IBD7d-4gU2ApnL07Z2Hn1AISCAP9s71crJcsSbLyM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Log for debugging
console.log(`Supabase client initialized`);
