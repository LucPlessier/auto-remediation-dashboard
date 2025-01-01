'use client'

import AttackPathVisualization from '@/components/attack-path-visualization'

export default function AttackPathsPage() {
  return (
    <div className="flex-1 p-8 space-y-8">
      <h1 className="text-2xl font-bold">Attack Path Analysis</h1>
      <AttackPathVisualization />
    </div>
  )
}
