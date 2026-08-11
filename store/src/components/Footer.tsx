"use client"

export default function Footer({ settings }: { settings: any }) {
  const title = settings?.siteTitle || "BlueFalcon"

  let footerData: any = {}
  try { footerData = JSON.parse(settings?.footerLayout || "{}") } catch {}

  return (
    <footer style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
      <div className="container py-12">
        <div className="grid md:grid-3 gap-8 mb-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {settings?.logoUrl && <img src={settings.logoUrl} alt="" style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} />}
              <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em" }}>{title}</span>
            </div>
            <p className="text-sm text-muted" style={{ lineHeight: 1.7, maxWidth: "22rem" }}>
              {footerData.description || "Your trusted online store for premium products. Fast shipping, easy returns, and 24/7 support."}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h5 className="mb-4" style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Shop</h5>
            <div className="flex flex-col gap-3">
              {[
                { label: "All Products", href: "/shop" },
                { label: "New Arrivals", href: "/shop?sort=new" },
                { label: "Sale Items",   href: "/shop?sort=sale" },
              ].map(l => (
                <a key={l.href} href={l.href} className="text-sm nav-link">{l.label}</a>
              ))}
            </div>
          </div>

          {/* Account Links */}
          <div>
            <h5 className="mb-4" style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Account</h5>
            <div className="flex flex-col gap-3">
              {[
                { label: "Sign In",       href: "/login" },
                { label: "My Orders",     href: "/profile" },
                { label: "Account Settings", href: "/profile?tab=settings" },
              ].map(l => (
                <a key={l.href} href={l.href} className="text-sm nav-link">{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">© {new Date().getFullYear()} {title}. All rights reserved.</p>
          <p className="text-sm text-muted">Built with BlueFalcon WM</p>
        </div>
      </div>
    </footer>
  )
}
