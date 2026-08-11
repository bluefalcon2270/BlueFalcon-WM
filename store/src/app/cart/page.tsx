"use client"

import { useCart } from "@/components/CartProvider"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, total, clearCart } = useCart()
  const { data: session } = useSession()
  const [checkingOut, setCheckingOut] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!session) {
      alert("Please login to checkout.")
      router.push("/login")
      return
    }

    setCheckingOut(true)
    
    // Simulate a checkout API call
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total })
      })

      if (res.ok) {
        alert("Order placed successfully!")
        clearCart()
        router.push("/")
      } else {
        alert("Failed to place order.")
      }
    } catch (e) {
      alert("Error during checkout.")
    } finally {
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted">Looks like you haven't added anything yet.</p>
      </div>
    )
  }

  return (
    <div className="container py-16 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className="card flex items-center justify-between p-4" style={{ display: "flex", padding: "1rem" }}>
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "var(--radius)" }} />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-muted text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.id)} className="btn btn-outline text-sm" style={{ color: "red", borderColor: "red" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="card" style={{ padding: "1.5rem", height: "fit-content" }}>
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-8">
            <span className="font-bold">Total</span>
            <span className="font-bold text-xl">${total.toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: "100%" }}
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  )
}
