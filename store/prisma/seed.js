const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create products
  const products = [
    {
      name: "Premium Cotton T-Shirt",
      description: "Our classic fit t-shirt made from 100% organic cotton. Super soft and breathable.",
      price: 29.99,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "T-Shirts"
    },
    {
      name: "Classic Denim Jacket",
      description: "A timeless denim jacket that goes with any outfit. Durable and stylish.",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Outerwear"
    },
    {
      name: "Comfort Fit Jeans",
      description: "Everyday comfort with a modern cut. Features a slight stretch for mobility.",
      price: 59.99,
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c82361ac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Pants"
    },
    {
      name: "Minimalist Hoodie",
      description: "Keep warm in style. This hoodie features a clean design without loud logos.",
      price: 65.00,
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Hoodies"
    }
  ]

  console.log(`Created admin user: ${admin.email}`)

  for (const p of products) {
    const product = await prisma.product.create({
      data: p
    })
    console.log(`Created product: ${product.name}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
