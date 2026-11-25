import { createClient } from '@supabase/supabase-js'

export const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
// A non-routable fallback lets the static UI render without credentials.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://unconfigured.invalid',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'unconfigured',
);
