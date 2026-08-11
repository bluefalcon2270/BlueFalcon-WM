import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function AdminSettingsTab() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "1" } })

  async function updateProfile(formData: FormData) {
    "use server"
    const newUsername = formData.get("username") as string
    const newPassword = formData.get("password") as string
    
    const session = await getServerSession(authOptions)
    const adminId = (session?.user as any)?.id
    if (!adminId) return

    const updateData: any = {}
    if (newUsername) updateData.username = newUsername
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10)

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({ where: { id: adminId }, data: updateData })
    }
  }

  async function updateSiteSettings(formData: FormData) {
    "use server"
    await prisma.siteSettings.update({
      where: { id: "1" },
      data: {
        siteTitle: formData.get("siteTitle") as string,
        logoUrl: formData.get("logoUrl") as string,
        homepageLayout: formData.get("homepageLayout") as string,
        footerLayout: formData.get("footerLayout") as string,
      }
    })
    revalidatePath("/")
    revalidatePath("/admin")
  }

  return (
    <div className="flex flex-col gap-8">
      
      <div className="card p-6" style={{ backgroundColor: "var(--muted)" }}>
        <h2 className="text-xl font-bold mb-4">Admin Profile Settings</h2>
        <form action={updateProfile} className="flex gap-4 flex-col md:flex-row items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-bold text-muted">New Username</label>
            <input type="text" name="username" placeholder="Leave blank to keep current" className="input mt-1" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm font-bold text-muted">New Password</label>
            <input type="password" name="password" placeholder="Leave blank to keep current" className="input mt-1" />
          </div>
          <button type="submit" className="btn btn-primary w-full md:w-auto" style={{ height: "42px" }}>Update Profile</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Site Builder & CMS Settings</h2>
        <form action={updateSiteSettings} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-muted">Site Title</label>
              <input type="text" name="siteTitle" defaultValue={settings?.siteTitle} className="input mt-1" />
            </div>
            <div>
              <label className="text-sm font-bold text-muted">Logo URL</label>
              <input type="text" name="logoUrl" defaultValue={settings?.logoUrl || ""} placeholder="https://..." className="input mt-1" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-bold text-muted mb-1 block">Homepage Layout (JSON Editor)</label>
            <textarea 
              name="homepageLayout" 
              defaultValue={settings?.homepageLayout} 
              className="input font-mono text-sm" 
              rows={8}
            />
            <p className="text-xs text-muted mt-1">Advanced: Edit the raw JSON structure of your homepage sections (Hero, Featured).</p>
          </div>

          <div>
            <label className="text-sm font-bold text-muted mb-1 block">Footer Layout (JSON Editor)</label>
            <textarea 
              name="footerLayout" 
              defaultValue={settings?.footerLayout} 
              className="input font-mono text-sm" 
              rows={6}
            />
            <p className="text-xs text-muted mt-1">Advanced: Edit your About text, phone number, and social links.</p>
          </div>

          <button type="submit" className="btn btn-primary w-full">Save Site Settings</button>
        </form>
      </div>

    </div>
  )
}
