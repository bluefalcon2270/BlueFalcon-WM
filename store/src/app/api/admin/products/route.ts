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
  const { name, slug, description, price, discountPrice, stock, categoryId, imageUrl } = await req.json()

  const product = await prisma.product.create({
    data: {
      name, slug, description, price, discountPrice: discountPrice || null,
      stock: stock || 10,
      categoryId: categoryId || null,
      images: imageUrl ? { create: { url: imageUrl, isMain: true } } : undefined
    }
  })
  return NextResponse.json(product)
}
