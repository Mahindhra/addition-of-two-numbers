import { SiteHeader } from "@/components/site-header"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader active="admin" />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <AdminDashboard />
      </main>
    </div>
  )
}
