import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function ShopPage() {
  const products = await prisma.product.findMany()

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
