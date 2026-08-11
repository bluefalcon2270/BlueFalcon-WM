import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileClient from "./ProfileClient"

export const metadata = { title: "My Account" }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          orderItems: {
            include: { product: { include: { images: true } } }
          }
        }
      }
    }
  })

  if (!user) redirect("/login")

  return <ProfileClient user={user} />
}
