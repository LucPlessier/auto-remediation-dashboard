import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { TopNav } from '@/components/top-nav'
import { SideNav } from '@/components/side-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CTEM Enterprise',
  description: 'Centralized Threat Exposure Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen">
          <SideNav />
          <div className="flex-1">
            <TopNav />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
