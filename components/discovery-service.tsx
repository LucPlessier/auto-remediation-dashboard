"use client"

import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'

interface DiscoveryData {
  totalAssets: number
  newAssets: number
  scanProgress: number
  categories: Array<{
    name: string
    count: number
    percentage: number
  }>
  lastScanTime: string
  nextScanTime: string
}

export default function DiscoveryService() {
  const [data, setData] = useState<DiscoveryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/discovery')
        if (!response.ok) {
          throw new Error('Failed to fetch discovery data')
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
        <h3 className="text-lg font-semibold mb-4">Asset Discovery</h3>
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
        <h3 className="text-lg font-semibold mb-4">Asset Discovery</h3>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Asset Discovery</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl font-bold">{data.totalAssets}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Assets</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl font-bold">{data.newAssets}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">New Assets</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Scan Progress</span>
          <span className="text-sm text-gray-600">{data.scanProgress}%</span>
        </div>
        <Progress value={data.scanProgress} className="w-full" />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Asset Categories</h4>
          {data.categories.map((category, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{category.name}</span>
                <span className="text-sm text-gray-600">{category.count}</span>
              </div>
              <Progress value={category.percentage} className="w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 space-y-1">
        <div>Last Scan: {new Date(data.lastScanTime).toLocaleString()}</div>
        <div>Next Scan: {new Date(data.nextScanTime).toLocaleString()}</div>
      </div>
    </div>
  )
}
