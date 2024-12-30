import { LiquidModel } from '@/lib/liquid-model'

export class BaseService {
  protected liquidModel: LiquidModel

  constructor() {
    this.liquidModel = new LiquidModel()
  }

  protected async get(endpoint: string) {
    const response = await fetch(`/api/${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  protected async post(endpoint: string, data: any) {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  protected handleError(error: any) {
    console.error('Service error:', error)
    throw error
  }
}
