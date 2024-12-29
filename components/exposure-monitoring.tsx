import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Eye, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface ExposureData {
  totalExposures: number
  criticalExposures: number
  exposureScore: number
  categories: {
    name: string
    count: number
    severity: 'low' | 'medium' | 'high' | 'critical'
  }[]
  trends: {
    period: string
    change: number
  }[]
  lastUpdated: string
}

export function ExposureMonitoring() {
  const [data, setData] = useState<ExposureData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExposureData() {
      try {
        const response = await fetch('/api/exposure')
        if (!response.ok) throw new Error('Failed to fetch exposure data')
        const exposureData = await response.json()
        setData(exposureData)
        setError(null)
      } catch (error) {
        console.error('Error fetching exposure data:', error)
        setError('Failed to load exposure monitoring')
        // Fallback to sample data
        setData({
          totalExposures: 156,
          criticalExposures: 12,
          exposureScore: 68,
          categories: [
            { name: 'Open Ports', count: 45, severity: 'high' },
            { name: 'Misconfigurations', count: 32, severity: 'medium' },
            { name: 'Outdated Software', count: 58, severity: 'high' },
            { name: 'Weak Credentials', count: 21, severity: 'critical' }
          ],
          trends: [
            { period: '24h', change: -5 },
            { period: '7d', change: -15 },
            { period: '30d', change: -25 }
          ],
          lastUpdated: new Date().toISOString()
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExposureData()
    const interval = setInterval(fetchExposureData, 2 * 60 * 1000) // Update every 2 minutes
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

  const getTrendColor = (change: number) => {
    return change <= 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Exposure Monitoring</CardTitle>
        <Eye className="h-4 w-4 text-muted-foreground" />
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
                <div className="text-2xl font-bold">{data.totalExposures}</div>
                <p className="text-xs text-muted-foreground">Total Exposures</p>
              </div>
              {data.criticalExposures > 0 && (
                <div className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">
                  {data.criticalExposures} critical
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exposure Score</span>
                <span>{data.exposureScore}/100</span>
              </div>
              <Progress value={data.exposureScore} className="h-2" />
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
              <div className="text-sm font-medium">Trends</div>
              <div className="grid grid-cols-3 gap-2">
                {data.trends.map((trend) => (
                  <div key={trend.period} className="text-center">
                    <div className={`text-sm font-medium ${getTrendColor(trend.change)}`}>
                      {trend.change > 0 ? '+' : ''}{trend.change}%
                    </div>
                    <div className="text-xs text-muted-foreground">{trend.period}</div>
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
