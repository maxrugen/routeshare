import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imprint – Routeshare',
  description: 'Legal information and responsible contact for Routeshare.',
  openGraph: {
    title: 'Imprint – Routeshare',
    description: 'Legal information and responsible contact for Routeshare.',
    images: ['/og-default.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imprint – Routeshare',
    description: 'Legal information and responsible contact for Routeshare.',
    images: ['/og-default.svg'],
  },
}

export default function ImprintPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Imprint</h1>
      <p className="mt-4 text-gray-700">
        This is a placeholder Imprint page for regulatory compliance. Replace this
        content with your full legal disclosures, company information, and responsible contact.
      </p>
      <div className="mt-6 space-y-2 text-gray-700">
        <p><span className="font-medium">Company:</span> Routeshare</p>
        <p><span className="font-medium">Address:</span> on request</p>
        <p><span className="font-medium">Responsible Person:</span> Max Rugen</p>
        <p><span className="font-medium">Email:</span> hi@maxrugen.com</p>
      </div>
    </div>
  )
}


