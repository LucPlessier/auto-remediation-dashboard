"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Change {
  id: number
  service: string
  status: 'running' | 'stopped' | 'degraded'
  impact: 'low' | 'medium' | 'high' | 'critical'
  lastUpdated: string
  details: string
}

export function ChangeImpactService() {
  const changes: Change[] = [
    {
      id: 1,
      service: "Authentication Service",
      status: "running",
      impact: "low",
      lastUpdated: "2024-12-29T10:30:00Z",
      details: "Minor configuration update"
    },
    {
      id: 2,
      service: "Data Processing Pipeline",
      status: "degraded",
      impact: "medium",
      lastUpdated: "2024-12-29T09:45:00Z",
      details: "Performance degradation detected"
    },
    {
      id: 3,
      service: "Backup System",
      status: "stopped",
      impact: "critical",
      lastUpdated: "2024-12-29T08:15:00Z",
      details: "Emergency maintenance required"
    }
  ]

  const getStatusColor = (status: Change['status']) => {
    switch (status) {
      case 'running': return 'text-green-600'
      case 'stopped': return 'text-red-600'
      case 'degraded': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: Change['impact']) => {
    switch (impact) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-green-600" />
          Change Impact Service
        </CardTitle>
        <CardDescription>
          Monitor service changes and their impact on system stability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changes.map((change) => (
              <TableRow key={change.id}>
                <TableCell className="font-medium">{change.service}</TableCell>
                <TableCell className={getStatusColor(change.status)}>
                  {change.status.charAt(0).toUpperCase() + change.status.slice(1)}
                </TableCell>
                <TableCell className={getImpactColor(change.impact)}>
                  {change.impact.charAt(0).toUpperCase() + change.impact.slice(1)}
                </TableCell>
                <TableCell>
                  {new Date(change.lastUpdated).toLocaleString()}
                </TableCell>
                <TableCell>{change.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
