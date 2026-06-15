/**
 * app/admin/layout.tsx
 * Shared layout for admin routes. Does NOT call requireAdmin() here.
 * Individual protected pages call requireAdmin() themselves.
 * The /admin/login page is public and does not call requireAdmin().
 */
import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { template: '%s — Admin', default: 'Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
