import { BaseService } from './base.service'

export interface Threat {
  id: string
  name: string
  description: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'mitigated' | 'resolved'
  source: string
  indicators: {
    type: string
    value: string
    confidence: number
  }[]
  affectedAssets: string[]
  lastUpdated: string
  mitigationSteps?: string[]
}

export class ThreatService extends BaseService {
  async getThreats() {
    try {
      const data = await this.liquidModel.getThreats()
      return this.transformThreats(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getThreatIntel() {
    try {
      const data = await this.liquidModel.getThreatIntel()
      return this.transformThreatIntel(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getThreatTrends() {
    try {
      const data = await this.liquidModel.getThreatTrends()
      return this.transformTrends(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  private transformThreats(data: any[]): Threat[] {
    return data.map(threat => ({
      id: threat.id,
      name: threat.name,
      description: threat.description,
      type: threat.type,
      severity: threat.severity.toLowerCase(),
      status: threat.status.toLowerCase(),
      source: threat.source,
      indicators: threat.indicators.map((indicator: any) => ({
        type: indicator.type,
        value: indicator.value,
        confidence: indicator.confidence
      })),
      affectedAssets: threat.affected_assets,
      lastUpdated: threat.last_updated,
      mitigationSteps: threat.mitigation_steps
    }))
  }

  private transformThreatIntel(data: any) {
    return {
      newThreats: data.new_threats_count,
      severityLevel: data.severity_level,
      severityScore: data.severity_score,
      lastUpdated: data.last_updated,
      trends: data.trends,
      recommendations: data.recommendations
    }
  }

  private transformTrends(data: any) {
    return {
      daily: data.daily_trends,
      weekly: data.weekly_trends,
      monthly: data.monthly_trends,
      byType: data.trends_by_type,
      bySeverity: data.trends_by_severity,
      predictions: data.predictions
    }
  }
}
