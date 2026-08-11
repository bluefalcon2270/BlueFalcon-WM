"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = ["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "CANCELLED"]
const STATUS_BADGE: Record<string, string> = {
  PENDING: "badge-yellow", APPROVED: "badge-blue", SHIPPED: "badge-blue",
  DELIVERED: "badge-green", CANCELLED: "badge-red"
}

export default function OrdersTab({ orders }: { orders: any[] }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [statuses, setStatuses] = useState<Record<string, string>>({})

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.user.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.user.username?.toLowerCase().includes(search.toLowerCase())
  )

  const saveOrder = async (orderId: string) => {
    setSaving(orderId)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statuses[orderId], fulfillmentNote: notes[orderId] })
    })
    setSaving(null)
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2>Orders ({orders.length})</h2>
        <input type="text" className="input" placeholder="Search by user or order ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <>
                <tr key={order.id} style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <td style={{ fontFamily: "monospace", fontWeight: 600 }}>#{order.id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.user.username || "—"}</div>
                    <div className="text-xs text-muted">{order.user.email}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                  <td className="text-sm">{order.paymentMethod || "—"}</td>
                  <td><span className={`badge ${STATUS_BADGE[order.status] || "badge-gray"}`}>{order.status}</span></td>
                  <td className="text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td><button className="btn btn-secondary btn-sm">{expanded === order.id ? "Collapse" : "Manage"}</button></td>
                </tr>

                {expanded === order.id && (
                  <tr key={`${order.id}-detail`}>
                    <td colSpan={7} style={{ background: "var(--bg-subtle)", padding: "1.25rem 1.5rem" }}>
                      <div className="grid md:grid-2 gap-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="mb-3">Items</h4>
                          {order.orderItems.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                              <span>{item.product.name} × {item.quantity}</span>
                              <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.receiptId && <p className="text-xs text-muted mt-3">Receipt ID: <strong>{order.receiptId}</strong></p>}
                          {order.customerNote && <p className="text-xs text-muted mt-1">Note: {order.customerNote}</p>}
                        </div>

                        {/* Update Panel */}
                        <div className="flex flex-col gap-4">
                          <div className="form-group">
                            <label className="label">Update Status</label>
                            <select className="select" defaultValue={order.status} onChange={e => setStatuses(s => ({ ...s, [order.id]: e.target.value }))}>
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="label">Fulfillment Note (shown to customer)</label>
                            <textarea className="input" rows={3} placeholder="License key, download link, tracking number..." defaultValue={order.fulfillmentNote || ""} onChange={e => setNotes(n => ({ ...n, [order.id]: e.target.value }))} />
                          </div>
                          <button onClick={() => saveOrder(order.id)} disabled={saving === order.id} className="btn btn-primary btn-sm">
                            {saving === order.id ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
