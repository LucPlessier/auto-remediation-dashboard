import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { LiquidModelService } from '@/services/liquid-model-service'
import { z } from 'zod'

// Validation schemas
const RemediationStatusSchema = z.object({
  remediationId: z.string(),
  status: z.enum(['active', 'completed', 'failed']),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime(),
  affectedSystems: z.number(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical'])
})

const RemediationConfigSchema = z.object({
  safeImpactThreshold: z.number().min(0).max(1),
  maxAffectedSystems: z.number().min(1),
  riskThreshold: z.number().min(0).max(1),
  systemicThreshold: z.number().min(0).max(1),
  monitoringInterval: z.number().min(60), // minimum 1 minute
});

export async function GET() {
  try {
    const liquidModel = LiquidModelService.getInstance()
    const status = await liquidModel.getStatus()

    // Get historical metrics
    const metrics = await prisma.autoRemediationMetrics.findMany({
      take: 7,
      orderBy: { timestamp: 'desc' }
    })

    return NextResponse.json({ status, metrics })
  } catch (error) {
    console.error('Error in auto-remediation GET:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { threatId } = await request.json()
    if (!threatId) {
      return new NextResponse('Missing threatId', { status: 400 })
    }

    const liquidModel = LiquidModelService.getInstance()
    const result = await liquidModel.startRemediation(threatId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error starting remediation:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const status = RemediationStatusSchema.parse(data)
    
    const liquidModel = LiquidModelService.getInstance()
    await liquidModel.updateStatus(status)

    return new NextResponse('Status updated', { status: 200 })
  } catch (error) {
    console.error('Error in auto-remediation PUT:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
