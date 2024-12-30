"use client"

import React from 'react'

interface ThreatIntelProps {
  data?: {
    threats: Array<{
      id: string
      name: string
      type: string
      severity: 'Critical' | 'High' | 'Medium' | 'Low'
      source: string
    }>
  }
}

export default function ThreatIntel({ 
  data = {
    threats: [
      { id: '1', name: 'Ransomware Campaign', type: 'Malware', severity: 'Critical', source: 'Dark Web' },
      { id: '2', name: 'Zero-Day Exploit', type: 'Vulnerability', severity: 'High', source: 'CISA' },
      { id: '3', name: 'Phishing Attack', type: 'Social Engineering', severity: 'Medium', source: 'Internal' }
    ]
  }
}: ThreatIntelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Threat Intelligence</h3>
      <div className="space-y-4">
        {data.threats.map((threat) => (
          <div key={threat.id} className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{threat.name}</h4>
              <span className={`px-2 py-1 rounded text-sm ${
                threat.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                threat.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                threat.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {threat.severity}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{threat.type}</span>
              <span className="text-gray-500">Source: {threat.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
