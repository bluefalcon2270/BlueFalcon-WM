import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q || ""
  const categorySlug = resolvedParams.category || ""

  const categories = await prisma.category.findMany()

  const products = await prisma.product.findMany({
    where: {
      name: { contains: q },
      ...(categorySlug ? { category: { slug: categorySlug } } : {})
    },
    include: { category: true, images: true }
  })

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">All Products</h1>
        
        <form method="GET" className="flex gap-2 w-full md:w-auto">
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
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
        <a href={`/shop${q ? `?q=${q}` : ''}`} className={`btn ${!categorySlug ? 'btn-primary' : 'btn-outline'}`} style={{ whiteSpace: "nowrap" }}>
          All Categories
        </a>
        {categories.map(c => (
          <a key={c.id} href={`/shop?category=${c.slug}${q ? `&q=${q}` : ''}`} className={`btn ${categorySlug === c.slug ? 'btn-primary' : 'btn-outline'}`} style={{ whiteSpace: "nowrap" }}>
            {c.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-muted card">
          <p>No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
