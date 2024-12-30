"use client"

import React from 'react'

interface DiscoveryServiceProps {
  data?: {
    assets: Array<{
      id: string
      name: string
      type: string
      status: string
      lastSeen: string
    }>
  }
}

export default function DiscoveryService({ 
  data = {
    assets: [
      { id: '1', name: 'Web Server', type: 'Server', status: 'Active', lastSeen: '2 mins ago' },
      { id: '2', name: 'Database', type: 'Database', status: 'Active', lastSeen: '5 mins ago' },
      { id: '3', name: 'Load Balancer', type: 'Network', status: 'Warning', lastSeen: '15 mins ago' }
    ]
  }
}: DiscoveryServiceProps) {
  return (
    <div className="col-span-4 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Asset Discovery</h3>
      <div className="space-y-4">
        {data.assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="font-medium">{asset.name}</h4>
              <p className="text-sm text-gray-500">{asset.type}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                asset.status === 'Active' ? 'bg-green-100 text-green-800' :
                asset.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {asset.status}
              </span>
              <p className="text-sm text-gray-500 mt-1">{asset.lastSeen}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
