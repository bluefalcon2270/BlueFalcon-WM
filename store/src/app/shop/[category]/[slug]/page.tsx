import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AddToCartButton from "./AddToCartButton"
import ImageGallery from "./ImageGallery"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  return { title: product?.name || "Product" }
}

export default async function ProductPage({ params }: { params: { category: string; slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, category: true }
  })

  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { images: true, category: true },
    take: 4
  })

  const mainImage = product.images.find(i => i.isMain) || product.images[0]
  const displayPrice = product.discountPrice ?? product.price
  const inStock = product.stock > 0

  return (
    <div className="container page-padding">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary transition">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop/${product.category.slug}`} className="hover:text-primary transition">{product.category.name}</Link>
          </>
        )}
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{product.name}</span>
      </nav>

      <div className="grid md:grid-2 gap-12 mb-16">
        {/* Images */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Details */}
        <div>
          {product.category && (
            <Link href={`/shop/${product.category.slug}`} className="badge badge-blue mb-4 inline-block">
              {product.category.name}
            </Link>
          )}
          <h1 className="mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            {product.discountPrice ? (
              <>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--danger)" }}>
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span style={{ fontSize: "1.1rem", color: "var(--text-faint)", textDecoration: "line-through" }}>
                  ${product.price.toFixed(2)}
                </span>
                <span className="badge badge-red">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: inStock ? "var(--success)" : "var(--danger)"
            }} />
            <span className="text-sm font-semibold" style={{ color: inStock ? "var(--success)" : "var(--danger)" }}>
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted mb-8" style={{ lineHeight: 1.8 }}>{product.description}</p>

          {/* Add to Cart */}
          <AddToCartButton product={product} disabled={!inStock} />

          {/* Trust signals */}
          <div className="flex flex-col gap-3 mt-8 pt-8 border-t">
            {[
              { icon: "🚀", text: "Fast delivery — ships within 24 hours" },
              { icon: "🔒", text: "Secure checkout with multiple payment options" },
              { icon: "↩️", text: "30-day hassle-free returns" },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-3 text-sm text-muted">
                <span>{t.icon}</span> {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="mb-8">You Might Also Like</h2>
          <div className="grid grid-2 sm:grid-3 md:grid-4 gap-5">
            {related.map(p => {
              const img = p.images.find(i => i.isMain) || p.images[0]
              return (
                <Link key={p.id} href={`/shop/${p.category?.slug || "uncategorized"}/${p.slug}`} className="product-card">
                  <div className="product-card-img">
                    {img ? <img src={img.url} alt={p.name} /> : <div style={{ width: "100%", height: "100%", background: "var(--bg-subtle)" }} />}
                    {p.discountPrice && <span className="sale-badge">Sale</span>}
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-name line-clamp-2">{p.name}</h3>
                    <div className="product-card-price">
                      {p.discountPrice ? (
                        <><span className="price-original">${p.price.toFixed(2)}</span><span className="price-current price-sale">${p.discountPrice.toFixed(2)}</span></>
                      ) : (
                        <span className="price-current">${p.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
