import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json()
    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const isEmail = identifier.includes("@")
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email: isEmail ? identifier : null,
        username: !isEmail ? identifier : null,
        password: hashedPassword
      }
    })

    return NextResponse.json({ success: true, user: { id: user.id } })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Account already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
