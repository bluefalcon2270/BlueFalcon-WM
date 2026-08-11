import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getFeaturedProducts(ids: string[]) {
  if (!ids.length) return []
  return prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: true, category: true },
    take: 8
  })
}

async function getCategories() {
  return prisma.category.findMany({ take: 6 })
}

export default async function HomePage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })
  const categories = await getCategories()

  let layout: any[] = []
  try { layout = JSON.parse(settings?.homepageLayout || "[]") } catch {}

  // Pre-fetch all products needed
  const allIds = layout.filter(s => s.type === "featured").flatMap(s => s.productIds || [])
  const allProducts = await getFeaturedProducts(allIds)
  const productMap = new Map(allProducts.map(p => [p.id, p]))

  // Default hero if no layout in DB
  if (!layout.length) {
    layout = [
      { type: "hero", title: "Premium Products,\nDelivered Fast.", text: "Discover our curated collection of high-quality products at unbeatable prices.", buttonText: "Browse Shop", buttonLink: "/shop" }
    ]
  }

  return (
    <div>
      {layout.map((section: any, i: number) => {
        // ── Hero ──────────────────────────────────────────────────────────
        if (section.type === "hero") {
          return (
            <section key={i} style={{
              padding: "5rem 0 4rem",
              background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-elevated) 100%)",
              borderBottom: "1px solid var(--border)"
            }}>
              <div className="container text-center">
                <div style={{
                  display: "inline-block",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  padding: "0.3rem 1rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1.5rem"
                }}>
                  ✨ New Arrivals Available
                </div>
                <h1 style={{ maxWidth: "700px", margin: "0 auto 1.25rem", whiteSpace: "pre-line" }}>
                  {section.title || "Premium Products, Delivered Fast."}
                </h1>
                <p className="text-muted" style={{ fontSize: "1.1rem", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
                  {section.text}
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Link href={section.buttonLink || "/shop"} className="btn btn-primary btn-xl">
                    {section.buttonText || "Browse Shop"}
                  </Link>
                  {categories[0] && (
                    <Link href={`/shop/${categories[0].slug}`} className="btn btn-secondary btn-xl">
                      {categories[0].name}
                    </Link>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-12 mt-16 flex-wrap">
                  {[
                    { value: "1,200+", label: "Happy Customers" },
                    { value: "300+",   label: "Products" },
                    { value: "24/7",   label: "Support" },
                    { value: "Free",   label: "Returns" },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{stat.value}</div>
                      <div className="text-muted text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        // ── Featured Products ─────────────────────────────────────────────
        if (section.type === "featured") {
          const products = (section.productIds || []).map((id: string) => productMap.get(id)).filter(Boolean)

          return (
            <section key={i} className="container py-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-sm text-muted font-semibold uppercase" style={{ letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Handpicked</p>
                  <h2>{section.title || "Featured Products"}</h2>
                </div>
                <Link href={section.buttonLink || "/shop"} className="btn btn-secondary btn-sm">
                  {section.buttonText || "View All"} →
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="empty-state" style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-lg)" }}>
                  <p>No featured products yet. Add some in the Admin Dashboard!</p>
                  <Link href="/admin" className="btn btn-primary btn-sm">Go to Admin</Link>
                </div>
              ) : (
                <div className="grid grid-2 sm:grid-3 md:grid-4 gap-5">
                  {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </section>
          )
        }

        return null
      })}

      {/* ── Category Strip ──────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="container py-12">
            <h2 className="mb-8">Shop by Category</h2>
            <div className="grid grid-2 sm:grid-3 md:grid-4 gap-4">
              {categories.map(cat => (
                <Link key={cat.id} href={`/shop/${cat.slug}`} className="card card-hoverable" style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem 1rem",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "1px solid var(--border)"
                }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust Badges ─────────────────────────────────────────────────── */}
      <section className="container py-16">
        <div className="grid grid-2 md:grid-4 gap-6">
          {[
            { icon: "🚀", title: "Fast Shipping",     desc: "Orders dispatched within 24h" },
            { icon: "🔒", title: "Secure Payment",    desc: "Multiple verified methods" },
            { icon: "↩️", title: "Easy Returns",       desc: "30-day hassle-free returns" },
            { icon: "💬", title: "24/7 Support",       desc: "Always here to help" },
          ].map(b => (
            <div key={b.title} className="card card-body text-center" style={{ border: "none", background: "var(--bg-elevated)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{b.icon}</div>
              <h4 className="mb-2">{b.title}</h4>
              <p className="text-sm text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product: p }: { product: any }) {
  const mainImage = p.images?.find((i: any) => i.isMain) || p.images?.[0]
  const cat = p.category?.slug || "uncategorized"

  return (
    <Link href={`/shop/${cat}/${p.slug}`} className="product-card">
      <div className="product-card-img">
        {mainImage ? (
          <img src={mainImage.url} alt={p.name} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          </div>
        )}
        {p.discountPrice && <span className="sale-badge">Sale</span>}
      </div>
      <div className="product-card-body">
        {p.category && <p className="product-card-cat">{p.category.name}</p>}
        <h3 className="product-card-name line-clamp-2">{p.name}</h3>
        <div className="product-card-price">
          {p.discountPrice ? (
            <>
              <span className="price-original">${p.price.toFixed(2)}</span>
              <span className="price-current price-sale">${p.discountPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-current">${p.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
