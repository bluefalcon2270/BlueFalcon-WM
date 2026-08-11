import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height) - 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "8rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1, letterSpacing: "-0.05em", marginBottom: "1rem" }}>
          404
        </div>
        <h1 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>Page not found</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "360px", margin: "0 auto 2rem" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary btn-lg">Go Home</Link>
          <Link href="/shop" className="btn btn-secondary btn-lg">Browse Shop</Link>
        </div>
      </div>
    </div>
  )
}
