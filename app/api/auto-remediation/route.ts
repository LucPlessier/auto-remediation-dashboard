import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { autoRemediationService } from "@/services/auto-remediation"
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
    const service = new autoRemediationService()
    const status = await service.getStatus()

    // Get historical metrics
    const metrics = await prisma.securityMetric.findMany({
      where: { category: 'remediation' },
      orderBy: { timestamp: 'desc' },
      take: 30, // Last 30 data points
    })

    return NextResponse.json({
      ...status,
      metrics
    })
  } catch (error) {
    console.error('Error fetching auto-remediation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch auto-remediation status' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const service = new autoRemediationService()
    const result = await service.executeRemediation(data)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in auto-remediation:", error)
    return NextResponse.json(
      { error: "Failed to execute auto-remediation" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const status = RemediationStatusSchema.parse(data)
    
    const service = new autoRemediationService()
    await service.updateStatus(status)

    return new NextResponse('Status updated', { status: 200 })
  } catch (error) {
    console.error("Error updating auto-remediation status:", error)
    return new NextResponse('Invalid status data', { status: 400 })
  }
}
