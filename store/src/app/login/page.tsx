"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const checkUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      })
      const data = await res.json()
      
      if (data.exists) {
        setStep(2) // Login flow
      } else {
        setStep(3) // Signup flow
      }
    } catch (err) {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Incorrect password")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      })
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }

      // Automatically sign them in
      await signIn("credentials", {
        identifier,
        password,
        redirect: false
      })
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center py-16" style={{ minHeight: "60vh" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
        <h1 className="text-2xl font-bold mb-2 text-center">
          {step === 1 && "Sign In or Sign Up"}
          {step === 2 && "Welcome Back"}
          {step === 3 && "Create an Account"}
        </h1>
        {step !== 1 && (
          <p className="text-center text-sm text-muted mb-6">
            {identifier} <button onClick={() => setStep(1)} className="text-primary ml-1" style={{ textDecoration: "underline" }}>(Change)</button>
          </p>
        )}
        
        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center", fontSize: "0.875rem" }}>{error}</div>}
        
        {step === 1 && (
          <form onSubmit={checkUser} className="flex flex-col gap-4 mt-6">
            <div>
              <label className="text-sm font-medium">Username or Email</label>
              <input 
                type="text" 
                className="input mt-1" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                className="input mt-1" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Create Password</label>
              <input 
                type="password" 
                className="input mt-1" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <input 
                type="password" 
                className="input mt-1" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
