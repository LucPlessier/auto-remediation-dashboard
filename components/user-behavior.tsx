"use client"

import React from 'react'

interface UserBehaviorProps {
  data?: {
    activities: Array<{
      id: string
      user: string
      action: string
      risk: 'High' | 'Medium' | 'Low'
      time: string
    }>
  }
}

export default function UserBehavior({ 
  data = {
    activities: [
      { id: '1', user: 'john.doe', action: 'Unusual login pattern', risk: 'High', time: '5 mins ago' },
      { id: '2', user: 'jane.smith', action: 'Multiple failed attempts', risk: 'Medium', time: '15 mins ago' },
      { id: '3', user: 'bob.wilson', action: 'Access to sensitive data', risk: 'Low', time: '30 mins ago' }
    ]
  }
}: UserBehaviorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">User Behavior</h3>
      <div className="space-y-4">
        {data.activities.map((activity) => (
          <div key={activity.id} className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{activity.user}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                activity.risk === 'High' ? 'bg-red-100 text-red-800' :
                activity.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {activity.risk} Risk
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{activity.action}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
