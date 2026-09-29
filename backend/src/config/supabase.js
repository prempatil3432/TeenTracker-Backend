const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

let supabase = null;
const isSupabaseConfigured = Boolean(
  config.supabase.url && 
  (config.supabase.serviceRoleKey || config.supabase.anonKey)
);

if (isSupabaseConfigured) {
  // Use service role key on backend to perform server-level queries safely
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
  supabase = createClient(config.supabase.url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  console.log('✓ Supabase client initialized with endpoint:', config.supabase.url);
} else {
  console.log('ℹ Supabase credentials not detected in .env. Running in local data store mode.');
}

function isTableMissingError(error) {
  if (!error) return false;
  const msg = (error.message || '').toLowerCase();
  const code = error.code || '';
  return (
    msg.includes('could not find the table') ||
    msg.includes('schema cache') ||
    msg.includes('relation') ||
    msg.includes('does not exist') ||
    code === '42P01' ||
    code === 'PGRST204' ||
    code === 'PGRST205'
  );
}

module.exports = {
  supabase,
  isSupabaseConfigured,
  isTableMissingError,
};
