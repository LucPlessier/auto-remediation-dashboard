"use client"

import React, { useEffect, useState } from 'react'

interface ThreatData {
  newThreats: number
  totalThreats: number
  severityLevel: string
  severityScore: number
  categories: Array<{
    name: string
    count: number
    severity: string
  }>
  recentActivity: Array<{
    type: string
    timestamp: string
    description: string
    severity: string
  }>
  lastUpdated: string
}

export default function ThreatIntel() {
  const [data, setData] = useState<ThreatData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/threats')
        if (!response.ok) {
          throw new Error('Failed to fetch threat data')
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Threat Intelligence</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Threat Intelligence</h3>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Threat Intelligence</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl font-bold">{data.newThreats}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">New Threats</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl font-bold">{data.totalThreats}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Threats</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h4 className="font-medium mb-2">Threat Categories</h4>
          {data.categories.map((category, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{category.name}</span>
              <div className="flex items-center">
                <span className="mr-2">{category.count}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  category.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  category.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  category.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {category.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Recent Activity</h4>
          {data.recentActivity.map((activity, index) => (
            <div key={index} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{activity.type}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  activity.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  activity.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  activity.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {activity.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  )
}
