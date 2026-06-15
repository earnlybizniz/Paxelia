/**
 * app/admin/login/layout.tsx
 * Override layout for the login page — no sidebar, just a centered card.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
