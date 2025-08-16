export default function Head() {
  const title = 'Dashboard – Create and Export Overlays | Routeshare'
  const description = 'Import activities via GPX, preview overlays, and export Instagram-ready PNGs in light or dark variants.'
  const ogImage = '/og-default.svg'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}


