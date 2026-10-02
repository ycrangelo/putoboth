import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'putoBoth',
  description: 'burat saging',
  icons: {
    icon: [
      {
        url: '/korome.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/korome.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/korome.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/korome.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
