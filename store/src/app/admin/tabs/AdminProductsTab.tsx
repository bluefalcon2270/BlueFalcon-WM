import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"

export default async function AdminProductsTab() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true }
  })
  const categories = await prisma.category.findMany()

  async function addCategory(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    try { await prisma.category.create({ data: { name, slug } }) } catch (e) {}
    revalidatePath("/admin")
  }

  async function addProduct(formData: FormData) {
    "use server"
    
    let imageUrl = formData.get("imageUrl") as string
    const imageFile = formData.get("imageFile") as File
    const name = formData.get("name") as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      fs.writeFileSync(path.join(uploadDir, filename), buffer)
      imageUrl = `/uploads/${filename}`
    }

    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    }

    const discountPriceStr = formData.get("discountPrice") as string
    const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null

    await prisma.product.create({
      data: {
        name,
        slug,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        discountPrice,
        categoryId: formData.get("categoryId") as string || null,
        stock: parseInt(formData.get("stock") as string) || 10,
        images: {
          create: [{ url: imageUrl, isMain: true }]
        }
      }
    })
    
    revalidatePath("/admin")
    revalidatePath("/shop")
    revalidatePath("/")
  }

  return (
    <div className="flex flex-col gap-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <form action={addProduct} className="card p-4 flex flex-col gap-4">
            <input type="text" name="name" placeholder="Product Name" className="input" required />
            <input type="text" name="description" placeholder="Description" className="input" required />
            <div className="flex gap-4">
              <input type="number" name="price" placeholder="Price (e.g. 29.99)" step="0.01" className="input flex-1" required />
              <input type="number" name="discountPrice" placeholder="Sale Price (Optional)" step="0.01" className="input flex-1" />
            </div>
            
            <div className="flex gap-4">
              <select name="categoryId" className="input flex-1">
                <option value="">No Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input type="number" name="stock" placeholder="Stock" defaultValue="10" className="input w-24" required />
            </div>

            <div className="flex flex-col gap-2 p-4 border rounded" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <label className="text-sm font-bold text-muted">Product Image (Main)</label>
              <input type="file" name="imageFile" accept="image/*" className="input" />
              <div className="text-center text-xs text-muted">OR</div>
              <input type="text" name="imageUrl" placeholder="Paste Image URL" className="input" />
            </div>

            <button type="submit" className="btn btn-primary mt-2">Add Product</button>
          </form>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <form action={addCategory} className="flex gap-2 mb-4">
              <input type="text" name="name" placeholder="New Category Name" className="input flex-1" required />
              <button type="submit" className="btn btn-outline">Add</button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <span key={c.id} className="px-3 py-1 bg-muted rounded text-sm font-medium">{c.name}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Current Products ({products.length})</h2>
            <div className="card p-4 flex flex-col gap-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {products.map(p => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <img src={p.images[0]?.url} alt="" className="w-8 h-8 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{p.category?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {p.discountPrice ? (
                      <p className="text-sm font-bold text-primary">${p.discountPrice.toFixed(2)}</p>
                    ) : (
                      <p className="text-sm font-medium">${p.price.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
