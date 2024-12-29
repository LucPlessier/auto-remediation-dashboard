"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import { UserBehaviorService, AnalyticsData } from "@/lib/services/user-behavior.service"

interface BehaviorData {
  name: string
  normal: number
  anomalous: number
  timestamp: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: BehaviorData
    dataKey: string
  }>
  content?: React.ReactNode
}

export function UserBehaviorAnalytics() {
  const [data, setData] = useState<BehaviorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const behaviorService = new UserBehaviorService()

  useEffect(() => {
    async function fetchBehaviorData() {
      try {
        const behaviorData = await behaviorService.getAnalytics()
        const transformedData: BehaviorData[] = behaviorData.map((item: AnalyticsData) => ({
          name: new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
          normal: item.normal_activities,
          anomalous: item.anomalous_activities,
          timestamp: item.timestamp
        }))
        setData(transformedData)
        setError(null)
      } catch (error) {
        console.error("Error fetching behavior data:", error)
        setError("Failed to load behavior data")
        setData(getSampleData())
      } finally {
        setIsLoading(false)
      }
    }

    fetchBehaviorData()

    // Poll for updates every 5 minutes
    const interval = setInterval(fetchBehaviorData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="text-sm font-medium">
          {new Date(data.timestamp).toLocaleString()}
        </p>
        <p className="text-sm text-green-600">
          Normal: {payload.find(p => p.dataKey === 'normal')?.value}
        </p>
        <p className="text-sm text-red-600">
          Anomalous: {payload.find(p => p.dataKey === 'anomalous')?.value}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-red-600" />
            User Behavior Analytics
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-green-600" />
          User Behavior Analytics
        </CardTitle>
        <CardDescription>
          Monitoring user activities and anomalies
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="normal" 
                stroke="#22c55e" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="anomalous" 
                stroke="#ef4444" 
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// Fallback sample data
function getSampleData(): BehaviorData[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()

  return days.map((day, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (6 - i))
    return {
      name: day,
      normal: Math.floor(Math.random() * 3000) + 2000,
      anomalous: Math.floor(Math.random() * 1000) + 500,
      timestamp: date.toISOString()
    }
  })
}
