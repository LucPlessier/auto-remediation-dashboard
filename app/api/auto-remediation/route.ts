import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { AutoRemediation } from "@/services/auto-remediation"

// Validation schemas
const RemediationStatusSchema = z.object({
  remediationId: z.string(),
  status: z.enum(['active', 'completed', 'failed']),
  details: z.record(z.unknown()).optional(),
});

const RemediationConfigSchema = z.object({
  safeImpactThreshold: z.number().min(0).max(1),
  maxAffectedSystems: z.number().min(1),
  riskThreshold: z.number().min(0).max(1),
  systemicThreshold: z.number().min(0).max(1),
  monitoringInterval: z.number().min(60), // minimum 1 minute
});

export async function GET() {
  try {
    const autoRemediation = new AutoRemediation()
    const status = await autoRemediation.getStatus();
    
    // Get historical metrics
    const metrics = await prisma.remediationMetrics.findMany({
      orderBy: { timestamp: 'desc' },
      take: 30, // Last 30 data points
    });

    return NextResponse.json({
      ...status,
      metrics: metrics.map(m => ({
        timestamp: m.timestamp.toISOString(),
        activeCount: m.activeCount,
        completedCount: m.completedCount,
        failedCount: m.failedCount,
        riskScore: m.riskScore,
      })),
    });
  } catch (error) {
    console.error('Error fetching auto-remediation status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const autoRemediation = new AutoRemediation()
    const result = await autoRemediation.executeRemediation(data)
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
    const status = RemediationStatusSchema.parse(data);

    const autoRemediation = new AutoRemediation()
    await autoRemediation.updateStatus(status);

    return new NextResponse('Status updated', { status: 200 });
  } catch (error) {
    console.error('Error updating remediation status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
