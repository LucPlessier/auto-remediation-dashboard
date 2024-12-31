import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    // Get metrics from SecurityMetric model
    const metrics = await prisma.securityMetric.findMany({
      where: { category: 'user_behavior' },
      orderBy: { timestamp: 'desc' },
      take: 30,
    })

    // Calculate risk score based on metrics
    const riskScore = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length || 0

    // Mock data for now
    const response = {
      riskScore: Math.round(riskScore * 100) / 100,
      anomalies: [
        {
          type: 'login',
          description: 'Multiple failed login attempts',
          severity: 'high',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'access',
          description: 'Unusual file access pattern',
          severity: 'medium',
          timestamp: new Date().toISOString(),
        },
      ],
      trends: {
        daily: [
          { timestamp: new Date().toISOString(), score: 75 },
          { timestamp: new Date(Date.now() - 86400000).toISOString(), score: 82 },
        ],
        weekly: [
          { timestamp: new Date().toISOString(), score: 78 },
          { timestamp: new Date(Date.now() - 604800000).toISOString(), score: 85 },
        ],
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user behavior data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user behavior data' },
      { status: 500 }
    )
  }
}
