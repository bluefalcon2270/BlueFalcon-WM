import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const metadata = { title: "Shop" }

export default async function ShopPage({ searchParams }: { searchParams: { q?: string; cat?: string; sort?: string } }) {
  const q   = searchParams?.q   || ""
  const cat = searchParams?.cat || ""

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const products = await prisma.product.findMany({
    where: {
      ...(q   ? { name: { contains: q } } : {}),
      ...(cat ? { category: { slug: cat } } : {})
    },
    include: { images: true, category: true },
    orderBy: { name: "asc" }
  })

  return (
    <div className="container page-padding">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="mb-1">
            {cat ? (categories.find(c => c.slug === cat)?.name || "Products") : q ? `Search: "${q}"` : "All Products"}
          </h1>
          <p className="text-muted text-sm">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <form method="get" action="/shop" className="flex gap-2">
          {cat && <input type="hidden" name="cat" value={cat} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            className="input"
            style={{ width: 240, borderRadius: "var(--radius-full)" }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: "var(--radius-full)", paddingLeft: "1.25rem", paddingRight: "1.25rem" }}>
            Search
          </button>
        </form>
      </div>

      {/* ── Category Pills ── */}
      <div className="pill-tabs mb-8">
        <Link href="/shop" className={`pill-tab ${!cat && !q ? "active" : ""}`}>All</Link>
        {categories.map(c => (
          <Link key={c.id} href={`/shop?cat=${c.slug}${q ? `&q=${q}` : ""}`} className={`pill-tab ${cat === c.slug ? "active" : ""}`}>
            {c.name}
          </Link>
        ))}
      </div>

      {/* ── Grid ── */}
      {products.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <h3>No products found</h3>
          <p className="text-sm">{q ? `No results for "${q}"` : "This category has no products yet."}</p>
          <Link href="/shop" className="btn btn-primary btn-sm">View All Products</Link>
        </div>
      ) : (
        <div className="grid grid-2 sm:grid-3 md:grid-4 gap-5">
          {products.map(p => {
            const mainImage = p.images.find(i => i.isMain) || p.images[0]
            return (
              <Link key={p.id} href={`/shop/${p.category?.slug || "uncategorized"}/${p.slug}`} className="product-card">
                <div className="product-card-img">
                  {mainImage ? (
                    <img src={mainImage.url} alt={p.name} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
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
          })}
        </div>
      )}
    </div>
  )
}
