import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return (session?.user as any)?.role === "ADMIN"
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { code, discountType, discountValue } = await req.json()
  const coupon = await prisma.coupon.create({ data: { code: code.toUpperCase(), discountType, discountValue } })
  return NextResponse.json(coupon)
}
