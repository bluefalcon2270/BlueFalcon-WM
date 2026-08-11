import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ShopPage() {
  const categories = await prisma.category.findMany()
  const products = await prisma.product.findMany({
    include: { images: true, category: true }
  })

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
        
        <div className="w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input w-full md:w-64 rounded-full" 
          />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
        <Link href="/shop" className="px-4 py-2 bg-primary text-background rounded-full text-sm font-medium whitespace-nowrap">
          All Categories
        </Link>
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/shop/${cat.slug}`} 
            className="px-4 py-2 border rounded-full text-sm font-medium whitespace-nowrap hover:bg-muted transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map(p => (
          <div key={p.id} className="group cursor-pointer">
            <Link href={`/shop/${p.category?.slug || 'uncategorized'}/${p.slug}`}>
              <div className="relative w-full aspect-square overflow-hidden rounded-md mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                <img 
                  src={p.images?.[0]?.url || ''} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                {p.discountPrice && (
                  <div className="absolute top-2 right-2 bg-primary text-background text-xs font-bold px-2 py-1 rounded-sm">
                    SALE
                  </div>
                )}
              </div>
              <h3 className="font-medium text-base line-clamp-1 group-hover:underline">{p.name}</h3>
              <div className="flex gap-2 items-center mt-0.5">
                {p.discountPrice ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">${p.price.toFixed(2)}</span>
                    <span className="font-medium text-sm">${p.discountPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">${p.price.toFixed(2)}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
