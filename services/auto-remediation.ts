import { prisma } from '@/lib/prisma';
import { PythonShell } from 'python-shell';
import path from 'path';
import { z } from 'zod';

// Types
export interface RemediationStatus {
  isRunning: boolean;
  activeRemediations: number;
  completedRemediations: number;
  failedRemediations: number;
  lastUpdate: Date;
  config: RemediationConfig;
}

export interface RemediationConfig {
  safeImpactThreshold: number;
  maxAffectedSystems: number;
  riskThreshold: number;
  systemicThreshold: number;
  monitoringInterval: number;
}

export class AutoRemediationService {
  private pythonPath: string;
  private configPath: string;

  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python3';
    this.configPath = path.join(process.cwd(), 'auto_remediation_config.json');
  }

  async getStatus(): Promise<RemediationStatus> {
    try {
      // Get current status from database
      const status = await prisma.autoRemediationStatus.findFirst({
        orderBy: { timestamp: 'desc' },
      });

      // Get active remediations
      const activeCount = await prisma.remediation.count({
        where: { status: 'active' },
      });

      // Get completed remediations
      const completedCount = await prisma.remediation.count({
        where: { status: 'completed' },
      });

      // Get failed remediations
      const failedCount = await prisma.remediation.count({
        where: { status: 'failed' },
      });

      // Get current config
      const config = await this.getConfig();

      return {
        isRunning: status?.isRunning || false,
        activeRemediations: activeCount,
        completedRemediations: completedCount,
        failedRemediations: failedCount,
        lastUpdate: status?.timestamp || new Date(),
        config,
      };
    } catch (error) {
      console.error('Error getting auto-remediation status:', error);
      throw error;
    }
  }

  async updateConfig(config: RemediationConfig): Promise<void> {
    try {
      // Update config in database
      await prisma.autoRemediationConfig.create({
        data: {
          ...config,
          timestamp: new Date(),
        },
      });

      // Update Python config
      await this.updatePythonConfig(config);

      // Restart the auto-remediation service
      await this.restartService();
    } catch (error) {
      console.error('Error updating auto-remediation config:', error);
      throw error;
    }
  }

  async updateStatus(status: { remediationId: string; status: string; details?: Record<string, unknown> }): Promise<void> {
    try {
      // Update remediation status in database
      await prisma.remediation.update({
        where: { id: status.remediationId },
        data: {
          status: status.status,
          details: status.details || {},
          lastUpdate: new Date(),
        },
      });

      // If remediation failed, create an incident
      if (status.status === 'failed') {
        await this.createIncident(status.remediationId, status.details);
      }
    } catch (error) {
      console.error('Error updating remediation status:', error);
      throw error;
    }
  }

  private async getConfig(): Promise<RemediationConfig> {
    const config = await prisma.autoRemediationConfig.findFirst({
      orderBy: { timestamp: 'desc' },
    });

    return config || {
      safeImpactThreshold: 0.3,
      maxAffectedSystems: 3,
      riskThreshold: 0.7,
      systemicThreshold: 0.8,
      monitoringInterval: 300,
    };
  }

  private async updatePythonConfig(config: RemediationConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      PythonShell.run(
        'update_config.py',
        {
          pythonPath: this.pythonPath,
          args: [JSON.stringify(config)],
        },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  private async restartService(): Promise<void> {
    return new Promise((resolve, reject) => {
      PythonShell.run(
        'restart_service.py',
        {
          pythonPath: this.pythonPath,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  private async createIncident(remediationId: string, details?: Record<string, unknown>): Promise<void> {
    try {
      const remediation = await prisma.remediation.findUnique({
        where: { id: remediationId },
      });

      if (!remediation) {
        throw new Error('Remediation not found');
      }

      await prisma.incident.create({
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
