import { BaseService } from './base.service'

export interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  timestamp: string
  acknowledged: boolean
  relatedEntities?: {
    type: string
    id: string
    name: string
  }[]
}

export class AlertService extends BaseService {
  async getAlerts() {
    try {
      const data = await this.liquidModel.getAlerts()
      return this.transformAlerts(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async acknowledgeAlert(alertId: string) {
    try {
      await this.liquidModel.acknowledgeAlert(alertId)
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async dismissAlert(alertId: string) {
    try {
      await this.liquidModel.dismissAlert(alertId)
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAlertDetails(alertId: string) {
    try {
      const data = await this.liquidModel.getAlertDetails(alertId)
      return this.transformAlertDetails(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  private transformAlerts(data: any[]): Alert[] {
    return data.map(alert => ({
      id: alert.id,
      title: alert.title,
      message: alert.message,
      type: alert.type.toLowerCase(),
      severity: alert.severity.toLowerCase(),
      source: alert.source,
      timestamp: alert.timestamp,
      acknowledged: alert.acknowledged,
      relatedEntities: alert.related_entities?.map((entity: any) => ({
        type: entity.type,
        id: entity.id,
        name: entity.name
      }))
    }))
  }

  private transformAlertDetails(data: any) {
    return {
      ...this.transformAlerts([data])[0],
      details: {
        description: data.detailed_description,
        recommendations: data.recommendations,
        affectedSystems: data.affected_systems,
        timeline: data.event_timeline,
        relatedAlerts: data.related_alerts
      }
    }
  }

  // WebSocket connection for real-time alerts
  subscribeToAlerts(callback: (alert: Alert) => void) {
    const ws = new WebSocket('ws://your-websocket-url/alerts')
    
    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data)
      callback(this.transformAlerts([alert])[0])
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => ws.close() // Return cleanup function
  }
}
