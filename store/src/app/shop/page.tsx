import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q || ""
  const category = resolvedParams.category || ""

  // Fetch unique categories for the filter buttons
  const allProducts = await prisma.product.findMany({ select: { category: true } })
  const categories = Array.from(new Set(allProducts.map(p => p.category)))

  // Fetch filtered products
  const products = await prisma.product.findMany({
    where: {
      name: { contains: q },
      ...(category ? { category } : {})
    }
  })

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">All Products</h1>
        
        <form method="GET" className="flex gap-2 w-full md:w-auto">
          {category && <input type="hidden" name="category" value={category} />}
          <input 
            type="text" 
            name="q" 
            defaultValue={q} 
            placeholder="Search products..." 
            className="input w-full md:w-64"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <a href={`/shop${q ? `?q=${q}` : ''}`} className={`btn ${!category ? 'btn-primary' : 'btn-outline'}`} style={{ whiteSpace: "nowrap" }}>
          All
        </a>
        {categories.map(c => (
          <a key={c} href={`/shop?category=${c}${q ? `&q=${q}` : ''}`} className={`btn ${category === c ? 'btn-primary' : 'btn-outline'}`} style={{ whiteSpace: "nowrap" }}>
            {c}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-muted card">
          <p>No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
