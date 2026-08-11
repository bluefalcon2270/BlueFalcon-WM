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
  const [selectedMethodId, setSelectedMethodId] = useState("")
  const [receiptId, setReceiptId] = useState("")
  const [customerNote, setCustomerNote] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponStatus, setCouponStatus] = useState<{ valid: boolean; message: string; discount?: number } | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/payment-methods")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) { setPaymentMethods(d); setSelectedMethodId(d[0].id) } })
  }, [])

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = couponStatus?.discount || 0
  const total    = Math.max(0, subtotal - discount)
  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId)

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    const res = await fetch(`/api/coupons/validate?code=${couponCode}&subtotal=${subtotal}`)
    const data = await res.json()
    if (res.ok) {
      setCouponStatus({ valid: true, message: `Coupon applied! You save $${data.discount.toFixed(2)}`, discount: data.discount })
    } else {
      setCouponStatus({ valid: false, message: data.error || "Invalid coupon" })
    }
  }

  const handleCheckout = async () => {
    if (status === "unauthenticated") { router.push("/login"); return }
    if (selectedMethod?.requiresReceipt && !receiptId.trim()) {
      setError("Please enter the Receipt / Tracking ID for your payment."); return
    }
    setCheckingOut(true); setError("")

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, paymentMethodId: selectedMethodId, receiptId, customerNote, couponCode })
    })
    const data = await res.json()

    if (res.ok) { clearCart(); router.push(`/profile?order=${data.orderId}`) }
    else { setError(data.error || "Checkout failed"); setCheckingOut(false) }
  }

  if (cart.length === 0) {
    return (
      <div className="container page-padding">
        <div className="empty-state" style={{ minHeight: "60vh" }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <h2>Your cart is empty</h2>
          <p className="text-muted">Add some products and come back here to checkout.</p>
          <Link href="/shop" className="btn btn-primary btn-lg mt-4">Browse Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page-padding">
      <h1 className="mb-8">Shopping Cart</h1>

      <div className="grid md:grid-2 gap-8" style={{ gridTemplateColumns: "1fr 380px" }}>

        {/* ── Cart Items ── */}
        <div className="flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="card card-body flex items-center gap-4" style={{ borderRadius: "var(--radius-lg)" }}>
              <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-subtle)" }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="line-clamp-1 mb-1">{item.name}</h4>
                <p className="text-sm text-muted">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="qty-stepper">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <input type="number" value={item.quantity} readOnly />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <span style={{ fontWeight: 700, minWidth: "4rem", textAlign: "right" }}>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} className="btn btn-ghost" style={{ color: "var(--danger)", padding: "0.4rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Order Note */}
          <div className="card card-body" style={{ borderRadius: "var(--radius-lg)" }}>
            <label className="label">Order Note (optional)</label>
            <textarea className="input" placeholder="Special instructions, delivery notes, etc." value={customerNote} onChange={e => setCustomerNote(e.target.value)} rows={3} />
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="flex flex-col gap-4">
          <div className="card" style={{ borderRadius: "var(--radius-lg)", position: "sticky", top: "calc(var(--nav-height) + 1rem)" }}>
            <div className="card-header"><h3>Order Summary</h3></div>
            <div className="card-body flex flex-col gap-4">

              {/* Coupon */}
              <div>
                <label className="label">Coupon Code</label>
                <div className="flex gap-2">
                  <input type="text" className="input" placeholder="e.g. WELCOME20" value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponStatus(null) }} />
                  <button onClick={applyCoupon} className="btn btn-secondary" style={{ whiteSpace: "nowrap" }}>Apply</button>
                </div>
                {couponStatus && (
                  <p className="text-sm mt-2" style={{ color: couponStatus.valid ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                    {couponStatus.valid ? "✓ " : "✗ "}{couponStatus.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              {paymentMethods.length > 0 && (
                <div>
                  <label className="label">Payment Method</label>
                  <select className="select" value={selectedMethodId} onChange={e => setSelectedMethodId(e.target.value)}>
                    {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  {selectedMethod?.description && (
                    <div className="alert alert-info mt-3">
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{selectedMethod.description}</p>
                        {selectedMethod.instructions && <p className="text-sm" style={{ opacity: 0.85 }}>{selectedMethod.instructions}</p>}
                      </div>
                    </div>
                  )}
                  {selectedMethod?.requiresReceipt && (
                    <div className="mt-3">
                      <label className="label">Receipt / Tracking ID <span style={{ color: "var(--danger)" }}>*</span></label>
                      <input type="text" className="input" placeholder="Enter your payment reference..." value={receiptId} onChange={e => setReceiptId(e.target.value)} />
                    </div>
                  )}
                </div>
              )}

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 pt-3 border-t">
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm"><span style={{ color: "var(--success)" }}>Discount</span><span style={{ color: "var(--success)" }}>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t pt-3"><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontSize: "1.2rem", fontWeight: 800 }}>${total.toFixed(2)}</span></div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button onClick={handleCheckout} disabled={checkingOut} className="btn btn-primary btn-lg w-full">
                {checkingOut ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Processing...</> : "Place Order"}
              </button>

              <p className="text-xs text-muted text-center">🔒 Secure checkout. Your information is protected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
