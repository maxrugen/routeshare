export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-primary-900 mb-4">404</h1>
        <p className="text-primary-600 mb-6">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="btn-primary inline-block">Go Home</a>
      </div>
    </div>
  )
}


