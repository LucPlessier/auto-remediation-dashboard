import { NextResponse } from 'next/server'
import { LiquidModel } from '@/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const discoveryData = await liquidModel.getAssetDiscovery()
    
    return NextResponse.json({
      totalAssets: discoveryData.total_assets,
      newAssets: discoveryData.new_assets_count,
      scanProgress: discoveryData.scan_progress,
      categories: discoveryData.asset_categories.map((category: any) => ({
        name: category.name,
        count: category.count,
        percentage: (category.count / discoveryData.total_assets) * 100
      })),
      lastScanTime: discoveryData.last_scan_time,
      nextScanTime: discoveryData.next_scan_time
    })
  } catch (error) {
    console.error('Error fetching discovery data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch discovery data' },
      { status: 500 }
    )
  }
}
