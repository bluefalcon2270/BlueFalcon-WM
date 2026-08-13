const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log("Starting massive database seed for WAF Video presentation...")

  // 1. Admin User
  const adminPassword = await bcrypt.hash('admin', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: adminPassword, role: 'ADMIN' },
  })

  // 2. Categories
  const catApparel = await prisma.category.upsert({ where: { slug: 'apparel' }, update: {}, create: { name: 'Apparel', slug: 'apparel' } })
  const catElectronics = await prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics' } })
  const catDigital = await prisma.category.upsert({ where: { slug: 'digital' }, update: {}, create: { name: 'Digital Goods', slug: 'digital' } })
  const catAccessories = await prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Accessories', slug: 'accessories' } })

  // 3. Products
  const productsToCreate = [
    // Apparel
    { name: 'Premium Cotton T-Shirt', slug: 'premium-cotton-tshirt', price: 29.99, catId: catApparel.id, img: '1521572163474-6864f9cf17ab' },
    { name: 'Urban Minimalist Hoodie', slug: 'urban-hoodie', price: 59.99, catId: catApparel.id, img: '1556821840-3a63f95609a7', sale: 49.99 },
    { name: 'Classic Leather Jacket', slug: 'leather-jacket', price: 199.99, catId: catApparel.id, img: '1551028719-00167b16eac5' },
    { name: 'Red Runner Sneakers', slug: 'red-sneakers', price: 129.99, catId: catApparel.id, img: '1542291026-7eec264c27ff', sale: 89.99 },
    
    // Electronics
    { name: 'Noise-Cancelling Headphones', slug: 'nc-headphones', price: 249.99, catId: catElectronics.id, img: '1505740420928-5e560c06d30e', sale: 199.99 },
    { name: 'Smart Fitness Watch', slug: 'smart-watch', price: 149.99, catId: catElectronics.id, img: '1523275335684-37898b6baf30' },
    { name: 'Professional DSLR Camera', slug: 'pro-camera', price: 1299.99, catId: catElectronics.id, img: '1516035069371-29a1b244cc32' },
    { name: 'Wireless Gaming Controller', slug: 'gaming-controller', price: 69.99, catId: catElectronics.id, img: '1600080972464-8e5f35f63d08', sale: 49.99 },

    // Digital
    { name: 'Creative Cloud Suite Key', slug: 'cc-suite-key', price: 299.99, catId: catDigital.id, img: '1550751827-4bd374c3f58b', sale: 149.99 },
    { name: 'Cinematic Lightroom Presets', slug: 'lr-presets', price: 39.99, catId: catDigital.id, img: '1542744094-24638ea0b3b5' },
    { name: 'Mastering Next.js E-Book', slug: 'nextjs-ebook', price: 19.99, catId: catDigital.id, img: '1544947950-fa07a98d237f' },
    { name: 'Web Dev Bootcamp Video Course', slug: 'web-bootcamp', price: 99.99, catId: catDigital.id, img: '1516321318423-f06f85e504b3', sale: 49.99 },

    // Accessories
    { name: 'Polarized Aviator Sunglasses', slug: 'aviator-sunglasses', price: 119.99, catId: catAccessories.id, img: '1511499767150-a48a237f0083' },
    { name: 'Minimalist Travel Backpack', slug: 'travel-backpack', price: 89.99, catId: catAccessories.id, img: '1553062407-98eeb64c6a62', sale: 75.00 },
    { name: 'Slim Leather Wallet', slug: 'leather-wallet', price: 45.00, catId: catAccessories.id, img: '1627123424574-724758594e93' },
    { name: 'Signature Eau de Parfum', slug: 'signature-perfume', price: 85.00, catId: catAccessories.id, img: '1523293115678-d29027ed52ea' },
  ]

  const createdProducts = []
  for (const p of productsToCreate) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: 'Experience premium quality and unmatched performance with this highly rated item. Perfect for gifting or upgrading your daily routine.',
        price: p.price,
        discountPrice: p.sale || null,
        stock: 50,
        categoryId: p.catId,
        images: {
          create: [
            { url: `https://images.unsplash.com/photo-${p.img}?auto=format&fit=crop&w=800&q=80`, isMain: true }
          ]
        }
      }
    })
    createdProducts.push(product)
  }

  // 4. Site Settings & Rich Homepage Layout
  const techProductIds = createdProducts.filter(p => p.categoryId === catElectronics.id).map(p => p.id)
  const apparelProductIds = createdProducts.filter(p => p.categoryId === catApparel.id).map(p => p.id)
  const digitalProductIds = createdProducts.filter(p => p.categoryId === catDigital.id).map(p => p.id)

  const hpl = JSON.stringify([
    { 
      type: 'hero', 
      title: 'Welcome to the Future\nof E-Commerce.', 
      text: 'Discover our massive collection of premium apparel, cutting-edge electronics, and exclusive digital assets. High performance, zero compromises.', 
      buttonText: 'Explore Collection', 
      buttonLink: '/shop' 
    },
    { 
      type: 'featured', 
      title: 'Trending Electronics', 
      buttonText: 'View All Tech', 
      buttonLink: '/shop?cat=electronics', 
      productIds: techProductIds 
    },
    { 
      type: 'banner', 
      title: 'Summer Tech Sale - Up to 50% Off', 
      text: 'Upgrade your lifestyle with our premium electronics and accessories. Sale ends this Friday.', 
      buttonText: 'Shop the Sale', 
      buttonLink: '/shop?cat=electronics',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80'
    },
    { 
      type: 'featured', 
      title: 'Fresh Apparel', 
      buttonText: 'View All Apparel', 
      buttonLink: '/shop?cat=apparel', 
      productIds: apparelProductIds 
    },
    { 
      type: 'featured', 
      title: 'Bestselling Digital Assets', 
      buttonText: 'View All Digital', 
      buttonLink: '/shop?cat=digital', 
      productIds: digitalProductIds.slice(0, 4)
    }
  ])

  await prisma.siteSettings.upsert({
    where: { id: "1" },
    update: { homepageLayout: hpl },
    create: {
      id: "1",
      siteTitle: "BlueFalcon Shop",
      homepageLayout: hpl,
      footerLayout: JSON.stringify({
        about: "The ultimate modern e-commerce platform.",
        phone: "+1 234 567 890",
        socials: [{ platform: "Twitter", link: "https://twitter.com" }]
      })
    }
  })

  // 5. Payment Methods & Coupons
  const pm = await prisma.paymentMethod.findFirst({ where: { name: "Card to Card" } })
  if (!pm) {
    await prisma.paymentMethod.create({ data: { name: "Card to Card", description: "Transfer to: 1234-5678-9012-3456", requiresReceipt: true, isActive: true } })
  }
  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' }, update: {}, create: { code: 'WELCOME20', discountType: 'PERCENTAGE', discountValue: 20 }
  })

  console.log('Massive v3.0 Database Seeding Complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
