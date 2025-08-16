export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50" role="main" aria-labelledby="not-found-title">
      <div className="text-center p-8">
        <h1 id="not-found-title" className="text-5xl font-bold text-primary-900 mb-4">404</h1>
        <p className="text-primary-600 mb-6">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="btn-primary inline-block focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded" aria-label="Go back to homepage">Go Home</a>
      </div>
    </div>
  )
}


