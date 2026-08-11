import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { username, email, currentPassword, newPassword } = await req.json()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  // Validate password change
  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Current password is required" }, { status: 400 })
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    if (newPassword.length < 6) return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
  }

  // Check for username/email conflicts
  if (username && username !== user.username) {
    const exists = await prisma.user.findUnique({ where: { username } })
    if (exists) return NextResponse.json({ error: "Username already taken" }, { status: 400 })
  }
  if (email && email !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(username ? { username } : {}),
      ...(email    ? { email }    : {}),
      ...(newPassword ? { password: await bcrypt.hash(newPassword, 12) } : {})
    }
  })

  return NextResponse.json({ success: true, username: updated.username, email: updated.email })
}
