import { NextResponse } from 'next/server'
import { LiquidModel } from '@/app/lib/liquid-model'

export async function GET() {
  try {
    const liquidModel = new LiquidModel()
    const profile = await liquidModel.getUserProfile()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }
}
