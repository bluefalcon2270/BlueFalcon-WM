import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AddToCartButton from "./AddToCartButton"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-16 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div style={{ position: "relative", width: "100%", height: "500px", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <p className="text-muted">{product.category}</p>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
          <p className="text-lg mt-4" style={{ color: "var(--muted-foreground)" }}>{product.description}</p>
          
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
