import { createClient } from '@supabase/supabase-js'

const SB_URL =
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://ibnvqljclchzlbvfwugj.supabase.co'

const SB_KEY =
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibnZxbGpjbGNoemxidmZ3dWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDM4MjIsImV4cCI6MjA4NjgxOTgyMn0.oQqSvLbbDcWDpgJdDYde11sd6SX96snBIYs1FzfcCvo'

export const supabase = createClient(SB_URL, SB_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

export default supabase
