"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const EMPTY_PRODUCT = { name: "", slug: "", description: "", price: "", discountPrice: "", stock: "10", categoryId: "", imageUrl: "", isMain: true }

export default function ProductsTab({ products, categories }: { products: any[]; categories: any[] }) {
  const router = useRouter()
  const [form, setForm] = useState<any>(EMPTY_PRODUCT)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [catForm, setCatForm] = useState({ name: "", slug: "" })
  const [savingCat, setSavingCat] = useState(false)

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const saveProduct = async () => {
    setSaving(true)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      stock: parseInt(form.stock),
      categoryId: form.categoryId || null,
    }
    const url = editing ? `/api/admin/products/${editing}` : "/api/admin/products"
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setSaving(false)
    setForm(EMPTY_PRODUCT)
    setEditing(null)
    router.refresh()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    router.refresh()
  }

  const saveCategory = async () => {
    setSavingCat(true)
    await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catForm) })
    setSavingCat(false)
    setCatForm({ name: "", slug: "" })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Product Form ── */}
      <div className="card">
        <div className="card-header"><h3>{editing ? "Edit Product" : "Add New Product"}</h3></div>
        <div className="card-body">
          <div className="grid md:grid-2 gap-4">
            <div className="form-group">
              <label className="label">Product Name *</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} placeholder="e.g. Premium Cotton T-Shirt" />
            </div>
            <div className="form-group">
              <label className="label">Slug (URL)</label>
              <input className="input" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from name" />
            </div>
            <div className="form-group">
              <label className="label">Price *</label>
              <input type="number" className="input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="29.99" />
            </div>
            <div className="form-group">
              <label className="label">Sale Price (optional)</label>
              <input type="number" className="input" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} placeholder="19.99" />
            </div>
            <div className="form-group">
              <label className="label">Stock</label>
              <input type="number" className="input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Category</label>
              <select className="select" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">No Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group md:col-span-2">
              <label className="label">Image URL</label>
              <input className="input" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="form-group md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={saveProduct} disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
            </button>
            {editing && <button onClick={() => { setForm(EMPTY_PRODUCT); setEditing(null) }} className="btn btn-secondary">Cancel</button>}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="card">
        <div className="card-header"><h3>Categories</h3></div>
        <div className="card-body">
          <div className="flex gap-3 flex-wrap mb-4">
            {categories.map(c => (
              <span key={c.id} className="badge badge-blue" style={{ fontSize: "0.85rem", padding: "0.35rem 0.75rem" }}>{c.name}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <input className="input" placeholder="Category name" value={catForm.name} onChange={e => setCatForm({ name: e.target.value, slug: autoSlug(e.target.value) })} style={{ maxWidth: 220 }} />
            <input className="input" placeholder="Slug" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} style={{ maxWidth: 180 }} />
            <button onClick={saveCategory} disabled={savingCat} className="btn btn-secondary">{savingCat ? "Adding..." : "Add Category"}</button>
          </div>
        </div>
      </div>

      {/* ── Products Table ── */}
      <div>
        <h3 className="mb-4">All Products ({products.length})</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => {
                const img = p.images.find((i: any) => i.isMain) || p.images[0]
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-subtle)", flexShrink: 0 }}>
                          {img && <img src={img.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.name}</div>
                          <div className="text-xs text-muted">/shop/{p.category?.slug || "uncategorized"}/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{p.category?.name || "—"}</td>
                    <td>
                      {p.discountPrice
                        ? <><span style={{ textDecoration: "line-through", color: "var(--text-faint)", fontSize: "0.8rem" }}>${p.price}</span> <strong style={{ color: "var(--danger)" }}>${p.discountPrice}</strong></>
                        : <strong>${p.price}</strong>}
                    </td>
                    <td><span className={`badge ${p.stock > 0 ? "badge-green" : "badge-red"}`}>{p.stock}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(p.id); setForm({ name: p.name, slug: p.slug, description: p.description, price: p.price, discountPrice: p.discountPrice || "", stock: p.stock, categoryId: p.categoryId || "", imageUrl: p.images[0]?.url || "" }) }}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
