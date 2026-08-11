"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const checkUser = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const res = await fetch("/api/auth/check-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier }) })
      const data = await res.json()
      setStep(data.exists ? 2 : 3)
    } catch { setError("Something went wrong.") }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    const res = await signIn("credentials", { identifier, password, redirect: false })
    if (res?.error) { setError("Incorrect password. Please try again."); setLoading(false) }
    else { router.push("/"); router.refresh() }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) { setError("Passwords do not match."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setError(""); setLoading(true)
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return }
      await signIn("credentials", { identifier, password, redirect: false })
      router.push("/"); router.refresh()
    } catch { setError("Something went wrong."); setLoading(false) }
  }

  const titleMap = { 1: "Welcome Back", 2: "Enter Password", 3: "Create Account" }
  const subMap   = { 1: "Sign in to your account or create a new one.", 2: `Signing in as ${identifier}`, 3: `Creating account for ${identifier}` }

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height) - 100px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
        
        {/* Header */}
        <div className="card-header text-center" style={{ padding: "2rem 2rem 1.5rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", color: "white", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontWeight: 800 }}>
            {step === 1 ? "🛍️" : identifier.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>{titleMap[step]}</h2>
          <p className="text-sm text-muted">{subMap[step]}</p>
          {step !== 1 && (
            <button onClick={() => setStep(1)} className="text-sm mt-2" style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Use a different account
            </button>
          )}
        </div>

        <div className="card-body" style={{ padding: "1.5rem 2rem 2rem" }}>
          {error && <div className="alert alert-error mb-5">{error}</div>}

          {step === 1 && (
            <form onSubmit={checkUser} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">Username or Email</label>
                <input type="text" className="input" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Enter your username or email" required autoFocus />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Checking...</> : "Continue →"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">Password</label>
                <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoFocus />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in...</> : "Sign In"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="alert alert-info">
                ✨ No account found. Fill in a password to create one.
              </div>
              <div className="form-group">
                <label className="label">Password <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>(min 6 characters)</span></label>
                <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a secure password" required autoFocus />
              </div>
              <div className="form-group">
                <label className="label">Confirm Password</label>
                <input type="password" className="input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating...</> : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
