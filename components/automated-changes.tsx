"use client"

import React from 'react'

interface AutomatedChangesProps {
  data?: {
    changes: Array<{
      id: string
      type: string
      target: string
      status: 'Completed' | 'In Progress' | 'Failed'
      time: string
      impact: 'High' | 'Medium' | 'Low'
    }>
  }
}

export default function AutomatedChanges({ 
  data = {
    changes: [
      { id: '1', type: 'Firewall Rule Update', target: 'Edge Router', status: 'Completed', time: '5 mins ago', impact: 'High' },
      { id: '2', type: 'Access Policy Change', target: 'IAM System', status: 'In Progress', time: '10 mins ago', impact: 'Medium' },
      { id: '3', type: 'Security Patch', target: 'Web Server', status: 'Failed', time: '15 mins ago', impact: 'High' }
    ]
  }
}: AutomatedChangesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Automated Changes</h3>
      <div className="space-y-4">
        {data.changes.map((change) => (
          <div key={change.id} className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{change.type}</h4>
                <p className="text-sm text-gray-600">Target: {change.target}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-sm mb-1 ${
                  change.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  change.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {change.status}
                </span>
                <span className={`text-xs ${
                  change.impact === 'High' ? 'text-red-500' :
                  change.impact === 'Medium' ? 'text-orange-500' :
                  'text-green-500'
                }`}>
                  {change.impact} Impact
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">{change.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
