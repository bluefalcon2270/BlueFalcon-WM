import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect("/login")
  }

  const user = session.user as any

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      orders: {
        include: {
          orderItems: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!dbUser) return <div>User not found</div>

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold border-b pb-2" style={{ borderColor: "var(--border)" }}>Profile Details</h2>
            
            <div>
              <p className="text-sm font-bold text-muted">Username</p>
              <p>{dbUser.username || "Not set"}</p>
            </div>
            
            <div>
              <p className="text-sm font-bold text-muted">Email</p>
              <p>{dbUser.email || "Not set"}</p>
              {dbUser.email && (
                <span className={`text-xs font-bold px-2 py-1 rounded mt-1 inline-block ${dbUser.emailVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`} style={{ backgroundColor: dbUser.emailVerified ? "#dcfce7" : "#fef08a", color: dbUser.emailVerified ? "#166534" : "#854d0e" }}>
                  {dbUser.emailVerified ? "Verified" : "Unverified"}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-muted">Account Type</p>
              <p>{dbUser.role}</p>
            </div>

            {!dbUser.emailVerified && dbUser.email && (
              <button className="btn btn-outline w-full mt-4">
                Send Verification Email
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          <div className="flex flex-col gap-4">
            {dbUser.orders.length === 0 ? (
              <div className="card p-8 text-center text-muted">
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              dbUser.orders.map(order => (
                <div key={order.id} className="card p-4">
                  <div className="flex justify-between mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="font-bold text-sm text-muted">Order ID: {order.id}</p>
                      <p className="text-sm">{order.createdAt.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                      <span className="text-xs font-bold text-primary">{order.status}</span>
                    </div>
                  </div>
                  <div>
                    {order.orderItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-1 items-center">
                        <div className="flex items-center gap-2">
                          <img src={item.product.imageUrl} alt={item.product.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                          <span>{item.quantity}x {item.product.name}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
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
