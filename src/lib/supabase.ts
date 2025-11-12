import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfpvcqhvaukjnegxrzof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcHZjcWh2YXVram5lZ3hyem9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE4MTYsImV4cCI6MjA3Mzc5NzgxNn0.7qJaJicwnEwUFDUggQLgeGmIG_otNyhcKKcmRtKxVxE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Desabilita persistência de sessão (não precisa de refresh token)
    autoRefreshToken: false, // Desabilita refresh automático
    detectSessionInUrl: false, // Desabilita detecção de sessão na URL
  },
});
