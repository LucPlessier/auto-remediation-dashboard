'use client'

import { useEffect, useState } from "react"
import ThreatIntel from "@/components/threat-intel"
import DiscoveryService from "@/components/discovery-service"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <ThreatIntel />
        <DiscoveryService />
      </div>
    </div>
  )
}
