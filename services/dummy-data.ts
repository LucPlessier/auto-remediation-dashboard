import { RemediationStatus, RemediationConfig } from './auto-remediation'

export interface DummyThreat {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  affectedSystems: string[]
  status: 'active' | 'mitigated' | 'investigating'
  details: Record<string, unknown>
}

export interface DummyRemediation {
  id: string
  threatId: string
  status: 'active' | 'completed' | 'failed'
  details: Record<string, unknown>
  timestamp: Date
  affectedSystems: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export class DummyDataService {
  private threats: DummyThreat[] = [
    {
      id: 'threat-001',
      type: 'ransomware',
      severity: 'critical',
      description: 'Potential ransomware activity detected in marketing department',
      timestamp: new Date(),
      affectedSystems: ['MKTG-001', 'MKTG-002'],
      status: 'active',
      details: {
        indicators: ['encrypted files', 'suspicious network traffic'],
        location: 'marketing-subnet',
      },
    },
    {
      id: 'threat-002',
      type: 'data_exfiltration',
      severity: 'high',
      description: 'Unusual data transfer patterns detected',
      timestamp: new Date(),
      affectedSystems: ['HR-001'],
      status: 'investigating',
      details: {
        dataType: 'employee records',
        volume: '2.3GB',
      },
    },
  ]

  private remediations: DummyRemediation[] = [
    {
      id: 'rem-001',
      threatId: 'threat-001',
      status: 'active',
      details: {
        action: 'isolate_systems',
        progress: 0.6,
      },
      timestamp: new Date(),
      affectedSystems: 2,
      riskLevel: 'critical',
    },
  ]

  private config: RemediationConfig = {
    safeImpactThreshold: 0.7,
    maxAffectedSystems: 10,
    riskThreshold: 0.8,
    systemicThreshold: 0.6,
    monitoringInterval: 300,
  }

  getThreats(): DummyThreat[] {
    return this.threats
  }

  getThreat(id: string): DummyThreat | undefined {
    return this.threats.find(t => t.id === id)
  }

  getRemediations(): DummyRemediation[] {
    return this.remediations
  }

  getRemediation(id: string): DummyRemediation | undefined {
    return this.remediations.find(r => r.id === id)
  }

  getRemediationStatus(): RemediationStatus {
    const activeCount = this.remediations.filter(r => r.status === 'active').length
    const completedCount = this.remediations.filter(r => r.status === 'completed').length
    const failedCount = this.remediations.filter(r => r.status === 'failed').length

    return {
      isRunning: activeCount > 0,
      activeRemediations: activeCount,
      completedRemediations: completedCount,
      failedRemediations: failedCount,
      lastUpdate: new Date(),
      config: this.config,
    }
  }

  executeRemediation(threatId: string): DummyRemediation {
    const threat = this.getThreat(threatId)
    if (!threat) {
      throw new Error(`Threat ${threatId} not found`)
    }

    const remediation: DummyRemediation = {
      id: `rem-${Date.now()}`,
      threatId,
      status: 'active',
      details: {
        action: this.getRemediationAction(threat),
        progress: 0,
      },
      timestamp: new Date(),
      affectedSystems: threat.affectedSystems.length,
      riskLevel: threat.severity,
    }

    this.remediations.push(remediation)
    return remediation
  }

  updateRemediationStatus(
    remediationId: string,
    status: 'active' | 'completed' | 'failed',
    details?: Record<string, unknown>
  ): void {
    const remediation = this.getRemediation(remediationId)
    if (!remediation) {
      throw new Error(`Remediation ${remediationId} not found`)
    }

    remediation.status = status
    if (details) {
      remediation.details = { ...remediation.details, ...details }
    }
  }

  private getRemediationAction(threat: DummyThreat): string {
    switch (threat.type) {
      case 'ransomware':
        return 'isolate_systems'
      case 'data_exfiltration':
        return 'block_traffic'
      default:
        return 'investigate'
    }
  }
}
