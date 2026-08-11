import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const products = await prisma.product.findMany()

  async function addProduct(formData: FormData) {
    "use server"
    
    await prisma.product.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        imageUrl: formData.get("imageUrl") as string || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        category: formData.get("category") as string,
        stock: parseInt(formData.get("stock") as string) || 10
      }
    })
    
    revalidatePath("/admin")
    revalidatePath("/shop")
    revalidatePath("/")
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <form action={addProduct} className="card p-4 flex flex-col gap-4">
            <input type="text" name="name" placeholder="Product Name" className="input" required />
            <input type="text" name="description" placeholder="Description" className="input" required />
            <div className="flex gap-4">
              <input type="number" name="price" placeholder="Price (e.g. 29.99)" step="0.01" className="input" required />
              <input type="text" name="category" placeholder="Category" className="input" required />
            </div>
            <input type="text" name="imageUrl" placeholder="Image URL (optional)" className="input" />
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Current Products ({products.length})</h2>
          <div className="card p-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span>{p.name}</span>
                <span className="font-bold">${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card p-4">
              <div className="flex justify-between mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="font-bold">Order ID: {order.id}</p>
                  <p className="text-sm text-muted">{order.user.email} - {order.createdAt.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                  <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>{order.status}</span>
                </div>
              </div>
              <div>
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
