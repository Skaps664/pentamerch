'use client'

import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

type ComplaintStatus = 'Open' | 'In Review' | 'Resolved'

interface AdminComplaint {
  id: string
  email: string
  orderId: string | null
  reason: string
  details: string
  status: ComplaintStatus
  adminReply?: string | null
  createdAt: string
}

const complaintStatuses: ComplaintStatus[] = ['Open', 'In Review', 'Resolved']

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, { status: ComplaintStatus; adminReply: string }>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/complaints', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Unable to load complaints.')
        }

        const payload = (await response.json()) as AdminComplaint[]
        setComplaints(payload)
        setDrafts(
          Object.fromEntries(
            payload.map((complaint) => [
              complaint.id,
              { status: complaint.status, adminReply: complaint.adminReply ?? '' },
            ])
          )
        )
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to load complaints.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadComplaints()
  }, [])

  const handleSave = async (id: string) => {
    const draft = drafts[id]
    if (!draft) {
      return
    }

    setSavingId(id)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: draft.status,
          adminReply: draft.adminReply.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string }
        throw new Error(payload.message ?? 'Unable to update complaint.')
      }

      const updated = (await response.json()) as AdminComplaint
      setComplaints((current) => current.map((complaint) => (complaint.id === updated.id ? updated : complaint)))
      setDrafts((current) => ({
        ...current,
        [id]: {
          status: updated.status,
          adminReply: updated.adminReply ?? '',
        },
      }))
      setMessage('Complaint updated successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update complaint.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Complaints</h2>
        <p className="mt-1 text-sm text-slate-600">Review customer complaints, update status, and reply directly from the panel.</p>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </div>

      <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-600">
            <Spinner className="size-4" />
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600">No complaints have been submitted yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Complaint</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Reply</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => {
                const draft = drafts[complaint.id] ?? {
                  status: complaint.status,
                  adminReply: complaint.adminReply ?? '',
                }

                return (
                  <tr key={complaint.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 text-slate-900">
                      <div className="font-medium">{complaint.reason}</div>
                      <div className="mt-1 text-xs text-slate-500">{complaint.id}</div>
                      <div className="text-xs text-slate-500">{complaint.createdAt.slice(0, 10)}</div>
                      <div className="mt-2 text-slate-700">{complaint.details}</div>
                      <div className="mt-2 text-xs text-slate-500">{complaint.email}</div>
                      <div className="text-xs text-slate-500">Order: {complaint.orderId ?? 'Not linked'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                        value={draft.status}
                        onChange={(e) =>
                          setDrafts((current) => ({
                            ...current,
                            [complaint.id]: { ...draft, status: e.target.value as ComplaintStatus },
                          }))
                        }
                      >
                        {complaintStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        value={draft.adminReply}
                        onChange={(e) =>
                          setDrafts((current) => ({
                            ...current,
                            [complaint.id]: { ...draft, adminReply: e.target.value },
                          }))
                        }
                        placeholder="Reply to the customer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleSave(complaint.id)}
                        disabled={savingId === complaint.id}
                        className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {savingId === complaint.id ? (
                          <span className="inline-flex items-center gap-2">
                            <Spinner className="size-3.5" />
                            Saving
                          </span>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
