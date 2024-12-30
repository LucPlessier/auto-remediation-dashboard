"use client"

import React from 'react'

interface ExposureMonitoringProps {
  data?: {
    exposures: Array<{
      id: string
      type: string
      severity: 'Critical' | 'High' | 'Medium' | 'Low'
      details: string
      timestamp: string
    }>
  }
}

export default function ExposureMonitoring({ 
  data = {
    exposures: [
      { id: '1', type: 'Open Port', severity: 'Critical', details: 'Port 22 exposed', timestamp: '5 mins ago' },
      { id: '2', type: 'Misconfiguration', severity: 'High', details: 'Public S3 bucket', timestamp: '15 mins ago' },
      { id: '3', type: 'Vulnerability', severity: 'Medium', details: 'Outdated SSL', timestamp: '1 hour ago' }
    ]
  }
}: ExposureMonitoringProps) {
  return (
    <div className="col-span-3 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Exposure Monitoring</h3>
      <div className="space-y-4">
        {data.exposures.map((exposure) => (
          <div key={exposure.id} className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{exposure.type}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                exposure.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                exposure.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                exposure.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {exposure.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{exposure.details}</p>
            <p className="text-xs text-gray-500">Detected {exposure.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
