
import { createClient } from '@supabase/supabase-js';

// Using direct connection information
const supabaseUrl = 'https://odslariaeiwidnmvzcgg.supabase.co';
const supabaseAnonKey = 'sb_publishable_DOaPPqgOyaIOe3OPpvcm9Q_rAKFSjO4';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabase() {
  return supabase;
}
