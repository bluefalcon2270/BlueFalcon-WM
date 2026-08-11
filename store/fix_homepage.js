const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({ select: { id: true } })
  const productIds = products.map(p => p.id)

  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })
  
  if (settings && settings.homepageLayout) {
    let layout = JSON.parse(settings.homepageLayout)
    
    let updated = false
    layout = layout.map(section => {
      if (section.type === 'featured') {
        section.productIds = productIds
        updated = true
      }
      return section
    })

    if (updated) {
      await prisma.siteSettings.update({
        where: { id: "1" },
        data: { homepageLayout: JSON.stringify(layout) }
      })
      console.log("Successfully injected product IDs into homepage layout!")
    } else {
      console.log("No featured section found in layout.")
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
