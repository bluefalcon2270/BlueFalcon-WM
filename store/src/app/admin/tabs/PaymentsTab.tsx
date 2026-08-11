"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PaymentsTab({ payments }: { payments: any[] }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", description: "", instructions: "", requiresReceipt: true })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setSaving(false)
    setForm({ name: "", description: "", instructions: "", requiresReceipt: true })
    router.refresh()
  }

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/payments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) })
    router.refresh()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this payment method?")) return
    await fetch(`/api/admin/payments/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <div className="card-header"><h3>Add Payment Method</h3></div>
        <div className="card-body flex flex-col gap-4">
          <div className="grid md:grid-2 gap-4">
            <div className="form-group">
              <label className="label">Method Name *</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Card to Card Transfer" />
            </div>
            <div className="form-group">
              <label className="label">Short Description</label>
              <input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Bank account: 1234 5678..." />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Customer Instructions</label>
            <textarea className="input" rows={2} value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} placeholder="Step by step instructions shown at checkout..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="req-receipt" checked={form.requiresReceipt} onChange={e => setForm({ ...form, requiresReceipt: e.target.checked })} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="req-receipt" className="text-sm font-semibold" style={{ cursor: "pointer" }}>Require Receipt / Tracking ID from customer</label>
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? "Adding..." : "Add Payment Method"}</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Description</th><th>Requires Receipt</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No payment methods yet.</td></tr>
            )}
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700 }}>{p.name}</td>
                <td className="text-sm text-muted" style={{ maxWidth: 250 }}>{p.description}</td>
                <td><span className={`badge ${p.requiresReceipt ? "badge-blue" : "badge-gray"}`}>{p.requiresReceipt ? "Yes" : "No"}</span></td>
                <td><span className={`badge ${p.isActive ? "badge-green" : "badge-red"}`}>{p.isActive ? "Active" : "Inactive"}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(p.id, p.isActive)} className="btn btn-secondary btn-sm">{p.isActive ? "Disable" : "Enable"}</button>
                    <button onClick={() => del(p.id)} className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
