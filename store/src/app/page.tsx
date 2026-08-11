import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({ take: 3 })

  return (
    <div>
      <section style={{ backgroundColor: "var(--primary)", color: "white", padding: "6rem 0", textAlign: "center" }}>
        <div className="container animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Welcome to Premium Store</h1>
          <p className="text-lg mb-8" style={{ maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Discover our exclusive collection of high-quality clothing. 
            Elevate your style with our premium, timeless designs.
          </p>
          <Link href="/shop" className="btn" style={{ backgroundColor: "white", color: "var(--primary)" }}>
            Shop the Collection
          </Link>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/shop" className="text-primary font-medium">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
