export class LiquidModelClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_LIQUID_MODEL_API_URL || 'http://localhost:8000'
    this.headers = {
      'Content-Type': 'application/json',
    }
  }

  async getAttackPaths() {
    const response = await this.request('/api/attack-paths')
    return response
  }

  async getThreats() {
    const response = await this.request('/api/threats')
    return response
  }

  async getVulnerabilities() {
    const response = await this.request('/api/vulnerabilities')
    return response
  }

  async startRemediation(threatId: string) {
    const response = await this.request('/api/auto-remediation', {
      method: 'POST',
      body: JSON.stringify({ threatId })
    })
    return response
  }

  async getStatus() {
    const response = await this.request('/api/auto-remediation')
    return response
  }

  async updateStatus(status: any) {
    const response = await this.request('/api/auto-remediation/status', {
      method: 'POST',
      body: JSON.stringify(status)
    })
    return response
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }
}
