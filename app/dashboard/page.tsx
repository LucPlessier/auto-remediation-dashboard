'use client'

import { useEffect, useState } from "react"
import { AlertBanner } from "@/components/alert-banner"
import { DiscoveryService } from "@/components/discovery-service"
import { ExposureMonitoring } from "@/components/exposure-monitoring"
import { ThreatIntel } from "@/components/threat-intel"
import { VulnerabilityForecastChart } from "@/components/vulnerability-forecast"
import { EnhancedAttackTrace } from "@/components/enhanced-attack-trace"
import { RiskOverview } from "@/components/risk-overview"
import { UserBehavior } from "@/components/user-behavior"
import { AutomatedChanges } from "@/components/automated-changes"
import { AttackPathAnalysis } from "@/components/attack-path-analysis"
import { AutoRemediationPanel } from '@/components/auto-remediation-panel';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for initial data fetch
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AlertBanner />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RiskOverview />
        <UserBehavior />
        <ThreatIntel />
        <VulnerabilityForecastChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DiscoveryService />
        <ExposureMonitoring />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <EnhancedAttackTrace />
        <AutomatedChanges />
      </div>

      <div className="grid gap-4">
        <AttackPathAnalysis />
      </div>

      <div className="mt-4">
        <AutoRemediationPanel />
      </div>
    </div>
  )
}
