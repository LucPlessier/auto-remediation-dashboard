import { NextResponse } from 'next/server'
import { LiquidModel } from '@/app/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const { alerts } = await liquidModel.getAlerts()
    return NextResponse.json({ 
      notifications: alerts,
      unreadCount: alerts.filter((n: any) => !n.acknowledged).length 
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}
