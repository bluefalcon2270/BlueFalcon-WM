"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <header style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--card)", position: "sticky", top: 0, zIndex: 50 }}>
      <div className="container flex justify-between items-center py-4">
        <Link href="/">
          <h1 className="text-xl font-bold">Premium Store</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/shop" className="font-medium">Shop</Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-bold" style={{ color: "var(--primary)" }}>Admin</Link>
              )}
              <span className="text-sm text-muted hidden md:inline">{user?.email}</span>
              <button onClick={() => signOut()} className="btn btn-outline text-sm">Sign Out</button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary text-sm">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
