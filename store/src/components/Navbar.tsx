"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Navbar({ settings }: { settings: any }) {
  const { data: session } = useSession()
  const { cart } = useCart()
  const user = session?.user as any
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  return (
    <nav className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ height: '30px', objectFit: 'contain' }} />}
            {settings?.siteTitle || "Store"}
          </Link>
          
          <div className="hidden md:flex gap-4">
            {pathname !== "/" && (
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            )}
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 flex items-center justify-center hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" style={{ fontSize: '11px', transform: 'translate(25%, -25%)' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-outline text-sm flex items-center gap-2"
                style={{ padding: '0.5rem 1rem' }}
              >
                {user?.name || user?.email || "My Account"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 border rounded shadow-lg z-50 flex flex-col overflow-hidden animate-fade-in" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
                  {user?.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-sm border-b hover:bg-muted" style={{ borderColor: "var(--border)", transition: "background-color 0.2s" }}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="px-4 py-3 text-sm hover:bg-muted" style={{ transition: "background-color 0.2s" }}>
                    Profile & Orders
                  </Link>
                  <button 
                    onClick={() => { setDropdownOpen(false); signOut(); }} 
                    className="px-4 py-3 text-sm text-left border-t"
                    style={{ borderColor: "var(--border)", color: "#ef4444", transition: "background-color 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--muted)"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary text-sm">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
