import { LiquidModelClient } from '@/lib/liquid-model-client'

export class LiquidModelService {
  private static instance: LiquidModelService
  private client: LiquidModelClient

  private constructor() {
    this.client = new LiquidModelClient()
  }

  public static getInstance(): LiquidModelService {
    if (!LiquidModelService.instance) {
      LiquidModelService.instance = new LiquidModelService()
    }
    return LiquidModelService.instance
  }

  async getAttackPaths() {
    try {
      const response = await this.client.getAttackPaths()
      return this.transformAttackPaths(response)
    } catch (error) {
      console.error('Error fetching attack paths:', error)
      throw error
    }
  }

  async getThreats() {
    try {
      const response = await this.client.getThreats()
      return this.transformThreats(response)
    } catch (error) {
      console.error('Error fetching threats:', error)
      throw error
    }
  }

  async getVulnerabilities() {
    try {
      const response = await this.client.getVulnerabilities()
      return this.transformVulnerabilities(response)
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error)
      throw error
    }
  }

  async startRemediation(threatId: string) {
    try {
      return await this.client.startRemediation(threatId)
    } catch (error) {
      console.error('Error starting remediation:', error)
      throw error
    }
  }

  async getStatus() {
    try {
      return await this.client.getStatus()
    } catch (error) {
      console.error('Error getting status:', error)
      throw error
    }
  }

  async updateStatus(status: any) {
    try {
      return await this.client.updateStatus(status)
    } catch (error) {
      console.error('Error updating status:', error)
      throw error
    }
  }

  private transformAttackPaths(data: any) {
    // Transform Liquid Model attack path data to UI format
    return {
      nodes: data.nodes.map((node: any) => ({
        id: node.id,
        type: this.mapNodeType(node.type),
        label: node.name,
        details: node.details,
        risk: node.risk_score
      })),
      edges: data.edges.map((edge: any) => ({
        source: edge.source,
        target: edge.target,
        probability: edge.probability,
        type: this.mapEdgeType(edge.type)
      }))
    }
  }

  private transformThreats(data: any) {
    // Transform Liquid Model threat data to UI format
    return data.map((threat: any) => ({
      id: threat.id,
      type: threat.type,
      severity: this.mapSeverity(threat.severity),
      description: threat.description,
      timestamp: threat.timestamp,
      affectedSystems: threat.affected_systems,
      status: threat.status
    }))
  }

  private transformVulnerabilities(data: any) {
    // Transform Liquid Model vulnerability data to UI format
    return data.map((vuln: any) => ({
      id: vuln.id,
      cve: vuln.cve_id,
      description: vuln.description,
      severity: this.mapSeverity(vuln.severity),
      status: vuln.status,
      affectedAssets: vuln.affected_assets,
      remediation: vuln.remediation_steps
    }))
  }

  private mapNodeType(type: string): 'asset' | 'vulnerability' | 'attack' | 'impact' {
    const typeMap: { [key: string]: 'asset' | 'vulnerability' | 'attack' | 'impact' } = {
      'ASSET': 'asset',
      'VULNERABILITY': 'vulnerability',
      'ATTACK_STEP': 'attack',
      'IMPACT': 'impact'
    }
    return typeMap[type] || 'attack'
  }

  private mapEdgeType(type: string): 'exploit' | 'lateral_movement' | 'privilege_escalation' {
    const typeMap: { [key: string]: 'exploit' | 'lateral_movement' | 'privilege_escalation' } = {
      'EXPLOITS': 'exploit',
      'LATERAL_MOVEMENT': 'lateral_movement',
      'PRIVILEGE_ESCALATION': 'privilege_escalation'
    }
    return typeMap[type] || 'exploit'
  }

  private mapSeverity(severity: number): 'low' | 'medium' | 'high' | 'critical' {
    if (severity >= 9) return 'critical'
    if (severity >= 7) return 'high'
    if (severity >= 4) return 'medium'
    return 'low'
  }
}
