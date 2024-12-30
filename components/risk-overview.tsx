"use client"

import React from 'react'

interface RiskOverviewProps {
  data?: {
    metrics: Array<{
      id: string
      name: string
      value: number
      trend: 'up' | 'down' | 'stable'
      change: number
    }>
  }
}

export default function RiskOverview({ 
  data = {
    metrics: [
      { id: '1', name: 'Overall Risk Score', value: 78, trend: 'down', change: 5 },
      { id: '2', name: 'Critical Issues', value: 12, trend: 'up', change: 3 },
      { id: '3', name: 'Active Threats', value: 25, trend: 'stable', change: 0 }
    ]
  }
}: RiskOverviewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Risk Overview</h3>
      <div className="space-y-4">
        {data.metrics.map((metric) => (
          <div key={metric.id} className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{metric.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-red-500' :
                  metric.trend === 'down' ? 'text-green-500' :
                  'text-gray-500'
                }`}>
                  {metric.trend === 'up' ? '↑' :
                   metric.trend === 'down' ? '↓' :
                   '→'}
                  {metric.change > 0 ? `+${metric.change}` : metric.change}
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div 
                className={`absolute h-full rounded-full ${
                  metric.value >= 80 ? 'bg-red-500' :
                  metric.value >= 60 ? 'bg-orange-500' :
                  metric.value >= 40 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
