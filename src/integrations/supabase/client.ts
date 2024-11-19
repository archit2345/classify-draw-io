import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const projectId = 'hokvtvlbssqleollassf'
const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhva3Z0dmxic3NxbGVvbGxhc3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NzU5NzcsImV4cCI6MjAyNjA1MTk3N30.Ij5l6qpb3RhvkN_gC_HF7k-JQwJLUWOEBGp_QHBjY0Y'

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
})