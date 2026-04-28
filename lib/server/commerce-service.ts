import 'server-only'

import { randomUUID } from 'node:crypto'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export type OrderStatus = 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled'
export type ComplaintStatus = 'Open' | 'In Review' | 'Resolved'

export interface CheckoutItemPayload {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface OrderAddressPayload {
  fullName: string
  phone: string
  line1: string
  line2: string
  city: string
  county: string
  postcode: string
  country: string
}

export interface CreateOrderPayload {
  email: string
  customerName: string
  items: CheckoutItemPayload[]
  total: number
  shipping: number
  tax: number
  deliveryAddress: OrderAddressPayload
}

export interface OrderRow {
  id: string
  user_id: string | null
  email: string
  customer_name: string
  status: OrderStatus
  total: number
  shipping: number
  tax: number
  items: CheckoutItemPayload[]
  delivery_address: OrderAddressPayload
  tracking_number: string | null
  created_at: string
  updated_at: string
}

export interface ComplaintRow {
  id: string
  user_id: string | null
  order_id: string | null
  email: string
  reason: string
  details: string
  status: ComplaintStatus
  admin_reply: string | null
  created_at: string
  updated_at: string
}

export interface CreateComplaintPayload {
  orderId?: string
  reason: string
  details: string
  email: string
}

function mapOrderRow(row: OrderRow) {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    customerName: row.customer_name,
    status: row.status,
    total: Number(row.total),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    items: row.items,
    deliveryAddress: row.delivery_address,
    trackingNumber: row.tracking_number ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapComplaintRow(row: ComplaintRow) {
  return {
    id: row.id,
    userId: row.user_id,
    orderId: row.order_id ?? undefined,
    email: row.email,
    reason: row.reason,
    details: row.details,
    status: row.status,
    adminReply: row.admin_reply ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function createOrder(payload: CreateOrderPayload, userId?: string | null) {
  const supabase = getSupabaseAdminClient()
  const orderId = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`

  const { data, error } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      user_id: userId ?? null,
      email: payload.email,
      customer_name: payload.customerName,
      status: 'Processing',
      total: payload.total,
      shipping: payload.shipping,
      tax: payload.tax,
      items: payload.items,
      delivery_address: payload.deliveryAddress,
      tracking_number: null,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapOrderRow(data as OrderRow)
}

export async function getOrdersForUser(userId?: string | null, email?: string | null) {
  const supabase = getSupabaseAdminClient()
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  } else if (email) {
    query = query.eq('email', email)
  } else {
    return []
  }

  const { data, error } = await query
  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as OrderRow[]).map(mapOrderRow)
}

export async function getAllOrders() {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as OrderRow[]).map(mapOrderRow)
}

export async function updateOrder(id: string, payload: Partial<{ status: OrderStatus; trackingNumber: string }>) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .update({
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.trackingNumber !== undefined ? { tracking_number: payload.trackingNumber } : {}),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapOrderRow(data as OrderRow)
}

export async function createComplaint(payload: CreateComplaintPayload, userId?: string | null) {
  const supabase = getSupabaseAdminClient()
  const complaintId = `CMP-${randomUUID().slice(0, 8).toUpperCase()}`

  const { data, error } = await supabase
    .from('complaints')
    .insert({
      id: complaintId,
      user_id: userId ?? null,
      order_id: payload.orderId ?? null,
      email: payload.email,
      reason: payload.reason,
      details: payload.details,
      status: 'Open',
      admin_reply: null,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapComplaintRow(data as ComplaintRow)
}

export async function getComplaintsForUser(userId?: string | null, email?: string | null) {
  const supabase = getSupabaseAdminClient()
  let query = supabase.from('complaints').select('*').order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  } else if (email) {
    query = query.eq('email', email)
  } else {
    return []
  }

  const { data, error } = await query
  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as ComplaintRow[]).map(mapComplaintRow)
}

export async function getAllComplaints() {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false })
  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as ComplaintRow[]).map(mapComplaintRow)
}

export async function updateComplaint(
  id: string,
  payload: Partial<{ status: ComplaintStatus; adminReply: string }>
) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from('complaints')
    .update({
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.adminReply !== undefined ? { admin_reply: payload.adminReply } : {}),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapComplaintRow(data as ComplaintRow)
}