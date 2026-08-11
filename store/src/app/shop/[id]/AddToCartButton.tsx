"use client"
import { useCart } from "@/components/CartProvider"

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart()

  return (
    <button 
      className="btn btn-primary" 
      style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
      onClick={() => {
        addItem({ ...product, quantity: 1 })
        alert("Added to cart!")
      }}
    >
      Add to Cart
    </button>
  )
}
