"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="container flex items-center justify-center py-16" style={{ minHeight: "60vh" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              className="input mt-1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@store.com"
              required 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              className="input mt-1" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
