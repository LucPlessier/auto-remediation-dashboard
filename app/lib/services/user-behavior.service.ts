import { BaseService } from './base.service'

export interface UserActivity {
  id: string
  userId: string
  username: string
  action: string
  resource: string
  timestamp: string
  riskScore: number
  anomalyScore: number
  location: {
    ip: string
    country: string
    city: string
  }
  device: {
    type: string
    os: string
    browser: string
  }
}

export interface UserRiskProfile {
  userId: string
  username: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskFactors: {
    factor: string
    score: number
    description: string
  }[]
  recommendations: string[]
  lastUpdated: string
}

export interface AnalyticsData {
  timestamp: string
  normal_activities: number
  anomalous_activities: number
}

export class UserBehaviorService extends BaseService {
  async getUserActivities(timeRange: string = '24h') {
    try {
      const data = await this.liquidModel.getUserActivities(timeRange)
      return this.transformActivities(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getUserRiskProfiles() {
    try {
      const data = await this.liquidModel.getUserRiskProfiles()
      return this.transformRiskProfiles(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAnomalyDetection() {
    try {
      const data = await this.liquidModel.getAnomalyDetection()
      return this.transformAnomalies(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAnalytics(): Promise<AnalyticsData[]> {
    try {
      const data = await this.liquidModel.getAnalytics()
      return data.map((item: any) => ({
        timestamp: item.timestamp,
        normal_activities: item.normal_count || 0,
        anomalous_activities: item.anomalous_count || 0
      }))
    } catch (error) {
      this.handleError(error)
      return []
    }
  }

  private transformActivities(data: any[]): UserActivity[] {
    return data.map(activity => ({
      id: activity.id,
      userId: activity.user_id,
      username: activity.username,
      action: activity.action,
      resource: activity.resource,
      timestamp: activity.timestamp,
      riskScore: activity.risk_score,
      anomalyScore: activity.anomaly_score,
      location: {
        ip: activity.location.ip,
        country: activity.location.country,
        city: activity.location.city
      },
      device: {
        type: activity.device.type,
        os: activity.device.os,
        browser: activity.device.browser
      }
    }))
  }

  private transformRiskProfiles(data: any[]): UserRiskProfile[] {
    return data.map(profile => ({
      userId: profile.user_id,
      username: profile.username,
      riskLevel: profile.risk_level.toLowerCase(),
      riskFactors: profile.risk_factors.map((factor: any) => ({
        factor: factor.name,
        score: factor.score,
        description: factor.description
      })),
      recommendations: profile.recommendations,
      lastUpdated: profile.last_updated
    }))
  }

  private transformAnomalies(data: any) {
    return {
      anomalies: data.detected_anomalies,
      totalScore: data.total_anomaly_score,
      threshold: data.anomaly_threshold,
      recommendations: data.recommendations
    }
  }
}
