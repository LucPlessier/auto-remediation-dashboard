import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    
    // Mock profile data
    const profile = {
      id: user?.id || 'default',
      name: user?.name || 'Demo User',
      email: user?.email || 'demo@example.com',
      role: 'Admin',
      department: 'Security',
      lastLogin: new Date().toISOString(),
      permissions: [
        'dashboard.view',
        'threats.manage',
        'assets.manage',
        'users.view',
      ],
      settings: {
        theme: 'light',
        notifications: true,
        twoFactorEnabled: true
      }
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
