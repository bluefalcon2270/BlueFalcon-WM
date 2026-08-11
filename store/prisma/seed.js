const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      siteTitle: "BlueFalcon WM",
      homepageLayout: JSON.stringify([
        { type: 'hero', title: 'Welcome to BlueFalcon', text: 'Discover our premium digital and physical products.', buttonText: 'Shop Now', buttonLink: '/shop' },
        { type: 'featured', title: 'Featured Products', buttonText: 'View All', buttonLink: '/shop', productIds: [] }
      ]),
      footerLayout: JSON.stringify({
        about: "We provide the best digital and physical goods securely.",
        phone: "+1 234 567 890",
        socials: [
          { platform: "Twitter", link: "https://twitter.com" },
          { platform: "Instagram", link: "https://instagram.com" }
        ]
      })
    }
  })

  // 2. Admin User
  const adminPassword = await bcrypt.hash('admin', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // 3. Payment Method (Card to Card)
  await prisma.paymentMethod.create({
    data: {
      name: "Card to Card",
      description: "Transfer to: 1234-5678-9012-3456 (John Doe)",
      instructions: "Please transfer the exact amount and enter your tracking/receipt ID below.",
      requiresReceipt: true,
      isActive: true
    }
  })

  // 4. Test Coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      discountType: 'PERCENTAGE',
      discountValue: 20
    }
  })

  // 5. Categories
  const catShirts = await prisma.category.upsert({
    where: { slug: 'shirts' },
    update: {},
    create: { name: 'Shirts', slug: 'shirts' }
  })
  
  const catDigital = await prisma.category.upsert({
    where: { slug: 'digital' },
    update: {},
    create: { name: 'Digital Goods', slug: 'digital' }
  })

  // 6. Products
  const p1 = await prisma.product.upsert({
    where: { slug: 'premium-cotton-tshirt' },
    update: {},
    create: {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-tshirt',
      description: 'A very comfortable cotton t-shirt.',
      price: 29.99,
      categoryId: catShirts.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', isMain: true }
        ]
      }
    }
  })

  const p2 = await prisma.product.upsert({
    where: { slug: 'digital-software-key' },
    update: {},
    create: {
      name: 'Software License Key (Digital)',
      slug: 'digital-software-key',
      description: 'Instant delivery software activation key.',
      price: 49.99,
      discountPrice: 39.99,
      categoryId: catDigital.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', isMain: true }
        ]
      }
    }
  })

  console.log('v2.0 Database Seeding Complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
