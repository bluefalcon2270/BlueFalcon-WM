"use client"
import { useCart } from "@/context/CartContext"

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart()

  return (
    <button 
      onClick={() => addToCart(product)}
      className="btn btn-primary text-lg px-8 py-3 w-full md:w-auto"
      disabled={product.stock <= 0}
    >
      Add to Cart
    </button>
  )
}
