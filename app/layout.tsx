import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PartnerLink - Gestion de liens partenaires',
  description: 'Gérez et suivez vos liens partenaires avec PartnerLink',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
