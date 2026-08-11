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
  const { name, description, instructions, requiresReceipt } = await req.json()
  const p = await prisma.paymentMethod.create({ data: { name, description, instructions, requiresReceipt } })
  return NextResponse.json(p)
}
