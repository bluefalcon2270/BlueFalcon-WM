"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CouponsTab({ coupons }: { coupons: any[] }) {
  const router = useRouter()
  const [form, setForm] = useState({ code: "", discountType: "PERCENTAGE", discountValue: "" })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, discountValue: parseFloat(form.discountValue) })
    })
    setSaving(false)
    setForm({ code: "", discountType: "PERCENTAGE", discountValue: "" })
    router.refresh()
  }

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) })
    router.refresh()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this coupon?")) return
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <div className="card-header"><h3>Create Coupon</h3></div>
        <div className="card-body">
          <div className="grid md:grid-2 gap-4">
            <div className="form-group">
              <label className="label">Coupon Code</label>
              <input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" />
            </div>
            <div className="form-group">
              <label className="label">Discount Type</label>
              <select className="select" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Discount Value</label>
              <input type="number" className="input" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "PERCENTAGE" ? "e.g. 20 (for 20%)" : "e.g. 10 (for $10)"} />
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary mt-4">{saving ? "Creating..." : "Create Coupon"}</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Code</th><th>Type</th><th>Value</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No coupons yet.</td></tr>
            )}
            {coupons.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1rem" }}>{c.code}</td>
                <td>{c.discountType === "PERCENTAGE" ? "%" : "$"}</td>
                <td style={{ fontWeight: 700 }}>{c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                <td><span className={`badge ${c.isActive ? "badge-green" : "badge-red"}`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(c.id, c.isActive)} className="btn btn-secondary btn-sm">{c.isActive ? "Deactivate" : "Activate"}</button>
                    <button onClick={() => del(c.id)} className="btn btn-danger btn-sm">Delete</button>
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
