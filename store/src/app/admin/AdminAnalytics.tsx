"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminAnalytics({ orders }: { orders: any[] }) {
  // Process orders into revenue by date
  const dataMap: Record<string, number> = {}
  
  orders.forEach(order => {
    if (order.status !== "COMPLETED") return
    const date = new Date(order.createdAt).toLocaleDateString()
    dataMap[date] = (dataMap[date] || 0) + order.total
  })

  const data = Object.keys(dataMap).map(date => ({
    name: date,
    revenue: dataMap[date]
  }))

  if (data.length === 0) {
    return <p className="text-muted text-sm mt-4">No completed orders yet to show revenue.</p>
  }

  return (
    <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
          <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
