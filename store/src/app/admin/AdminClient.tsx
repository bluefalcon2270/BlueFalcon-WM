"use client"
import { useState } from "react"
import OrdersTab from "./tabs/OrdersTab"
import ProductsTab from "./tabs/ProductsTab"
import CouponsTab from "./tabs/CouponsTab"
import PaymentsTab from "./tabs/PaymentsTab"
import SettingsTab from "./tabs/SettingsTab"

const TABS = [
  { key: "orders",   label: "Orders",          icon: "📦" },
  { key: "products", label: "Products",         icon: "🛍️" },
  { key: "coupons",  label: "Coupons",          icon: "🏷️" },
  { key: "payments", label: "Payment Methods",  icon: "💳" },
  { key: "settings", label: "Site Settings",    icon: "⚙️" },
]

export default function AdminClient({ orders, products, categories, coupons, payments, settings }: any) {
  const [tab, setTab] = useState("orders")

  const stats = [
    { label: "Total Orders",  value: orders.length },
    { label: "Total Revenue", value: `$${orders.reduce((s: number, o: any) => s + o.total, 0).toFixed(2)}` },
    { label: "Products",      value: products.length },
    { label: "Pending Orders",value: orders.filter((o: any) => o.status === "PENDING").length },
  ]

  return (
    <div className="container page-padding">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Manage your store</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-2 md:grid-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card card-body">
            <p className="text-sm text-muted mb-1">{s.label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs mb-6">
        {TABS.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            <span className="hidden md:inline">{t.icon} </span>{t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {tab === "orders"   && <OrdersTab   orders={orders} />}
        {tab === "products" && <ProductsTab products={products} categories={categories} />}
        {tab === "coupons"  && <CouponsTab  coupons={coupons} />}
        {tab === "payments" && <PaymentsTab payments={payments} />}
        {tab === "settings" && <SettingsTab settings={settings} />}
      </div>
    </div>
  )
}
