import { prisma } from "@/lib/prisma"
import AdminAnalytics from "../AdminAnalytics"
import { revalidatePath } from "next/cache"

export default async function AdminOrdersTab() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  async function fulfillOrder(formData: FormData) {
    "use server"
    await prisma.order.update({
      where: { id: formData.get("orderId") as string },
      data: {
        status: formData.get("status") as string,
        fulfillmentNote: formData.get("fulfillmentNote") as string || null
      }
    })
    revalidatePath("/admin")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Revenue Analytics</h2>
        <AdminAnalytics orders={orders} />
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="card p-8 text-center text-muted">
            <p>No orders yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card p-4">
              <div className="flex justify-between mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="font-bold">Order ID: {order.id}</p>
                  <p className="text-sm text-muted">{order.user?.email || order.user?.username || "Guest"} - {order.createdAt.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                  <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>{order.status}</span>
                </div>
              </div>
              <div className="mb-4">
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t flex flex-col md:flex-row gap-8" style={{ borderColor: "var(--border)" }}>
                 <div className="flex-1">
                   <h4 className="font-bold text-sm mb-2">Customer Details</h4>
                   <p className="text-sm text-muted mb-1">Payment Method: <span className="font-medium text-foreground">{order.paymentMethod || "None"}</span></p>
                   {order.receiptId && <p className="text-sm text-muted mb-1">Receipt ID: <span className="font-bold text-primary">{order.receiptId}</span></p>}
                   {order.customerNote && <p className="text-sm italic mt-2 p-2 bg-muted rounded">"{order.customerNote}"</p>}
                 </div>
                 
                 <div className="flex-1">
                   <h4 className="font-bold text-sm mb-2">Fulfill Order (Digital Delivery)</h4>
                   <form action={fulfillOrder} className="flex flex-col gap-2">
                     <input type="hidden" name="orderId" value={order.id} />
                     <select name="status" defaultValue={order.status} className="input text-sm py-1">
                       <option value="PENDING">PENDING</option>
                       <option value="PROCESSING">PROCESSING</option>
                       <option value="COMPLETED">COMPLETED</option>
                       <option value="CANCELLED">CANCELLED</option>
                     </select>
                     <textarea 
                       name="fulfillmentNote" 
                       defaultValue={order.fulfillmentNote || ""}
                       placeholder="Attach digital license keys or secret links here..." 
                       className="input text-sm" 
                       rows={2} 
                     />
                     <button type="submit" className="btn btn-outline text-xs py-1 mt-1">Save Updates</button>
                   </form>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
