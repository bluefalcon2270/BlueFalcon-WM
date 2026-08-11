export default function Footer() {
  return (
    <footer style={{ marginTop: "auto", borderTop: "1px solid var(--border)", backgroundColor: "var(--card)", padding: "2rem 0" }}>
      <div className="container text-center text-muted text-sm flex flex-col gap-2">
        <p>&copy; {new Date().getFullYear()} Premium Store. All rights reserved.</p>
        <p>A demonstration e-commerce application.</p>
      </div>
    </footer>
  )
}
