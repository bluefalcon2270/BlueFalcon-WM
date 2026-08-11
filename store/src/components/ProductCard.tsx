import Link from "next/link"

export default function ProductCard({ product }: { product: any }) {
  const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0]
  const imageUrl = mainImage?.url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
  const productUrl = product.category ? `/shop/${product.category.slug}/${product.slug}` : `/shop/all/${product.slug}`

  return (
    <Link href={productUrl} className="card overflow-hidden group hover:-translate-y-1 transition-transform block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPrice && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
          {product.category?.name || "Uncategorized"}
        </div>
        <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-lg">${product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-muted line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
