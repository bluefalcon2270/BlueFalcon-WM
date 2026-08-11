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
  const { name, slug, description, price, discountPrice, stock, categoryId, imageUrl } = await req.json()

  const product = await prisma.product.update({
    where: { id },
    data: { name, slug, description, price, discountPrice: discountPrice || null, stock, categoryId: categoryId || null }
  })

  if (imageUrl) {
    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.productImage.create({ data: { url: imageUrl, isMain: true, productId: id } })
  }

  return NextResponse.json(product)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
