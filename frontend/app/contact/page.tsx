import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact – Routeshare',
  description: 'Get in touch with Routeshare. Find contact details and links to our community resources.',
  openGraph: {
    title: 'Contact – Routeshare',
    description: 'Get in touch with Routeshare. Find contact details and links to our community resources.',
    images: ['/og-default.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact – Routeshare',
    description: 'Get in touch with Routeshare. Find contact details and links to our community resources.',
    images: ['/og-default.svg'],
  },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-gray-700">
        This is a placeholder Contact page to meet regulatory requirements. Replace with
        your preferred contact methods and legally required details.
      </p>
      <div className="mt-6 space-y-2 text-gray-700">
        <p><span className="font-medium">Email:</span> hi@maxrugen.com</p>
        <p><span className="font-medium">Address:</span> [Your Address]</p>
        <p><span className="font-medium">GitHub:</span> <a href="https://github.com/maxrugen/routeshare" className="text-blue-600 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded" target="_blank" rel="noopener noreferrer" aria-label="Open Routeshare on GitHub (opens in new tab)">https://github.com/maxrugen/routeshare</a></p>
      </div>
    </div>
  )
}


