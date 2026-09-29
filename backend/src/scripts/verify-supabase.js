const { supabase, isSupabaseConfigured } = require('../config/supabase');
const config = require('../config/env');

async function testConnection() {
  console.log('Testing Supabase Connection...');
  console.log('Project URL:', config.supabase.url);
  console.log('Is Configured:', isSupabaseConfigured);

  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase is not configured properly!');
    process.exit(1);
  }

  try {
    // Attempt a light query to verify database connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('Note on database query:', error.message);
      if (error.code === '42P01') {
        console.log('ℹ The tables have not been created yet in this Supabase project.');
        console.log('👉 Please run `backend/src/db/schema.sql` in your Supabase SQL Editor.');
      } else {
        console.log('Error details:', error);
      }
    } else {
      console.log('✓ Successfully connected to Supabase PostgreSQL database!');
    }
  } catch (err) {
    console.error('Connection test error:', err.message);
  }
}

testConnection();
