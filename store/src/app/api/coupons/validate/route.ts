import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")?.toUpperCase()
  const subtotal = parseFloat(searchParams.get("subtotal") || "0")

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 })

  const coupon = await prisma.coupon.findUnique({ where: { code } })

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 })
  }

  const discount = coupon.discountType === "PERCENTAGE"
    ? subtotal * (coupon.discountValue / 100)
    : Math.min(coupon.discountValue, subtotal)

  return NextResponse.json({ valid: true, discount, code: coupon.code })
}
