import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Must be logged in to checkout" }, { status: 401 })
    }

    const { items, paymentMethodId, receiptId, customerNote, couponCode } = await req.json()
    const userId = (session.user as any).id

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const paymentMethod = paymentMethodId ? await prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } }) : null
    if (paymentMethod?.requiresReceipt && !receiptId) {
      return NextResponse.json({ error: "Tracking/Receipt ID is required for this payment method." }, { status: 400 })
    }

    let subtotal = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } })
      if (!product) continue
      
      const priceToUse = product.discountPrice || product.price
      subtotal += priceToUse * item.quantity
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: priceToUse
      })
    }

    let total = subtotal
    let discountApplied = 0

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountApplied = subtotal * (coupon.discountValue / 100)
        } else if (coupon.discountType === 'FIXED') {
          discountApplied = coupon.discountValue
        }
        total = Math.max(0, subtotal - discountApplied)
      }
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        discountApplied,
        status: "PENDING",
        paymentMethod: paymentMethod?.name || null,
        receiptId: receiptId || null,
        customerNote: customerNote || null,
        orderItems: { create: orderItemsData }
      }
    })

    // Deduct stock
    for (const item of orderItemsData) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
