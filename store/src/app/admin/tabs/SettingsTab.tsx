"use client"
import { useState } from "react"

export default function SettingsTab({ settings }: { settings: any }) {
  const [title, setTitle] = useState(settings?.siteTitle || "BlueFalcon Website Maker")
  const [logo, setLogo]   = useState(settings?.logoUrl || "")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  let parsedLayout: any[] = []
  try { parsedLayout = JSON.parse(settings?.homepageLayout || "[]") } catch {}

  const [layout, setLayout] = useState(JSON.stringify(parsedLayout, null, 2))

  let parsedFooter: any = {}
  try { parsedFooter = JSON.parse(settings?.footerLayout || "{}") } catch {}
  const [footer, setFooter] = useState(JSON.stringify(parsedFooter, null, 2))

  const save = async () => {
    setSaving(true); setMsg(null)
    try {
      JSON.parse(layout)
      JSON.parse(footer)
    } catch {
      setMsg("❌ Invalid JSON in layout or footer field. Please check the format.")
      setSaving(false); return
    }

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteTitle: title, logoUrl: logo, homepageLayout: layout, footerLayout: footer })
    })
    setSaving(false)
    if (res.ok) setMsg("✅ Settings saved successfully!")
    else setMsg("❌ Failed to save.")
  }

  return (
    <div className="card">
      <div className="card-header"><h3>Site Settings</h3></div>
      <div className="card-body flex flex-col gap-5">
        <div className="form-group">
          <label className="label">Site Title</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="BlueFalcon Website Maker" />
        </div>
        <div className="form-group">
          <label className="label">Logo URL</label>
          <input className="input" value={logo} onChange={e => setLogo(e.target.value)} placeholder="https://example.com/logo.png" />
          {logo && <img src={logo} alt="logo preview" style={{ height: 48, marginTop: "0.75rem", objectFit: "contain", borderRadius: "var(--radius-sm)" }} />}
        </div>

        <hr className="divider" />

        <div className="form-group">
          <label className="label">Homepage Layout (JSON)</label>
          <p className="text-xs text-muted mb-2">Array of sections. Types: <code>hero</code>, <code>featured</code>. Featured requires <code>productIds</code> array.</p>
          <textarea className="input" rows={12} value={layout} onChange={e => setLayout(e.target.value)} style={{ fontFamily: "monospace", fontSize: "0.8rem" }} />
        </div>

        <div className="form-group">
          <label className="label">Footer Settings (JSON)</label>
          <textarea className="input" rows={5} value={footer} onChange={e => setFooter(e.target.value)} style={{ fontFamily: "monospace", fontSize: "0.8rem" }} />
        </div>

        {msg && <div className={`alert ${msg.startsWith("✅") ? "alert-success" : "alert-error"}`}>{msg}</div>}

        <button onClick={save} disabled={saving} className="btn btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
