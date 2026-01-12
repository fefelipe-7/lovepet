import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // We will create this type definition file

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
);
