import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface RiskMetric {
  category: string
  score: number
  trend: 'up' | 'down' | 'stable'
  previousScore: number
}

interface RiskData {
  overallScore: number
  metrics: RiskMetric[]
  lastUpdated: string
}

export function RiskOverview() {
  const [data, setData] = useState<RiskData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRiskData() {
      try {
        const response = await fetch('/api/risk/overview')
        if (!response.ok) throw new Error('Failed to fetch risk data')
        const riskData = await response.json()
        setData(riskData)
        setError(null)
      } catch (error) {
        console.error('Error fetching risk data:', error)
        setError('Failed to load risk overview')
        // Fallback to sample data
        setData({
          overallScore: 65,
          metrics: [
            { category: 'Vulnerability', score: 72, trend: 'down', previousScore: 78 },
            { category: 'Threat', score: 58, trend: 'up', previousScore: 52 },
            { category: 'Asset', score: 85, trend: 'stable', previousScore: 85 },
            { category: 'User', score: 45, trend: 'down', previousScore: 55 }
          ],
          lastUpdated: new Date().toISOString()
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRiskData()
    const interval = setInterval(fetchRiskData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  const getTrendColor = (trend: string, score: number, previousScore: number) => {
    if (trend === 'stable') return 'text-gray-500'
    return score > previousScore ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Risk Overview</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Risk Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(data.overallScore)}`}>
                  {data.overallScore}
                </span>
              </div>
              <Progress value={data.overallScore} className="h-2" />
            </div>
            
            <div className="space-y-4">
              {data.metrics.map((metric) => (
                <div key={metric.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{metric.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getScoreColor(metric.score)}`}>
                        {metric.score}
                      </span>
                      <span className={`text-sm ${getTrendColor(metric.trend, metric.score, metric.previousScore)}`}>
                        {getTrendIcon(metric.trend)}
                      </span>
                    </div>
                  </div>
                  <Progress value={metric.score} className="h-1.5" />
                </div>
              ))}
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
