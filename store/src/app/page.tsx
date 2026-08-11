import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function HomePage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })
  const layout = settings?.homepageLayout ? JSON.parse(settings.homepageLayout) : []

  // Pre-fetch any featured products needed by the layout
  const allProductIdsToFetch = layout
    .filter((sec: any) => sec.type === 'featured')
    .flatMap((sec: any) => sec.productIds || [])

  const fetchedProducts = await prisma.product.findMany({
    where: { id: { in: allProductIdsToFetch } },
    include: { images: true, category: true }
  })

  const productMap = new Map(fetchedProducts.map(p => [p.id, p]))

  return (
    <div className="animate-fade-in pb-16">
      {layout.map((section: any, index: number) => {
        
        if (section.type === 'hero') {
          return (
            <div key={index} className="py-24 text-center">
              <div className="container max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{section.title}</h1>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">{section.text}</p>
                {section.buttonText && (
                  <Link href={section.buttonLink || "/shop"} className="btn btn-primary text-lg px-8 py-3">
                    {section.buttonText}
                  </Link>
                )}
              </div>
            </div>
          )
        }

        if (section.type === 'featured') {
          const sectionProducts = (section.productIds || [])
            .map((id: string) => productMap.get(id))
            .filter(Boolean)

          return (
            <div key={index} className="container py-12 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold tracking-tight">{section.title}</h2>
                {section.buttonText && (
                  <Link href={section.buttonLink || "/shop"} className="text-sm font-medium hover:underline">
                    {section.buttonText}
                  </Link>
                )}
              </div>

              {sectionProducts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                  No featured products selected.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {sectionProducts.map((p: any) => (
                    <div key={p.id} className="group cursor-pointer">
                      <Link href={`/shop/${p.category?.slug || 'uncategorized'}/${p.slug}`}>
                        <div className="relative w-full aspect-square overflow-hidden rounded-md mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                          <img 
                            src={p.images?.[0]?.url || ''} 
                            alt={p.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                          {p.discountPrice && (
                            <div className="absolute top-2 right-2 bg-primary text-background text-xs font-bold px-2 py-1 rounded-sm">
                              SALE
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-base line-clamp-1 group-hover:underline">{p.name}</h3>
                        <div className="flex gap-2 items-center mt-0.5">
                          {p.discountPrice ? (
                            <>
                              <span className="text-sm text-muted-foreground line-through">${p.price.toFixed(2)}</span>
                              <span className="font-medium text-sm">${p.discountPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">${p.price.toFixed(2)}</span>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
