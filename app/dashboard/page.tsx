"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertBanner } from "@/components/alert-banner"
import { VulnerabilityFindings } from "@/components/vulnerability-findings"
import { VulnerabilityDetail } from "@/components/vulnerability-detail"
import { EnhancedAttackTrace } from "@/components/enhanced-attack-trace"
import { RiskOverview } from "@/components/risk-overview"
import { RecommendedActions } from "@/components/recommended-actions"
import { UserBehaviorAnalytics } from "@/components/user-behavior-analytics"
import { ChangeImpactService } from "@/components/change-impact-service"
import { AutomatedChanges } from "@/components/automated-changes"
import { DiscoveryService } from "@/components/discovery-service"
import { ExposureMonitoring } from "@/components/exposure-monitoring"
import { ThreatIntel } from "@/components/threat-intel"
import { VulnerabilityForecast } from "@/components/vulnerability-forecast"

const sampleVulnerability = {
  cve: "CVE-2024-6387",
  description: "A RegreSSHion vulnerability was discovered in OpenSSH's server (sshd). There is a race condition which can lead sshd to handle some signals in an unsafe manner.",
  asset: "gke-1213",
  component: "openssh-server",
  version: "8.7p1-34.el9_3.3",
  risk: {
    score: 9.3,
    level: "Critical"
  },
  impact: {
    confidentiality: 90,
    integrity: 70,
    availability: 80
  },
  attackVector: [
    "Initial Access",
    "Privilege Escalation",
    "Lateral Movement",
    "Data Exfiltration"
  ]
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-800">CTEM Enterprise Dashboard</h1>
      <AlertBanner deploymentPercentage={89} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DiscoveryService />
        <ExposureMonitoring />
        <ThreatIntel />
        <VulnerabilityForecast />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <RiskOverview />
        <RecommendedActions />
      </div>
      <Tabs defaultValue="vulnerabilities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="changes">Changes</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
        </TabsList>
        <TabsContent value="vulnerabilities" className="space-y-4">
          <VulnerabilityFindings />
          <VulnerabilityDetail vulnerability={sampleVulnerability} />
        </TabsContent>
        <TabsContent value="threats" className="space-y-4">
          <EnhancedAttackTrace />
        </TabsContent>
        <TabsContent value="changes" className="space-y-4">
          <ChangeImpactService />
          <AutomatedChanges />
        </TabsContent>
        <TabsContent value="behavior" className="space-y-4">
          <UserBehaviorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
