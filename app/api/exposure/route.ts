import { NextResponse } from 'next/server'
import { LiquidModel } from '@/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const exposureData = await liquidModel.getExposureData()
    
    return NextResponse.json({
      totalExposures: exposureData.total_exposures,
      criticalExposures: exposureData.critical_exposures,
      exposureScore: exposureData.exposure_score,
      categories: exposureData.exposure_categories.map((category: any) => ({
        name: category.name,
        count: category.count,
        severity: category.severity.toLowerCase()
      })),
      trends: exposureData.trends.map((trend: any) => ({
        period: trend.time_period,
        change: trend.percentage_change
      })),
      lastUpdated: exposureData.last_updated
    })
  } catch (error) {
    console.error('Error fetching exposure data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exposure data' },
      { status: 500 }
    )
  }
}
