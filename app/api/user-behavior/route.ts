import { NextResponse } from 'next/server'
import { LiquidModel } from '@/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const userBehaviorData = await liquidModel.getUserBehavior()
    
    return NextResponse.json({
      riskScore: userBehaviorData.risk_score,
      totalUsers: userBehaviorData.total_users,
      activeUsers: userBehaviorData.active_users,
      categories: userBehaviorData.behavior_categories.map((category: any) => ({
        name: category.name,
        count: category.count,
        riskLevel: category.risk_level.toLowerCase()
      })),
      recentActivities: userBehaviorData.recent_activities.map((activity: any) => ({
        user: activity.username,
        action: activity.action,
        timestamp: activity.timestamp,
        riskLevel: activity.risk_level.toLowerCase()
      })),
      lastUpdated: userBehaviorData.last_updated
    })
  } catch (error) {
    console.error('Error fetching user behavior data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user behavior data' },
      { status: 500 }
    )
  }
}
