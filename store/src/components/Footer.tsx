import Link from "next/link"

export default function Footer({ settings }: { settings: any }) {
  let footerData = {
    about: "We provide the best digital and physical goods securely.",
    phone: "+1 234 567 890",
    socials: []
  }

  if (settings?.footerLayout) {
    try {
      footerData = JSON.parse(settings.footerLayout)
    } catch (e) {}
  }

  return (
    <footer className="border-t py-12 mt-16" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">{settings?.siteTitle || "Store"}</h3>
          <p className="text-muted text-sm leading-relaxed max-w-sm">{footerData.about}</p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <p className="text-sm text-muted mb-2">
            Phone: <span className="font-medium" style={{ color: "var(--foreground)" }}>{footerData.phone}</span>
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/shop" className="text-sm text-primary hover:underline">Browse Products</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex flex-col gap-2">
            {footerData.socials && footerData.socials.length > 0 ? (
              footerData.socials.map((social: any, idx: number) => (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  {social.platform}
                </a>
              ))
            ) : (
              <span className="text-sm text-muted">No social links added yet.</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t text-center text-sm text-muted" style={{ borderColor: "var(--border)" }}>
        &copy; {new Date().getFullYear()} {settings?.siteTitle || "Store"}. All rights reserved.
      </div>
    </footer>
  )
}
