"use client"
import { useState } from "react"

export default function ImageGallery({ images, productName }: { images: any[]; productName: string }) {
  const [selected, setSelected] = useState(0)
  const current = images[selected]

  if (!images.length) {
    return (
      <div style={{ aspectRatio: "1/1", background: "var(--bg-subtle)", borderRadius: "var(--radius-xl)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)" }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div style={{
        aspectRatio: "1/1",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "var(--bg-subtle)",
        boxShadow: "var(--shadow-md)"
      }}>
        <img src={current?.url} alt={productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setSelected(i)} style={{
              flexShrink: 0,
              width: 72, height: 72,
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: `2px solid ${i === selected ? "var(--primary)" : "var(--border)"}`,
              cursor: "pointer",
              padding: 0,
              transition: "border-color var(--transition)",
              background: "var(--bg-subtle)"
            }}>
              <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
