"use client"

import { useCart } from "@/context/CartContext"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [selectedMethodId, setSelectedMethodId] = useState<string>("")
  const [receiptId, setReceiptId] = useState("")
  const [customerNote, setCustomerNote] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/payment-methods")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPaymentMethods(data)
          if (data.length > 0) setSelectedMethodId(data[0].id)
        }
      })
      .catch(() => {})
  }, [])

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId)

  const handleCheckout = async () => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (selectedMethod?.requiresReceipt && !receiptId.trim()) {
      setError("Please enter the Receipt/Tracking ID for your payment.")
      return
    }

    setCheckingOut(true)
    setError("")

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          paymentMethodId: selectedMethodId,
          receiptId,
          customerNote,
          couponCode
        })
      })

      const data = await res.json()
      if (res.ok) {
        clearCart()
        router.push("/profile")
      } else {
        setError(data.error || "Checkout failed")
        setCheckingOut(false)
      }
    } catch (err) {
      setError("Something went wrong.")
      setCheckingOut(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container py-24 text-center animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container py-16 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="card p-4 flex gap-4 items-center">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded bg-muted" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="font-medium text-primary">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  className="input py-1 px-2"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}

          <div className="card p-4 mt-4">
            <h4 className="font-bold mb-2">Order Note (Optional)</h4>
            <textarea 
              className="input w-full" 
              placeholder="Any special instructions for us?"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-4">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          
          <div className="flex justify-between mb-4">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
            <label className="text-sm font-bold text-muted block mb-1">Coupon Code</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="input text-sm flex-1" 
                placeholder="e.g. SUMMER20" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
            </div>
            <p className="text-xs text-muted mt-1">Discounts will be applied at checkout.</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold block mb-2">Payment Method</label>
            <select 
              className="input w-full mb-2"
              value={selectedMethodId}
              onChange={(e) => setSelectedMethodId(e.target.value)}
            >
              {paymentMethods.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            
            {selectedMethod && (
              <div className="p-3 bg-muted rounded border mt-2" style={{ borderColor: "var(--border)" }}>
                {selectedMethod.description && (
                  <p className="font-medium text-sm mb-1">{selectedMethod.description}</p>
                )}
                {selectedMethod.instructions && (
                  <p className="text-xs text-muted mb-3">{selectedMethod.instructions}</p>
                )}
                
                {selectedMethod.requiresReceipt && (
                  <div>
                    <label className="text-xs font-bold block mb-1">Receipt / Tracking ID <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      className="input text-sm w-full py-1" 
                      placeholder="Enter ID here..."
                      value={receiptId}
                      onChange={(e) => setReceiptId(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mb-8 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-lg">Estimated Total</span>
            <span className="font-bold text-2xl">${subtotal.toFixed(2)}</span>
          </div>

          {error && <div className="text-red-500 text-sm text-center mb-4 font-medium">{error}</div>}

          <button 
            className="btn btn-primary w-full py-3" 
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processing Order...
              </span>
            ) : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  )
}
