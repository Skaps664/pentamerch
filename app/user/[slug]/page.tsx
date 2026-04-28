'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth, type UserAddress } from '@/lib/auth-context'

type AccountTab = 'orders' | 'settings' | 'complaints'

type OrderStatus = 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface UserOrder {
  id: string
  placedOn: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  deliveryAddress: string
  trackingNumber?: string
}

interface ComplaintRecord {
  id: string
  createdAt: string
  reason: string
  details: string
  orderId: string
  status: 'Open' | 'In Review' | 'Resolved'
}

const complaintReasons = [
  'Late delivery',
  'Wrong item received',
  'Damaged product',
  'Refund issue',
  'Payment issue',
  'Other',
]

function ordersKey(slug: string): string {
  return `pentamerch-user-orders-${slug}`
}

function complaintsKey(slug: string): string {
  return `pentamerch-user-complaints-${slug}`
}

function getFakeOrders(address: UserAddress): UserOrder[] {
  const addressText = [address.line1, address.line2, address.city, address.postcode, address.country]
    .filter(Boolean)
    .join(', ') || '221B Baker Street, London, NW1 6XE, United Kingdom'

  return [
    {
      id: 'PM-901872',
      placedOn: '2026-04-10',
      status: 'Dispatched',
      total: 239.98,
      items: [
        { name: 'Premium Wireless Headphones', quantity: 1, price: 199.99 },
        { name: 'Phone Charger Cable', quantity: 2, price: 19.995 },
      ],
      deliveryAddress: addressText,
      trackingNumber: 'UKRM-TRK-9483112',
    },
    {
      id: 'PM-901544',
      placedOn: '2026-03-29',
      status: 'Delivered',
      total: 129.99,
      items: [
        { name: 'Luxury Perfume', quantity: 1, price: 129.99 },
      ],
      deliveryAddress: addressText,
    },
    {
      id: 'PM-900991',
      placedOn: '2026-03-14',
      status: 'Processing',
      total: 59.99,
      items: [
        { name: 'Yoga Mat Premium', quantity: 1, price: 59.99 },
      ],
      deliveryAddress: addressText,
    },
  ]
}

