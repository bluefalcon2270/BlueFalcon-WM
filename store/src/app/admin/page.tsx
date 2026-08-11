import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import AdminSettingsTab from "./tabs/AdminSettingsTab"
import AdminProductsTab from "./tabs/AdminProductsTab"
import AdminOrdersTab from "./tabs/AdminOrdersTab"

export default async function AdminDashboard({ searchParams }: { searchParams: { tab?: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const activeTab = resolvedParams.tab || "orders"

  return (
    <div className="container py-8 animate-fade-in flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 flex flex-col gap-2">
        <h1 className="text-2xl font-bold mb-4 px-4">Admin Panel</h1>
        <Link href="/admin?tab=orders" className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-muted'}`}>Orders & Fulfillment</Link>
        <Link href="/admin?tab=products" className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'hover:bg-muted'}`}>Products & Categories</Link>
        <Link href="/admin?tab=settings" className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-muted'}`}>Site Builder & Settings</Link>
      </div>

      <div className="flex-1">
        {activeTab === 'orders' && <AdminOrdersTab />}
        {activeTab === 'products' && <AdminProductsTab />}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>
    </div>
  )
}
