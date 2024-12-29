"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { AttackPathService, AttackPath } from "@/lib/services/attack-path.service"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Loader2, Shield } from "lucide-react"

export function AttackPathAnalysis() {
  const [attackPaths, setAttackPaths] = useState<AttackPath[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const attackPathService = new AttackPathService()

  useEffect(() => {
    async function fetchAttackPaths() {
      try {
        const paths = await attackPathService.getAttackPaths()
        if (!paths) {
          throw new Error("No attack paths data received")
        }
        setAttackPaths(paths)
        setError(null)
      } catch (error) {
        console.error("Error fetching attack paths:", error)
        setError("Failed to load attack paths")
        setAttackPaths([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttackPaths()

    // Poll for updates every 5 minutes
    const interval = setInterval(fetchAttackPaths, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: AttackPath['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-blue-500'
    }
  }

  const handleSimulate = async (pathId: string) => {
    try {
      const simulation = await attackPathService.simulateAttackPath(pathId)
      // Handle simulation results
      console.log('Simulation results:', simulation)
    } catch (error) {
      console.error('Simulation error:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Attack Path Analysis</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {attackPaths.map((path) => (
              <div key={path.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{path.name}</span>
                  <span className={`text-sm ${getSeverityColor(path.severity)}`}>
                    {path.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{path.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Probability</span>
                    <span>{path.probability}%</span>
                  </div>
                  <Progress value={path.probability} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Impact</span>
                    <span>{path.impact}%</span>
                  </div>
                  <Progress value={path.impact} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {new Date(path.lastUpdated).toLocaleString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSimulate(path.id)}
                  >
                    Simulate Attack
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