function statusBadgeColor(status: OrderStatus): string {
  if (status === 'Delivered') {
    return 'bg-green-100 text-green-700 border-green-200'
  }

  if (status === 'Dispatched') {
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }

  if (status === 'Cancelled') {
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return 'bg-amber-100 text-amber-700 border-amber-200'
}

export default function UserSlugPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const { user, hydrated, logout, getUserSlug, updateAddress, changePassword } = useAuth()
  const currentSlug = typeof params?.slug === 'string' ? params.slug : ''

  const [activeTab, setActiveTab] = useState<AccountTab>('orders')
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([])

  const [addressForm, setAddressForm] = useState<UserAddress>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    county: '',
    postcode: '',
    country: 'United Kingdom',
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [complaintReason, setComplaintReason] = useState(complaintReasons[0])
  const [complaintOrderId, setComplaintOrderId] = useState('')
  const [complaintDetails, setComplaintDetails] = useState('')

  const [addressMessage, setAddressMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [complaintMessage, setComplaintMessage] = useState('')

  const profileSlug = getUserSlug()

  useEffect(() => {
    if (!hydrated) {
      return
    }

    if (!user) {
      router.replace('/auth/login')
      return
    }

    if (profileSlug && currentSlug && currentSlug !== profileSlug) {
      router.replace(`/user/${profileSlug}`)
      return
    }

    setAddressForm(user.address)
  }, [hydrated, user, currentSlug, profileSlug, router])

  useEffect(() => {
    if (!hydrated || !user || !profileSlug || !currentSlug || currentSlug !== profileSlug) {
      return
    }

    try {
      const savedOrders = window.localStorage.getItem(ordersKey(profileSlug))
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders) as UserOrder[])
      } else {
        const seeded = getFakeOrders(user.address)
        setOrders(seeded)
        window.localStorage.setItem(ordersKey(profileSlug), JSON.stringify(seeded))
      }

      const savedComplaints = window.localStorage.getItem(complaintsKey(profileSlug))
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints) as ComplaintRecord[])
      }
    } catch {
      setOrders(getFakeOrders(user.address))
      setComplaints([])
    }
  }, [hydrated, user, currentSlug, profileSlug])

  if (!hydrated || !user || !profileSlug || !currentSlug || currentSlug !== profileSlug) {
    return (
      <section className="py-12 md:py-16 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-6">Loading your account...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 md:py-14 bg-muted/20 min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer Portal</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1">Welcome, {user.username}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your orders, settings, and complaints.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('complaints')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'complaints' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Complaints
            </button>
          </div>
        </div>

        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Order {order.id}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Placed on {order.placedOn}</p>
                  </div>
                  <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  {order.items.map((item, index) => (
                    <p key={`${order.id}-item-${index}`}>
                      {item.quantity} x {item.name} - GBP {item.price.toFixed(2)}
                    </p>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <p className="text-slate-700"><span className="font-semibold">Total:</span> GBP {order.total.toFixed(2)}</p>
                  <p className="text-slate-700 md:col-span-2"><span className="font-semibold">Delivery:</span> {order.deliveryAddress}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                    View Details
                  </button>
                  {order.status === 'Dispatched' ? (
                    <a
                      href={`https://www.royalmail.com/track-your-item#/tracking-results/${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
                    >
                      Track Order
                    </a>
                  ) : null}
                  {(order.status === 'Delivered' || order.status === 'Cancelled') ? (
                    <button className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      Reorder
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'settings' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Address Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Update your delivery address.</p>

              <form
                className="mt-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const result = await updateAddress(addressForm)
                  setAddressMessage(result.message)
                }}
              >
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Full Name" value={addressForm.fullName} onChange={(e) => setAddressForm((prev) => ({ ...prev, fullName: e.target.value }))} />
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Phone Number" value={addressForm.phone} onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))} />
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Address Line 1" value={addressForm.line1} onChange={(e) => setAddressForm((prev) => ({ ...prev, line1: e.target.value }))} />
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Address Line 2" value={addressForm.line2} onChange={(e) => setAddressForm((prev) => ({ ...prev, line2: e.target.value }))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))} />
                  <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="County" value={addressForm.county} onChange={(e) => setAddressForm((prev) => ({ ...prev, county: e.target.value }))} />
                  <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Postcode" value={addressForm.postcode} onChange={(e) => setAddressForm((prev) => ({ ...prev, postcode: e.target.value }))} />
                  <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm((prev) => ({ ...prev, country: e.target.value }))} />
                </div>

                <button type="submit" className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800">
                  Save Address
                </button>
                {addressMessage ? <p className="text-sm text-slate-700">{addressMessage}</p> : null}
              </form>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground mt-1">Change your account password.</p>

              <form
                className="mt-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const result = await changePassword({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                  })
                  setPasswordMessage(result.message)
                  if (result.ok) {
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }
                }}
              >
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm" type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button type="submit" className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800">
                  Update Password
                </button>
                {passwordMessage ? <p className="text-sm text-slate-700">{passwordMessage}</p> : null}
              </form>

              <div className="mt-6 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    router.push('/auth/login')
                  }}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'complaints' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Lodge a Complaint</h2>
              <p className="text-sm text-muted-foreground mt-1">Submit a complaint and our support team will review it.</p>

              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!complaintDetails.trim()) {
                    setComplaintMessage('Please add complaint details.')
                    return
                  }

                  const newComplaint: ComplaintRecord = {
                    id: `CMP-${Date.now()}`,
                    createdAt: new Date().toISOString().slice(0, 10),
                    reason: complaintReason,
                    details: complaintDetails.trim(),
                    orderId: complaintOrderId,
                    status: 'Open',
                  }

                  const next = [newComplaint, ...complaints]
                  setComplaints(next)
                  window.localStorage.setItem(complaintsKey(profileSlug), JSON.stringify(next))

                  setComplaintDetails('')
                  setComplaintOrderId('')
                  setComplaintReason(complaintReasons[0])
                  setComplaintMessage('Complaint submitted successfully.')
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Reason</label>
                  <select
                    value={complaintReason}
                    onChange={(e) => setComplaintReason(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                  >
                    {complaintReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Related Order</label>
                  <select
                    value={complaintOrderId}
                    onChange={(e) => setComplaintOrderId(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                  >
                    <option value="">Select order (optional)</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>{order.id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Details</label>
                  <textarea
                    rows={4}
                    value={complaintDetails}
                    onChange={(e) => setComplaintDetails(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                    placeholder="Tell us what happened and what help you need."
                  />
                </div>

                <button type="submit" className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800">
                  Submit Complaint
                </button>
                {complaintMessage ? <p className="text-sm text-slate-700">{complaintMessage}</p> : null}
              </form>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Complaint History</h2>
              <p className="text-sm text-muted-foreground mt-1">Track your recent complaints and status.</p>

              <div className="mt-4 space-y-3">
                {complaints.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No complaints submitted yet.</p>
                ) : (
                  complaints.map((complaint) => (
                    <article key={complaint.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{complaint.id}</p>
                        <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-slate-700">{complaint.status}</span>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">Reason: {complaint.reason}</p>
                      <p className="text-sm text-slate-700">Order: {complaint.orderId || 'Not linked'}</p>
                      <p className="text-sm text-slate-700">Date: {complaint.createdAt}</p>
                      <p className="text-sm text-muted-foreground mt-2">{complaint.details}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="text-sm text-muted-foreground">
          Need storefront navigation? Go back to <Link href="/" className="text-foreground font-medium hover:underline">home page</Link>.
        </div>
      </div>
    </section>
  )
}
