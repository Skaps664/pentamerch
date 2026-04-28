'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

export interface UserAddress {
  fullName: string
  phone: string
  line1: string
  line2: string
  city: string
  county: string
  postcode: string
  country: string
}

interface AuthUser {
  username: string
  email: string
  address: UserAddress
}

interface SignupPayload {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface LoginPayload {
  email: string
  password: string
}

interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface AuthActionResult {
  ok: boolean
  message: string
}

interface AuthContextValue {
  hydrated: boolean
  user: AuthUser | null
  signup: (payload: SignupPayload) => Promise<AuthActionResult>
  login: (payload: LoginPayload) => Promise<AuthActionResult>
  getUserSlug: () => string | null
  updateAddress: (address: UserAddress) => Promise<AuthActionResult>
  changePassword: (payload: ChangePasswordPayload) => Promise<AuthActionResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

const defaultAddress: UserAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  county: '',
  postcode: '',
  country: 'United Kingdom',
}

export function toUserSlug(username: string): string {
  return username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function migrateAddress(address?: Partial<UserAddress>): UserAddress {
  return {
    ...defaultAddress,
    ...(address ?? {}),
  }
}

async function fetchProfile(): Promise<AuthUser | null> {
  const response = await fetch('/api/auth/profile', { cache: 'no-store' })
  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    email: string
    username: string
    address?: Partial<UserAddress>
  }

  if (!payload?.email || !payload?.username) {
    return null
  }

  return {
    email: payload.email,
    username: payload.username,
    address: migrateAddress(payload.address),
  }
}

async function upsertProfile(profile: { username: string; address: UserAddress }): Promise<AuthUser | null> {
  const response = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    email: string
    username: string
    address?: Partial<UserAddress>
  }

  return {
    email: payload.email,
    username: payload.username,
    address: migrateAddress(payload.address),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const profile = await fetchProfile()
          setUser(profile)
        } else {
          setUser(null)
        }
      } finally {
        setHydrated(true)
      }
    }

    void initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        return
      }

      void fetchProfile().then((profile) => {
        setUser(profile)
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    hydrated,
    user,
    signup: async ({ username, email, password, confirmPassword }) => {
      const cleanUsername = username.trim()
      const cleanEmail = normalizeEmail(email)

      if (!cleanUsername || !cleanEmail || !password || !confirmPassword) {
        return { ok: false, message: 'All fields are required.' }
      }

      if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords do not match.' }
      }

      if (password.length < 6) {
        return { ok: false, message: 'Password must be at least 6 characters.' }
      }

      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
          },
        },
      })

      if (error) {
        return { ok: false, message: error.message }
      }

      if (!data.session) {
        return {
          ok: true,
          message: 'Signup successful. Please verify your email before logging in.',
        }
      }

      const profile = await upsertProfile({
        username: cleanUsername,
        address: defaultAddress,
      })

      if (!profile) {
        return { ok: false, message: 'Unable to create your profile.' }
      }

      setUser(profile)
      return { ok: true, message: 'Account created successfully.' }
    },
    login: async ({ email, password }) => {
      const cleanEmail = normalizeEmail(email)

      if (!cleanEmail || !password) {
        return { ok: false, message: 'Email and password are required.' }
      }

      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        return { ok: false, message: error.message }
      }

      const profile = await fetchProfile()
      if (!profile) {
        return { ok: false, message: 'Unable to load your profile.' }
      }

      setUser(profile)
      return { ok: true, message: 'Logged in successfully.' }
    },
    getUserSlug: () => {
      if (!user) {
        return null
      }

      return toUserSlug(user.username)
    },
    updateAddress: async (address) => {
      if (!user) {
        return { ok: false, message: 'You need to be logged in.' }
      }

      const profile = await upsertProfile({
        username: user.username,
        address: migrateAddress(address),
      })

      if (!profile) {
        return { ok: false, message: 'Unable to update address.' }
      }

      setUser(profile)
      return { ok: true, message: 'Address updated successfully.' }
    },
    changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
      if (!user) {
        return { ok: false, message: 'You need to be logged in.' }
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        return { ok: false, message: 'All password fields are required.' }
      }

      if (newPassword.length < 6) {
        return { ok: false, message: 'New password must be at least 6 characters.' }
      }

      if (newPassword !== confirmPassword) {
        return { ok: false, message: 'New passwords do not match.' }
      }

      const supabase = getSupabaseBrowserClient()
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (verifyError) {
        return { ok: false, message: 'Current password is incorrect.' }
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        return { ok: false, message: error.message }
      }

      return { ok: true, message: 'Password changed successfully.' }
    },
    logout: async () => {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      setUser(null)
    },
  }), [hydrated, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}