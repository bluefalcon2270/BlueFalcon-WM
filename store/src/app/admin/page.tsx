import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminClient from "./AdminClient"

export const metadata = { title: "Admin Dashboard" }

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const user = session.user as any
  if (user.role !== "ADMIN") redirect("/")

  const [orders, products, categories, coupons, payments, settings] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, orderItems: { include: { product: true } } }
    }),
    prisma.product.findMany({ include: { images: true, category: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.coupon.findMany({ orderBy: { code: "asc" } }),
    prisma.paymentMethod.findMany(),
    prisma.siteSettings.findUnique({ where: { id: "1" } })
  ])

  return <AdminClient orders={orders} products={products} categories={categories} coupons={coupons} payments={payments} settings={settings} />
}
