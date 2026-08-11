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
    <nav className="border-b sticky top-0 z-50 transition-colors" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-8 items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-3">
            {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '4px' }} />}
            <span className="tracking-tight">{settings?.siteTitle || "BlueFalcon WM"}</span>
          </Link>
          
          {/* User specifically asked to remove the extra Shop/Home text next to the title */}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors hover:bg-muted flex items-center justify-center text-muted-foreground"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <Link href="/cart" className="relative p-2 rounded-full transition-colors hover:bg-muted flex items-center justify-center text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span 
                className="absolute bg-red-500 text-white font-bold flex items-center justify-center rounded-full" 
                style={{ 
                  top: '0px', 
                  right: '0px', 
                  fontSize: '10px', 
                  minWidth: '18px', 
                  height: '18px',
                  padding: '0 4px',
                  boxShadow: '0 0 0 2px var(--card)'
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
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border transition-colors hover:bg-muted font-medium text-sm ml-2"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                   {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                </div>
                <span>{user?.username || "Account"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-56 border rounded-xl z-50 flex flex-col py-2 animate-fade-in" 
                  style={{ 
                    borderColor: "var(--border)", 
                    backgroundColor: "var(--card)",
                    boxShadow: "var(--shadow-hover)"
                  }}
                >
                  <div className="px-4 py-2 border-b mb-1" style={{ borderColor: "var(--border)" }}>
                    <p className="font-bold text-sm truncate">{user?.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  
                  {user?.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setDropdownOpen(false)} className="px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile & Orders
                  </Link>
                  
                  <div className="border-t my-1" style={{ borderColor: "var(--border)" }}></div>
                  
                  <button 
                    onClick={() => { setDropdownOpen(false); signOut(); }} 
                    className="px-4 py-2.5 text-sm font-medium text-left transition-colors flex items-center gap-2"
                    style={{ color: "#ef4444" }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--muted)"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary text-sm ml-2">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
