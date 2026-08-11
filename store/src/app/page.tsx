import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })
  
  let layout = []
  try {
    layout = JSON.parse(settings?.homepageLayout || "[]")
  } catch (e) {}

  // Fetch all featured products at once
  const featuredIds = layout.filter((s: any) => s.type === 'featured').flatMap((s: any) => s.productIds || [])
  const products = await prisma.product.findMany({
    where: { id: { in: featuredIds } },
    include: { images: true, category: true }
  })

  const productMap = products.reduce((acc: any, p: any) => {
    acc[p.id] = p
    return acc
  }, {})

  if (layout.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to {settings?.siteTitle}</h1>
        <p className="text-muted">No homepage layout configured. Please setup sections in the Admin Dashboard.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in flex flex-col gap-16 pb-16">
      {layout.map((section: any, idx: number) => {
        if (section.type === 'hero') {
          return (
            <section key={idx} className="relative py-32 flex items-center justify-center text-center px-4" style={{ backgroundColor: 'var(--card)' }}>
              <div className="container max-w-3xl relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{section.title}</h1>
                <p className="text-xl md:text-2xl text-muted mb-10 max-w-2xl mx-auto">{section.text}</p>
                <div className="flex gap-4 justify-center">
                  <Link href={section.buttonLink || "/shop"} className="btn btn-primary text-lg px-8 py-3">
                    {section.buttonText || "Shop Now"}
                  </Link>
                </div>
              </div>
            </section>
          )
        }
        
        if (section.type === 'featured') {
          const sectionProducts = (section.productIds || []).map((id: string) => productMap[id]).filter(Boolean)
          
          return (
            <section key={idx} className="container">
              <div className="flex justify-between items-end mb-8 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-3xl font-bold">{section.title}</h2>
                <Link href={section.buttonLink || "/shop"} className="text-primary font-bold hover:underline">
                  {section.buttonText || "View All"}
                </Link>
              </div>
              
              {sectionProducts.length === 0 ? (
                <div className="card p-12 text-center text-muted">
                  <p>No featured products selected.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sectionProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          )
        }
      })}
    </div>
  )
}
