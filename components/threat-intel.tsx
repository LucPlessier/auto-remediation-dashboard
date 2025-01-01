"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Threat {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: string
  affectedSystems: string[]
  status: 'active' | 'mitigated' | 'investigating'
  details: Record<string, unknown>
}

export default function ThreatIntel() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch('/api/threats')
        if (!response.ok) {
          throw new Error('Failed to fetch threats')
        }
        const data = await response.json()
        setThreats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchThreats()
  }, [])

  const startRemediation = async (threatId: string) => {
    try {
      const response = await fetch('/api/auto-remediation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threatId }),
      })

      if (!response.ok) {
        throw new Error('Failed to start remediation')
      }

      // Update threat status
      setThreats(prev => 
        prev.map(threat => 
          threat.id === threatId 
            ? { ...threat, status: 'investigating' as const }
            : threat
        )
      )
    } catch (err) {
      console.error('Error starting remediation:', err)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Threat Intelligence</CardTitle>
          <CardDescription>Active threats and remediations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Threat Intelligence</CardTitle>
          <CardDescription>Active threats and remediations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  const getSeverityColor = (severity: Threat['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Intelligence</CardTitle>
        <CardDescription>Active threats and remediations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold">{threats.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active Threats</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {threats.filter(t => t.severity === 'critical' || t.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">High Priority</div>
          </div>
        </div>

        <div className="space-y-4">
          {threats.map(threat => (
            <div key={threat.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{threat.type}</h4>
                  <p className="text-sm text-gray-600">{threat.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${getSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {threat.affectedSystems.length} affected systems
                </div>
                {threat.status === 'active' && (
                  <Button
                    onClick={() => startRemediation(threat.id)}
                    variant="outline"
                    size="sm"
                  >
                    Start Remediation
                  </Button>
                )}
                {threat.status === 'investigating' && (
                  <span className="text-sm text-yellow-600">
                    Remediation in progress...
                  </span>
                )}
                {threat.status === 'mitigated' && (
                  <span className="text-sm text-green-600">
                    Threat mitigated
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
