import { NextResponse } from 'next/server'
import { LiquidModel } from '@/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const threatData = await liquidModel.getThreatIntelligence()
    
    return NextResponse.json({
      newThreats: threatData.new_threats_count,
      totalThreats: threatData.total_threats,
      severityLevel: threatData.overall_severity.toLowerCase(),
      severityScore: threatData.severity_score,
      categories: threatData.threat_categories.map((category: any) => ({
        name: category.name,
        count: category.count,
        severity: category.severity.toLowerCase()
      })),
      recentActivity: threatData.recent_activity.map((activity: any) => ({
        type: activity.type,
        timestamp: activity.timestamp,
        description: activity.description,
        severity: activity.severity.toLowerCase()
      })),
      lastUpdated: threatData.last_updated
    })
  } catch (error) {
    console.error('Error fetching threat data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threat intelligence data' },
      { status: 500 }
    )
  }
}
