import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return (session?.user as any)?.role === "ADMIN"
}

export async function PUT(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { siteTitle, logoUrl, homepageLayout, footerLayout } = await req.json()
  const settings = await prisma.siteSettings.upsert({
    where: { id: "1" },
    update: { siteTitle, logoUrl, homepageLayout, footerLayout },
    create: { id: "1", siteTitle, logoUrl, homepageLayout, footerLayout }
  })
  return NextResponse.json(settings)
}
