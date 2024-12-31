'use client'

import { TopNav } from '@/components/top-nav'
import { SideNav } from '@/components/side-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative flex min-h-screen">
        <SideNav />
        <div className="flex-1">
          <TopNav />
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
