"use client"

import React from 'react'

interface AutoRemediationPanelProps {
  settings?: {
    enabled: boolean
    threshold: number
    autoApprove: boolean
  }
}

export default function AutoRemediationPanel({ 
  settings = {
    enabled: true,
    threshold: 75,
    autoApprove: false
  }
}: AutoRemediationPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Auto-Remediation Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium">Enable Auto-Remediation</label>
            <p className="text-sm text-gray-500">Automatically fix security issues</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 relative">
            <div className={`h-5 w-5 rounded-full transition-transform absolute top-0.5 left-0.5 ${
              settings.enabled ? 'bg-blue-500 translate-x-5' : 'bg-gray-400'
            }`} />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">Risk Threshold</label>
            <span className="text-sm text-gray-600">{settings.threshold}%</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ width: `${settings.threshold}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium">Auto-Approve Fixes</label>
            <p className="text-sm text-gray-500">Skip manual approval step</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 relative">
            <div className={`h-5 w-5 rounded-full transition-transform absolute top-0.5 left-0.5 ${
              settings.autoApprove ? 'bg-blue-500 translate-x-5' : 'bg-gray-400'
            }`} />
          </div>
        </div>
      </div>
    </div>
  )
}
