import { NextResponse } from 'next/server'
import { LiquidModel } from '@/app/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const riskData = await liquidModel.getRiskOverview()
    
    return NextResponse.json({
      overallScore: riskData.overall_score,
      metrics: riskData.metrics.map((metric: any) => ({
        category: metric.category,
        score: metric.score,
        trend: metric.trend.toLowerCase(),
        previousScore: metric.previous_score
      })),
      lastUpdated: riskData.last_updated
    })
  } catch (error) {
    console.error('Error fetching risk overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch risk overview' },
      { status: 500 }
    )
  }
}
