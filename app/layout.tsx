import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flower Delivery - Цветочный магазин',
  description: 'Доставка цветов и букетов. Создайте идеальный букет для любого повода.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="overflow-x-hidden" suppressHydrationWarning>
      <body className="overflow-x-hidden w-full max-w-full" suppressHydrationWarning>{children}</body>
    </html>
  )
}

