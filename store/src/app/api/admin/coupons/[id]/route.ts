import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return (session?.user as any)?.role === "ADMIN"
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const data = await req.json()
  const coupon = await prisma.coupon.update({ where: { id }, data })
  return NextResponse.json(coupon)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  await prisma.coupon.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
