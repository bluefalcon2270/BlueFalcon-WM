import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
        }
      }
    }
  })

  return (
    <div className="container py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Profile Sidebar */}
        <div className="card p-6 h-fit md:col-span-1">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-primary">
            {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mb-1">{user?.username || "No Username"}</h2>
          <p className="text-sm text-muted mb-4">{user?.email}</p>
          
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium">{user?.emailVerified ? 'Verified Account' : 'Unverified Email'}</span>
            </div>
            {user?.role === 'ADMIN' && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm font-medium text-primary">Admin Access</span>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Order History</h2>
          
          <div className="flex flex-col gap-6">
            {!user?.orders || user.orders.length === 0 ? (
              <div className="card p-12 text-center text-muted">
                <p>You haven't placed any orders yet.</p>
                <Link href="/shop" className="btn btn-primary mt-4 inline-block">Start Shopping</Link>
              </div>
            ) : (
              user.orders.map(order => (
                <div key={order.id} className="card p-6">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between mb-4 pb-4 border-b gap-4" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="font-bold text-lg mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-muted">Placed on {order.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-bold text-xl">${order.total.toFixed(2)}</p>
                      <div className="inline-block mt-1 px-3 py-1 bg-muted rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {/* Digital Fulfillment Note */}
                  {order.fulfillmentNote && (
                    <div className="mb-4 p-4 rounded border-l-4" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--primary)' }}>
                      <h4 className="font-bold text-sm mb-1 text-primary">Secure Delivery Note (Digital Goods)</h4>
                      <p className="text-sm whitespace-pre-wrap">{order.fulfillmentNote}</p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="flex flex-col gap-4">
                    {order.orderItems.map(item => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img 
                          src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded bg-muted"
                        />
                        <div className="flex-1">
                          <p className="font-bold">{item.product.name}</p>
                          <p className="text-sm text-muted">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="font-bold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
