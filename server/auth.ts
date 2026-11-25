import { createClient, type User } from '@supabase/supabase-js';

// Server verification: never trust browser state or user-editable user_metadata.
export async function requireUser(request: any, response: any): Promise<User | null> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    response.status(503).json({ error: 'Authentication is not configured.' });
    return null;
  }
  const match = /^Bearer (.+)$/.exec(request.headers?.authorization || '');
  if (!match) {
    response.status(401).json({ error: 'Authentication required.' });
    return null;
  }
  try {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(match[1]);
    if (error || !data.user) {
      response.status(401).json({ error: 'Invalid session.' });
      return null;
    }
    return data.user;
  } catch {
    response.status(503).json({ error: 'Authentication unavailable.' });
    return null;
  }
}
