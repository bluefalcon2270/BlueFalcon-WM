"use client"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

export default function AddToCartButton({ product, disabled }: { product: any; disabled?: boolean }) {
  const { addToCart, cart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const inCart = cart.find(i => i.id === product.id)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity stepper */}
      <div className="flex items-center gap-4">
        <label className="label" style={{ marginBottom: 0 }}>Quantity</label>
        <div className="qty-stepper">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={disabled}>−</button>
          <input type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} readOnly />
          <button onClick={() => setQty(q => q + 1)} disabled={disabled}>+</button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleAdd}
          disabled={disabled}
          className="btn btn-primary btn-lg flex-1"
          style={{ minWidth: 180 }}
        >
          {added ? "✓ Added to Cart!" : disabled ? "Out of Stock" : "Add to Cart"}
        </button>

        {inCart && (
          <a href="/cart" className="btn btn-secondary btn-lg">
            View Cart ({inCart.quantity})
          </a>
        )}
      </div>
    </div>
  )
}
