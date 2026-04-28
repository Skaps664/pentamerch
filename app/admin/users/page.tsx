'use client'

import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface AdminUser {
  id: string
  email: string
  createdAt: string
  lastSignInAt: string | null
  emailConfirmedAt: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/users', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Unable to load users.')
        }

        const payload = (await response.json()) as AdminUser[]
        setUsers(payload)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to load users.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Users</h2>
        <p className="mt-1 text-sm text-slate-600">View everyone who has signed up and track their auth activity.</p>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </div>

      <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-600">
            <Spinner className="size-4" />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Created</th>
                <th className="text-left px-4 py-3 font-semibold">Last Sign In</th>
                <th className="text-left px-4 py-3 font-semibold">Email Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-900">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-slate-500">{user.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{user.createdAt.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-slate-700">{user.lastSignInAt ? user.lastSignInAt.slice(0, 10) : 'Never'}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {user.emailConfirmedAt ? 'Confirmed' : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
