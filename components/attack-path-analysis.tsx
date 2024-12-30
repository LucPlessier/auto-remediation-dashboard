"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Shield } from "lucide-react"

interface AttackPathAnalysisProps {
  data?: {
    paths: Array<{
      id: string
      name: string
      risk: number
      steps: number
    }>
  }
}

export function AttackPathAnalysis({ 
  data = {
    paths: [
      { id: '1', name: 'Critical Infrastructure Access', risk: 85, steps: 4 },
      { id: '2', name: 'Data Exfiltration Route', risk: 75, steps: 3 },
      { id: '3', name: 'Privilege Escalation Path', risk: 65, steps: 5 }
    ]
  } 
}: AttackPathAnalysisProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Attack Path Analysis</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.paths.map((path) => (
            <div key={path.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{path.name}</span>
                <span className={`text-sm ${
                  path.risk >= 80 ? 'text-red-500' :
                  path.risk >= 60 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  Risk: {path.risk}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      path.risk >= 80 ? 'bg-red-500' :
                      path.risk >= 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${path.risk}%` }}
                  />
                </div>
                <span className="ml-4 text-sm text-gray-600">
                  {path.steps} steps
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Last updated: 
                </span>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Simulate Attack
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
