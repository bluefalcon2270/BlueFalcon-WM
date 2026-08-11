import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AuthProvider from "@/components/AuthProvider"
import { CartProvider } from "@/context/CartContext"
import { prisma } from "@/lib/prisma"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })
  return {
    title: settings?.siteTitle || "Premium Store",
    description: "Your favorite online store",
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar settings={settings} />
            <main style={{ minHeight: "calc(100vh - 140px)" }}>
              {children}
            </main>
            <Footer settings={settings} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
