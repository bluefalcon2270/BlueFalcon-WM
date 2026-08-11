import Link from "next/link"

type Product = {
  id: string
  name: string
  price: number
  imageUrl: string
  category: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card flex-col animate-fade-in" style={{ display: "flex" }}>
      <div style={{ position: "relative", width: "100%", height: "250px" }}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="flex-col gap-2" style={{ padding: "1.5rem", flex: 1, display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="text-sm text-muted">{product.category}</p>
          <h3 className="text-lg font-bold" style={{ marginBottom: "0.5rem" }}>{product.name}</h3>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Link href={`/shop/${product.id}`} className="btn btn-primary text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
