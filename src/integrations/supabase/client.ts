import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Use the project ID from config.toml to construct the URL
const projectId = 'hokvtvlbssqleollassf'
const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhva3Z0dmxic3NxbGVvbGxhc3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTY1NzgsImV4cCI6MjAyMjQ3MjU3OH0.HYl_Aa_FYm6K_Z5poNQHqnr1Th_qGKM5mbKI_5_RWWQ'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})