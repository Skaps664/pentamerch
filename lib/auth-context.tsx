'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const USERS_KEY = 'pentamerch-auth-users-v1'
const CURRENT_USER_KEY = 'pentamerch-auth-current-user-v1'

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

interface StoredUser {
  username: string
  email: string
  password: string
  address: UserAddress
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

interface AuthContextValue {
  hydrated: boolean
  user: AuthUser | null
  signup: (payload: SignupPayload) => { ok: boolean; message: string }
  login: (payload: LoginPayload) => { ok: boolean; message: string }
  getUserSlug: () => string | null
  updateAddress: (address: UserAddress) => { ok: boolean; message: string }
  changePassword: (payload: ChangePasswordPayload) => { ok: boolean; message: string }
  logout: () => void
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
    ...address,
  }
}

function readUsers(): StoredUser[] {
  try {
    const savedUsers = window.localStorage.getItem(USERS_KEY)
    const users = savedUsers ? (JSON.parse(savedUsers) as StoredUser[]) : []
    return users.map((item) => ({
      ...item,
      address: migrateAddress(item.address),
    }))
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    username: user.username,
    email: user.email,
    address: migrateAddress(user.address),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CURRENT_USER_KEY)
      if (saved) {
        setUser(JSON.parse(saved) as AuthUser)
      }
    } catch {
      setUser(null)
    } finally {
      setHydrated(true)
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    hydrated,
    user,
    signup: ({ username, email, password, confirmPassword }) => {
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

      try {
        const users = readUsers()

        if (users.some((item) => normalizeEmail(item.email) === cleanEmail)) {
          return { ok: false, message: 'Email already registered.' }
        }

        const newUser: StoredUser = {
          username: cleanUsername,
          email: cleanEmail,
          password,
          address: defaultAddress,
        }

        const nextUsers = [...users, newUser]
        writeUsers(nextUsers)

        const authUser = toAuthUser(newUser)
        setUser(authUser)
        window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser))

        return { ok: true, message: 'Account created successfully.' }
      } catch {
        return { ok: false, message: 'Unable to create account. Please try again.' }
      }
    },
    login: ({ email, password }) => {
      const cleanEmail = normalizeEmail(email)
      if (!cleanEmail || !password) {
        return { ok: false, message: 'Email and password are required.' }
      }

      try {
        const users = readUsers()

        const matched = users.find(
          (item) => normalizeEmail(item.email) === cleanEmail && item.password === password
        )

        if (!matched) {
          return { ok: false, message: 'Invalid email or password.' }
        }

        const authUser = toAuthUser(matched)
        setUser(authUser)
        window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser))
        return { ok: true, message: 'Logged in successfully.' }
      } catch {
        return { ok: false, message: 'Unable to log in right now. Please try again.' }
      }
    },
    getUserSlug: () => {
      if (!user) {
        return null
      }

      return toUserSlug(user.username)
    },
    updateAddress: (address) => {
      if (!user) {
        return { ok: false, message: 'You need to be logged in.' }
      }

      const nextAddress = migrateAddress(address)

      try {
        const users = readUsers()
        const index = users.findIndex((item) => normalizeEmail(item.email) === normalizeEmail(user.email))

        if (index === -1) {
          return { ok: false, message: 'User not found.' }
        }

        users[index] = {
          ...users[index],
          address: nextAddress,
        }

        writeUsers(users)

        const nextUser: AuthUser = {
          ...user,
          address: nextAddress,
        }

        setUser(nextUser)
        window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser))
        return { ok: true, message: 'Address updated successfully.' }
      } catch {
        return { ok: false, message: 'Unable to update address.' }
      }
    },
    changePassword: ({ currentPassword, newPassword, confirmPassword }) => {
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

      try {
        const users = readUsers()
        const index = users.findIndex((item) => normalizeEmail(item.email) === normalizeEmail(user.email))

        if (index === -1) {
          return { ok: false, message: 'User not found.' }
        }

        if (users[index].password !== currentPassword) {
          return { ok: false, message: 'Current password is incorrect.' }
        }

        users[index] = {
          ...users[index],
          password: newPassword,
        }

        writeUsers(users)
        return { ok: true, message: 'Password changed successfully.' }
      } catch {
        return { ok: false, message: 'Unable to change password.' }
      }
    },
    logout: () => {
      setUser(null)
      window.localStorage.removeItem(CURRENT_USER_KEY)
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
