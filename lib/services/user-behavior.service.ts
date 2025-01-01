import { LiquidModelService } from "@/services/liquid-model-service"

export interface UserBehaviorEvent {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  risk: number
  anomalyScore: number
  details: {
    location: string
    device: string
    success: boolean
    additionalInfo?: any
  }
}

export class UserBehaviorService {
  private static instance: UserBehaviorService
  private liquidModel: LiquidModelService

  private constructor() {
    this.liquidModel = LiquidModelService.getInstance()
  }

  public static getInstance(): UserBehaviorService {
    if (!UserBehaviorService.instance) {
      UserBehaviorService.instance = new UserBehaviorService()
    }
    return UserBehaviorService.instance
  }

  async getUserBehaviorEvents(): Promise<UserBehaviorEvent[]> {
    // In production, this would call the Liquid Model API
    return [
      {
        id: "ube-001",
        timestamp: new Date().toISOString(),
        userId: "john.doe@example.com",
        action: "FILE_ACCESS",
        resource: "/confidential/financial-reports/2024",
        risk: 0.8,
        anomalyScore: 0.75,
        details: {
          location: "Unusual Location",
          device: "Unknown Device",
          success: true,
          additionalInfo: {
            previousAccess: "Never",
            timeOfDay: "Outside Normal Hours"
          }
        }
      },
      {
        id: "ube-002",
        timestamp: new Date().toISOString(),
        userId: "alice.smith@example.com",
        action: "ADMIN_ACCESS",
        resource: "AWS Console",
        risk: 0.6,
        anomalyScore: 0.45,
        details: {
          location: "Office",
          device: "Registered Laptop",
          success: true,
          additionalInfo: {
            previousAccess: "Regular",
            timeOfDay: "Business Hours"
          }
        }
      }
    ]
  }

  async getAnomalyScore(userId: string): Promise<number> {
    // In production, this would calculate using the Liquid Model
    return Math.random()
  }

  async getRiskScore(userId: string): Promise<number> {
    // In production, this would calculate using the Liquid Model
    return Math.random() * 100
  }
}
