import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AddToCartButton from "./AddToCartButton"

export default async function ProductPage({ params }: { params: { category: string, slug: string } }) {
  const resolvedParams = await params
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { images: true, category: true }
  })

  if (!product) {
    notFound()
  }

  // Handle case where category doesn't match, unless it's 'all'
  if (resolvedParams.category !== 'all' && product.category?.slug !== resolvedParams.category) {
    notFound()
  }

  const mainImage = product.images.find(img => img.isMain) || product.images[0]
  const otherImages = product.images.filter(img => img.id !== mainImage?.id)

  return (
    <div className="container py-16 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="card overflow-hidden bg-muted aspect-square flex items-center justify-center">
             {mainImage ? (
               <img src={mainImage.url} alt={product.name} className="object-cover w-full h-full" />
             ) : (
               <div className="text-muted">No Image</div>
             )}
          </div>
          {otherImages.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
               {product.images.map(img => (
                 <div key={img.id} className={`w-20 h-20 rounded border-2 overflow-hidden flex-shrink-0 cursor-pointer ${img.isMain ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img.url} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-sm font-bold text-muted uppercase tracking-wider mb-2">
              {product.category?.name || "Uncategorized"}
            </div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-primary">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-xl text-muted line-through">${product.price.toFixed(2)}</span>
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                </>
              ) : (
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <p className="text-lg leading-relaxed text-muted whitespace-pre-wrap">{product.description}</p>

          <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
             <p className="text-sm font-medium mb-4">Availability: <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span></p>
             <AddToCartButton product={{ ...product, price: product.discountPrice || product.price }} />
          </div>
        </div>

      </div>
    </div>
  )
}
