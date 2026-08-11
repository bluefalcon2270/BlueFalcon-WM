"use client"
import { useState } from "react"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "badge-yellow",
  APPROVED:  "badge-blue",
  SHIPPED:   "badge-blue",
  DELIVERED: "badge-green",
  CANCELLED: "badge-red",
}

export default function ProfileClient({ user }: { user: any }) {
  const [tab, setTab] = useState<"orders" | "settings">("orders")

  // Settings state
  const [username, setUsername]   = useState(user.username || "")
  const [email, setEmail]         = useState(user.email || "")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null)

  const saveSettings = async () => {
    if (newPw && newPw !== confirmPw) { setMsg({ type: "error", text: "New passwords do not match." }); return }
    setSaving(true); setMsg(null)

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, currentPassword: currentPw || undefined, newPassword: newPw || undefined })
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) setMsg({ type: "success", text: "Settings saved! Refresh to see changes." })
    else setMsg({ type: "error", text: data.error || "Failed to save." })
  }

  return (
    <div className="container page-padding">
      <div className="grid md:grid-2 gap-8" style={{ gridTemplateColumns: "260px 1fr" }}>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-4">
          {/* Avatar card */}
          <div className="card card-body text-center">
            <div style={{
              width: 72, height: 72,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "white",
              fontSize: "1.75rem", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem"
            }}>
              {(user.username || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <h3 className="mb-1">{user.username || "User"}</h3>
            <p className="text-sm text-muted">{user.email}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: user.emailVerified ? "var(--success)" : "var(--warning)" }} />
              <span className="text-xs text-muted">{user.emailVerified ? "Verified" : "Email not verified"}</span>
            </div>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="btn btn-primary btn-sm w-full mt-4">Admin Dashboard</Link>
            )}
          </div>

          {/* Nav */}
          <div className="card" style={{ overflow: "hidden" }}>
            {[
              { key: "orders",   label: "My Orders",        icon: "📦" },
              { key: "settings", label: "Account Settings",  icon: "⚙️" },
            ].map(item => (
              <button key={item.key} onClick={() => setTab(item.key as any)} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                width: "100%", padding: "0.85rem 1.25rem",
                background: tab === item.key ? "var(--primary-light)" : "transparent",
                color: tab === item.key ? "var(--primary)" : "var(--text-muted)",
                border: "none", borderLeft: `3px solid ${tab === item.key ? "var(--primary)" : "transparent"}`,
                cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
                transition: "all var(--transition)", textAlign: "left"
              }}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div>
          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div>
              <h2 className="mb-6">Order History</h2>
              {user.orders.length === 0 ? (
                <div className="empty-state card" style={{ minHeight: "300px" }}>
                  <span style={{ fontSize: "3rem" }}>📦</span>
                  <h3>No orders yet</h3>
                  <p className="text-muted text-sm">Your completed orders will appear here.</p>
                  <Link href="/shop" className="btn btn-primary btn-sm mt-4">Start Shopping</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {user.orders.map((order: any) => (
                    <div key={order.id} className="card">
                      <div className="card-header flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-sm text-muted mb-0.5">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`badge ${STATUS_COLORS[order.status] || "badge-gray"}`}>{order.status}</span>
                          <span style={{ fontWeight: 800, fontSize: "1rem" }}>${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.fulfillmentNote && (
                        <div style={{ margin: "0 1.5rem", background: "var(--primary-light)", border: "1px solid var(--primary)", borderRadius: "var(--radius)", padding: "0.85rem 1rem", marginTop: "1rem" }}>
                          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>📬 Delivery Note</p>
                          <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{order.fulfillmentNote}</p>
                        </div>
                      )}

                      <div className="card-body flex flex-col gap-3">
                        {order.orderItems.map((item: any) => {
                          const img = item.product.images?.find((i: any) => i.isMain) || item.product.images?.[0]
                          return (
                            <div key={item.id} className="flex items-center gap-4">
                              <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-subtle)", flexShrink: 0 }}>
                                {img && <img src={img.url} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm line-clamp-1">{item.product.name}</p>
                                <p className="text-xs text-muted">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                              </div>
                              <span className="font-bold text-sm">${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <div className="card">
              <div className="card-header"><h2>Account Settings</h2></div>
              <div className="card-body flex flex-col gap-5">
                <div className="form-group">
                  <label className="label">Username</label>
                  <input type="text" className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your username" />
                </div>
                <div className="form-group">
                  <label className="label">Email Address</label>
                  <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>

                <hr className="divider" />

                <h4>Change Password</h4>
                <div className="form-group">
                  <label className="label">Current Password</label>
                  <input type="password" className="input" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Your current password" />
                </div>
                <div className="form-group">
                  <label className="label">New Password</label>
                  <input type="password" className="input" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (min 6 chars)" />
                </div>
                <div className="form-group">
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" />
                </div>

                {msg && <div className={`alert ${msg.type === "success" ? "alert-success" : "alert-error"}`}>{msg.text}</div>}

                <button onClick={saveSettings} disabled={saving} className="btn btn-primary">
                  {saving ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
