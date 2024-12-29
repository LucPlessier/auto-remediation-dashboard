import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface ThreatData {
  newThreats: number
  totalThreats: number
  severityLevel: 'low' | 'medium' | 'high' | 'critical'
  severityScore: number
  categories: {
    name: string
    count: number
    severity: 'low' | 'medium' | 'high' | 'critical'
  }[]
  recentActivity: {
    type: string
    timestamp: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }[]
  lastUpdated: string
}

export function ThreatIntel() {
  const [data, setData] = useState<ThreatData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchThreatData() {
      try {
        const response = await fetch('/api/threats')
        if (!response.ok) throw new Error('Failed to fetch threat data')
        const threatData = await response.json()
        setData(threatData)
        setError(null)
      } catch (error) {
        console.error('Error fetching threat data:', error)
        setError('Failed to load threat intelligence')
        // Fallback to sample data
        setData({
          newThreats: 18,
          totalThreats: 156,
          severityLevel: 'medium',
          severityScore: 65,
          categories: [
            { name: 'Malware', count: 45, severity: 'high' },
            { name: 'Phishing', count: 32, severity: 'medium' },
            { name: 'Zero-Day', count: 12, severity: 'critical' },
            { name: 'DDoS', count: 67, severity: 'low' }
          ],
          recentActivity: [
            {
              type: 'Detection',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              description: 'New ransomware variant detected',
              severity: 'high'
            },
            {
              type: 'Alert',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              description: 'Suspicious network activity',
              severity: 'medium'
            }
          ],
          lastUpdated: new Date().toISOString()
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchThreatData()
    const interval = setInterval(fetchThreatData, 30 * 1000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-blue-500'
    }
  }

  const getSeverityProgress = (severity: string) => {
    switch (severity) {
      case 'critical': return 100
      case 'high': return 75
      case 'medium': return 50
      case 'low': return 25
      default: return 0
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Threat Intelligence</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{data.newThreats}</div>
                <p className="text-xs text-muted-foreground">New threats today</p>
              </div>
              <div className="text-sm px-2 py-1 bg-orange-100 text-orange-800 rounded">
                Total: {data.totalThreats}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Severity Level</span>
                <span className={getSeverityColor(data.severityLevel)}>
                  {data.severityLevel.toUpperCase()}
                </span>
              </div>
              <Progress 
                value={getSeverityProgress(data.severityLevel)} 
                className="h-2" 
              />
            </div>

            <div className="space-y-3">
              {data.categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm">{category.name}</span>
                  <span className={`text-sm font-medium ${getSeverityColor(category.severity)}`}>
                    {category.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium">Recent Activity</div>
              <div className="space-y-2">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className={getSeverityColor(activity.severity)}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
