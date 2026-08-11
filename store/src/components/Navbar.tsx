"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "./ThemeProvider"

export default function Navbar({ settings }: { settings: any }) {
  const { data: session } = useSession()
  const { cart } = useCart()
  const user = session?.user as any
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

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
    <nav className="border-b sticky top-0 z-50 transition-colors" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", opacity: 0.98 }}>
      <div className="container flex h-16 items-center justify-between">
        
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold flex items-center gap-3">
            {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ height: '28px', width: '28px', objectFit: 'contain', borderRadius: '50%' }} />}
            <span className="tracking-tight">{settings?.siteTitle || "BlueFalcon"}</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle Dark Mode"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <Link href="/cart" className="relative flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span 
                className="absolute bg-primary text-background font-bold flex items-center justify-center rounded-full" 
                style={{ 
                  top: '-4px', 
                  right: '-6px', 
                  fontSize: '10px', 
                  minWidth: '16px', 
                  height: '16px',
                  padding: '0 4px',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center rounded-full transition-transform hover:scale-105"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <div className="w-8 h-8 bg-primary text-background rounded-full flex items-center justify-center text-sm font-bold">
                   {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              </button>
              
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-72 border rounded-md z-50 flex flex-col py-2 animate-fade-in" 
                  style={{ 
                    borderColor: "var(--border)", 
                    backgroundColor: "var(--card)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                  }}
                >
                  <div className="px-4 py-3 flex gap-4 items-center">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary text-background rounded-full flex items-center justify-center text-lg font-bold">
                      {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-base truncate">{user?.username}</p>
                      <p className="text-sm text-muted-foreground truncate mb-1">@{user?.username || 'user'}</p>
                      <Link href="/profile" onClick={() => setDropdownOpen(false)} className="text-sm font-medium hover:underline" style={{ color: "#3ea6ff" }}>
                        Manage your Account
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t my-2" style={{ borderColor: "var(--border)" }}></div>
                  
                  {user?.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-sm font-medium transition-colors flex items-center gap-4" onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--muted)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="px-5 py-3 text-sm font-medium transition-colors flex items-center gap-4" onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--muted)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    Profile & Orders
                  </Link>
                  
                  <div className="border-t my-2" style={{ borderColor: "var(--border)" }}></div>
                  
                  <button 
                    onClick={() => { setDropdownOpen(false); signOut(); }} 
                    className="px-5 py-3 text-sm font-medium text-left transition-colors flex items-center gap-4 w-full"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--muted)"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary text-sm rounded-full px-4 py-1.5">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
