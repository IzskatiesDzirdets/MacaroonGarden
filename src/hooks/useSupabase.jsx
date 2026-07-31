import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = 'https://ibnvqljclchzlbvfwugj.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibnZxbGpjbGNoemxidmZ3dWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDM4MjIsImV4cCI6MjA4NjgxOTgyMn0.oQqSvLbbDcWDpgJdDYde11sd6SX96snBIYs1FzfcCvo'

export const sb = createClient(SB_URL, SB_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

const SupabaseContext = createContext({
  sb,
  user: null,
  profile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
})

export function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await sb
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error
      setProfile(data || null)
    } catch (err) {
      console.warn('Failed to load profile:', err.message)
      setProfile(null)
    }
  }

  useEffect(() => {
    // Check active session
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    const { data, error } = await sb.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const register = async (email, password, fullName) => {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    const { error } = await sb.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (phone, address) => {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await sb.from('profiles').upsert({
      id: user.id,
      phone,
      address,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    setProfile({ id: user.id, phone, address })
    return data
  }

  const refreshProfile = () => {
    if (user) fetchProfile(user.id)
  }

  return (
    <SupabaseContext.Provider
      value={{
        sb,
        user,
        profile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  return useContext(SupabaseContext)
}
