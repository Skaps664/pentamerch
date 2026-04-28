'use client'

import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

type OrderStatus = 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled'

interface AdminOrder {
  id: string
  email: string
  customerName: string
  status: OrderStatus
  total: number
  shipping: number
  tax: number
  trackingNumber?: string | null
  createdAt: string
  deliveryAddress: {
    fullName?: string
    line1?: string
    line2?: string
    city?: string
    county?: string
    postcode?: string
    country?: string
  }
}

const orderStatuses: OrderStatus[] = ['Processing', 'Dispatched', 'Delivered', 'Cancelled']

function formatAddress(address: AdminOrder['deliveryAddress']): string {
  return [address.fullName, address.line1, address.line2, address.city, address.county, address.postcode, address.country]
    .filter(Boolean)
    .join(', ')
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, { status: OrderStatus; trackingNumber: string }>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/orders', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Unable to load orders.')
        }

        const payload = (await response.json()) as AdminOrder[]
        setOrders(payload)
        setDrafts(
          Object.fromEntries(
            payload.map((order) => [order.id, { status: order.status, trackingNumber: order.trackingNumber ?? '' }])
          )
        )
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to load orders.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadOrders()
  }, [])

  const handleSave = async (id: string) => {
    const draft = drafts[id]
    if (!draft) {
      return
    }

    setSavingId(id)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: draft.status,
          trackingNumber: draft.trackingNumber.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string }
        throw new Error(payload.message ?? 'Unable to update order.')
      }

      const updated = (await response.json()) as AdminOrder
      setOrders((current) => current.map((order) => (order.id === updated.id ? updated : order)))
      setDrafts((current) => ({
        ...current,
        [id]: {
          status: updated.status,
          trackingNumber: updated.trackingNumber ?? '',
        },
      }))
      setMessage('Order updated successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update order.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
        <p className="mt-1 text-sm text-slate-600">View customer orders and update their status or tracking number.</p>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </div>

      <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-600">
            <Spinner className="size-4" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-600">No orders have been placed yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Order</th>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Tracking</th>
                <th className="text-left px-4 py-3 font-semibold">Total</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const draft = drafts[order.id] ?? { status: order.status, trackingNumber: order.trackingNumber ?? '' }

                return (
                  <tr key={order.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3 text-slate-900">
                      <div className="font-medium">{order.id}</div>
                      <div className="mt-1 text-xs text-slate-500">{order.createdAt.slice(0, 10)}</div>
                      <div className="mt-1 text-xs text-slate-500">{formatAddress(order.deliveryAddress)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-slate-500">{order.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                        value={draft.status}
                        onChange={(e) =>
                          setDrafts((current) => ({
                            ...current,
                            [order.id]: { ...draft, status: e.target.value as OrderStatus },
                          }))
                        }
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        value={draft.trackingNumber}
                        onChange={(e) =>
                          setDrafts((current) => ({
                            ...current,
                            [order.id]: { ...draft, trackingNumber: e.target.value },
                          }))
                        }
                        placeholder="Tracking number"
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      GBP {order.total.toFixed(2)}
                      <div className="text-xs text-slate-500">Shipping GBP {order.shipping.toFixed(2)} · Tax GBP {order.tax.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleSave(order.id)}
                        disabled={savingId === order.id}
                        className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {savingId === order.id ? (
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
