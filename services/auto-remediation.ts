import prisma from "@/app/lib/prisma"
import { PrismaClient } from "@prisma/client"
import { z } from 'zod';

// Types
export interface RemediationStatus {
  isRunning: boolean
  activeRemediations: number
  completedRemediations: number
  failedRemediations: number
  lastUpdate: Date
  config: RemediationConfig
}

export interface RemediationConfig {
  safeImpactThreshold: number
  maxAffectedSystems: number
  riskThreshold: number
  systemicThreshold: number
  monitoringInterval: number
}

export class AutoRemediationService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prisma
  }

  async getStatus(): Promise<RemediationStatus> {
    try {
      // Get current status from database
      const status = await this.prisma.autoRemediationStatus.findFirst({
        orderBy: { timestamp: 'desc' },
      })

      // Get active remediations
      const activeCount = await this.prisma.remediation.count({
        where: { status: 'active' },
      })

      // Get completed remediations
      const completedCount = await this.prisma.remediation.count({
        where: { status: 'completed' },
      })

      // Get failed remediations
      const failedCount = await this.prisma.remediation.count({
        where: { status: 'failed' },
      })

      // Get current config
      const config = await this.getConfig();

      return {
        isRunning: status?.isRunning || false,
        activeRemediations: activeCount,
        completedRemediations: completedCount,
        failedRemediations: failedCount,
        lastUpdate: status?.timestamp || new Date(),
        config,
      }
    } catch (error) {
      console.error('Error getting auto-remediation status:', error)
      throw error
    }
  }

  async executeRemediation(data: any) {
    try {
      // For now, just log the data and return a success message
      console.log("Executing remediation with data:", data)
      return { success: true, message: "Remediation executed successfully" }
    } catch (error) {
      console.error('Error executing remediation:', error)
      throw error
    }
  }

  async updateStatus(status: { remediationId: string; status: string; details?: Record<string, unknown> }): Promise<void> {
    try {
      // Update remediation status in database
      await this.prisma.remediation.update({
        where: { id: status.remediationId },
        data: {
          status: status.status,
          details: status.details || {},
          lastUpdate: new Date(),
        },
      })

      // If remediation failed, create an incident
      if (status.status === 'failed') {
        await this.createIncident(status.remediationId, status.details);
      }
    } catch (error) {
      console.error('Error updating remediation status:', error)
      throw error
    }
  }

  private async getConfig(): Promise<RemediationConfig> {
    const config = await this.prisma.autoRemediationConfig.findFirst({
      orderBy: { timestamp: 'desc' },
    });

    return config || {
      safeImpactThreshold: 0.5,
      maxAffectedSystems: 10,
      riskThreshold: 0.7,
      systemicThreshold: 0.8,
      monitoringInterval: 300,
    };
  }

  private async createIncident(remediationId: string, details?: Record<string, unknown>): Promise<void> {
    try {
      const remediation = await this.prisma.remediation.findUnique({
        where: { id: remediationId },
      });

      if (!remediation) {
        throw new Error('Remediation not found');
      }

      await this.prisma.incident.create({
        data: {
          title: `Auto-remediation failure: ${remediation.title}`,
          description: `Auto-remediation action failed.\nRemediation ID: ${remediationId}\nDetails: ${JSON.stringify(details, null, 2)}`,
          severity: 'high',
          status: 'open',
          type: 'auto_remediation_failure',
          remediationId,
        },
      });
    } catch (error) {
      console.error('Error creating incident for failed remediation:', error);
      throw error;
    }
  }
}
