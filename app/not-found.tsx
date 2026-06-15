export default function NotFound() {
  return (
    <main className="container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This page doesn't exist. Please check the URL and try again.
        </p>
        <a href="/" className="button-primary">
          Go Home
        </a>
      </div>
    </main>
  )
}
