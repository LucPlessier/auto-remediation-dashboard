import { WebSocketServer } from 'ws'
import { LiquidModel } from '../lib/liquid-model'

export class WebSocketManager {
  private wss: WebSocketServer
  private liquidModel: LiquidModel

  constructor(server: any) {
    this.wss = new WebSocketServer({ server })
    this.liquidModel = new LiquidModel()
    this.initialize()
  }

  private initialize() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected')

      // Set up real-time alerts
      const alertInterval = setInterval(async () => {
        try {
          const alerts = await this.liquidModel.getAlerts()
          ws.send(JSON.stringify({ type: 'alerts', data: alerts }))
        } catch (error) {
          console.error('Error fetching alerts:', error)
        }
      }, 5000)

      // Set up real-time threat intel
      const threatInterval = setInterval(async () => {
        try {
          const threats = await this.liquidModel.getThreats()
          ws.send(JSON.stringify({ type: 'threats', data: threats }))
        } catch (error) {
          console.error('Error fetching threats:', error)
        }
      }, 10000)

      // Set up real-time user behavior
      const behaviorInterval = setInterval(async () => {
        try {
          const behavior = await this.liquidModel.getUserActivities()
          ws.send(JSON.stringify({ type: 'behavior', data: behavior }))
        } catch (error) {
          console.error('Error fetching user behavior:', error)
        }
      }, 15000)

      ws.on('close', () => {
        console.log('Client disconnected')
        clearInterval(alertInterval)
        clearInterval(threatInterval)
        clearInterval(behaviorInterval)
      })
    })
  }
}
