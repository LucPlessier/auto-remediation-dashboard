import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { AutoRemediationService } from '@/services/auto-remediation';

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const remediationService = new AutoRemediationService();
    const status = await remediationService.getStatus();
    
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const config = RemediationConfigSchema.parse(data);

    const remediationService = new AutoRemediationService();
    await remediationService.updateConfig(config);

    return new NextResponse('Configuration updated', { status: 200 });
  } catch (error) {
    console.error('Error updating auto-remediation config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const status = RemediationStatusSchema.parse(data);

    const remediationService = new AutoRemediationService();
    await remediationService.updateStatus(status);

    return new NextResponse('Status updated', { status: 200 });
  } catch (error) {
    console.error('Error updating remediation status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
