import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set.`);
  return val;
}

// Service role key — never expose this to the browser.
// It bypasses RLS so the upload route can write to storage without auth headers.
const supabaseAdmin = createClient(
  requireEnv('SUPABASE_URL'),
  requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { persistSession: false } }
);

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? 'product-media';

export default supabaseAdmin;
