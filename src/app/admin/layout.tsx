import { requireAdmin } from "@/lib/auth"
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce admin role at the root of /admin routes
  await requireAdmin()

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
