"use client"

import React from 'react'

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

export default function AttackPathAnalysis({ 
  data = {
    paths: [
      { id: '1', name: 'Critical Infrastructure Access', risk: 85, steps: 4 },
      { id: '2', name: 'Data Exfiltration Route', risk: 75, steps: 3 },
      { id: '3', name: 'Privilege Escalation Path', risk: 65, steps: 5 }
    ]
  } 
}: AttackPathAnalysisProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Attack Path Analysis</h3>
      <div className="space-y-4">
        {data.paths.map((path) => (
          <div key={path.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{path.name}</h4>
              <span className={`px-2 py-1 rounded text-sm ${
                path.risk >= 80 ? 'bg-red-100 text-red-800' :
                path.risk >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
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
          </div>
        ))}
      </div>
    </div>
  )
}
