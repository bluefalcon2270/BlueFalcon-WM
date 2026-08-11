"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import { useTheme } from "./ThemeProvider"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

// ─── Icons ───────────────────────────────────────────────────────────────────
const SunIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
const MoonIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
const CartIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const ChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>

export default function Navbar({ settings }: { settings: any }) {
  const { data: session } = useSession()
  const { cart } = useCart()
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const user = session?.user as any
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const isHome = pathname === "/"

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--bg-elevated)",
      borderBottom: "1px solid var(--border)",
      height: "var(--nav-height)"
    }}>
      <div className="container flex items-center justify-between h-full">

        {/* ── Left: Brand ── */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight" style={{ letterSpacing: "-0.04em" }}>
            {settings?.logoUrl && (
              <img src={settings.logoUrl} alt="" style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6 }} />
            )}
            <span>{settings?.siteTitle || "BlueFalcon"}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {!isHome && <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Home</Link>}
            <Link href="/shop" className={`nav-link ${pathname.startsWith("/shop") ? "active" : ""}`}>Shop</Link>
          </nav>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-1">

          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`
                    setSearchOpen(false)
                  }
                  if (e.key === "Escape") { setSearchOpen(false); setSearchQuery("") }
                }}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--primary)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.875rem",
                  outline: "none",
                  width: "220px"
                }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery("") }} className="btn-ghost p-2 rounded-full" style={{ background: "transparent", border: "none" }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="btn-ghost" style={{ background: "transparent", border: "none", padding: "0.55rem", borderRadius: "var(--radius-full)", color: "var(--text-muted)", display: "flex" }}>
              <SearchIcon />
            </button>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} style={{ background: "transparent", border: "none", padding: "0.55rem", borderRadius: "var(--radius-full)", color: "var(--text-muted)", cursor: "pointer", display: "flex", transition: "color var(--transition)" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--text-muted)")}
            aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Cart */}
          <Link href="/cart" style={{ position: "relative", padding: "0.55rem", borderRadius: "var(--radius-full)", color: "var(--text-muted)", display: "flex", transition: "color var(--transition)" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--text-muted)")}>
            <CartIcon />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2,
                background: "var(--primary)", color: "white",
                fontSize: "10px", fontWeight: 800,
                minWidth: 17, height: 17,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
                boxShadow: "0 0 0 2px var(--bg-elevated)"
              }}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          {session ? (
            <div className="relative" ref={dropdownRef} style={{ marginLeft: "0.25rem" }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.35rem 0.75rem 0.35rem 0.35rem",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--border)",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "border-color var(--transition), background var(--transition)"
                }}
                onMouseOver={e => { e.currentTarget.style.background = "var(--bg-subtle)"; e.currentTarget.style.borderColor = "var(--text-muted)" }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)" }}
              >
                <div style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.8rem", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.username || "Account"}
                </span>
                <span style={{ color: "var(--text-muted)" }}><ChevronDown /></span>
              </button>

              {dropdownOpen && (
                <div className="animate-fade-in-scale" style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  width: 280,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-xl)",
                  overflow: "hidden",
                  zIndex: 200
                }}>
                  {/* Profile header */}
                  <div style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.9rem", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                    <div style={{
                      width: 44, height: 44, flexShrink: 0,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "white",
                      fontSize: "1.1rem", fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.username || "User"}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
                      <Link href="/profile" onClick={() => setDropdownOpen(false)} style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600 }}>
                        Manage Account →
                      </Link>
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    ...(user?.role === "ADMIN" ? [{ label: "Admin Dashboard", href: "/admin", icon: "🛡️" }] : []),
                    { label: "My Orders", href: "/profile", icon: "📦" },
                    { label: "Account Settings", href: "/profile?tab=settings", icon: "⚙️" },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: "0.85rem",
                      padding: "0.8rem 1.25rem",
                      fontSize: "0.9rem", fontWeight: 500,
                      color: "var(--text)",
                      transition: "background var(--transition)"
                    }}
                      onMouseOver={e => e.currentTarget.style.background = "var(--bg-subtle)"}
                      onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />

                  <button onClick={() => { setDropdownOpen(false); signOut() }} style={{
                    width: "100%", textAlign: "left",
                    display: "flex", alignItems: "center", gap: "0.85rem",
                    padding: "0.8rem 1.25rem",
                    fontSize: "0.9rem", fontWeight: 500,
                    color: "var(--danger)",
                    background: "transparent", border: "none",
                    cursor: "pointer",
                    transition: "background var(--transition)"
                  }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--bg-subtle)"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    <span>🚪</span> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm" style={{ marginLeft: "0.25rem" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
