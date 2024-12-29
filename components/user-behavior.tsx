import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserCheck, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface UserBehaviorData {
  riskScore: number
  totalUsers: number
  activeUsers: number
  categories: {
    name: string
    count: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  }[]
  recentActivities: {
    user: string
    action: string
    timestamp: string
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  }[]
  lastUpdated: string
}

export function UserBehavior() {
  const [data, setData] = useState<UserBehaviorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user-behavior')
        if (!response.ok) throw new Error('Failed to fetch user behavior data')
        const userData = await response.json()
        setData(userData)
        setError(null)
      } catch (error) {
        console.error('Error fetching user behavior data:', error)
        setError('Failed to load user behavior data')
        // Fallback to sample data
        setData({
          riskScore: 42,
          totalUsers: 1250,
          activeUsers: 890,
          categories: [
            { name: 'High-Risk Actions', count: 15, riskLevel: 'high' },
            { name: 'Policy Violations', count: 28, riskLevel: 'medium' },
            { name: 'Unusual Access', count: 45, riskLevel: 'low' },
            { name: 'Failed Logins', count: 32, riskLevel: 'medium' }
          ],
          recentActivities: [
            {
              user: 'john.doe',
              action: 'Multiple failed login attempts',
              timestamp: new Date(Date.now() - 900000).toISOString(),
              riskLevel: 'high'
            },
            {
              user: 'jane.smith',
              action: 'Accessed sensitive data',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              riskLevel: 'medium'
            }
          ],
          lastUpdated: new Date().toISOString()
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
    const interval = setInterval(fetchUserData, 60 * 1000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-blue-500'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>User Behavior</CardTitle>
        <UserCheck className="h-4 w-4 text-muted-foreground" />
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
                <div className="text-2xl font-bold">{data.riskScore}</div>
                <p className="text-xs text-muted-foreground">Risk Score</p>
              </div>
              <div className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {data.activeUsers}/{data.totalUsers} active
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Risk Level</span>
                <span>{data.riskScore < 30 ? 'Low' : data.riskScore < 60 ? 'Medium' : 'High'}</span>
              </div>
              <Progress value={data.riskScore} className="h-2" />
            </div>

            <div className="space-y-3">
              {data.categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm">{category.name}</span>
                  <span className={`text-sm font-medium ${getRiskColor(category.riskLevel)}`}>
                    {category.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium">Recent Activities</div>
              <div className="space-y-2">
                {data.recentActivities.map((activity, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className={getRiskColor(activity.riskLevel)}>
                        {activity.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
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
