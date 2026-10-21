import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://')
  );
};

// Cliente oficial de Supabase para operaciones del lado del cliente / navegador
export const supabase = createClient(
  supabaseUrl || 'https://pdfksszabspzkgbqefcic.supabase.co',
  supabaseAnonKey || 'sb_publishable_21OY2olbACqDAhcQtuMCiw_FTQcfXKD',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Cliente con service role para tareas privilegiadas del servidor (si se requiere)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = supabaseServiceKey
  ? createClient(
      supabaseUrl || 'https://pdfksszabspzkgbqefcic.supabase.co',
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null;

export default supabase;
