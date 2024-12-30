import { BaseService } from './base.service'

export interface AttackPath {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: number
  impact: number
  steps: AttackStep[]
  mitigations: Mitigation[]
  lastUpdated: string
}

export interface AttackStep {
  id: string
  description: string
  technique: string
  status: 'possible' | 'detected' | 'blocked'
  timestamp: string
}

export interface Mitigation {
  id: string
  description: string
  effectiveness: number
  implementationStatus: 'planned' | 'in_progress' | 'implemented'
  cost: 'low' | 'medium' | 'high'
}

export class AttackPathService extends BaseService {
  async getAttackPaths() {
    try {
      const data = await this.liquidModel.getAttackPaths()
      return this.transformAttackPaths(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAttackPathDetails(id: string) {
    try {
      const data = await this.liquidModel.getAttackPathDetails(id)
      return this.transformAttackPathDetails(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async simulateAttackPath(id: string) {
    try {
      const data = await this.liquidModel.simulateAttackPath(id)
      return this.transformSimulationResults(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async getMitigations(attackPathId: string) {
    try {
      const data = await this.liquidModel.getAttackPathMitigations(attackPathId)
      return this.transformMitigations(data)
    } catch (error) {
      this.handleError(error)
    }
  }

  private transformAttackPaths(data: any): AttackPath[] {
    return data.map((path: any) => ({
      id: path.id,
      name: path.name,
      description: path.description,
      severity: path.severity.toLowerCase(),
      probability: path.probability,
      impact: path.impact_score,
      steps: this.transformSteps(path.steps),
      mitigations: this.transformMitigations(path.mitigations),
      lastUpdated: path.last_updated
    }))
  }

  private transformSteps(steps: any[]): AttackStep[] {
    return steps.map(step => ({
      id: step.id,
      description: step.description,
      technique: step.attack_technique,
      status: step.status.toLowerCase(),
      timestamp: step.timestamp
    }))
  }

  private transformMitigations(mitigations: any[]): Mitigation[] {
    return mitigations.map(mitigation => ({
      id: mitigation.id,
      description: mitigation.description,
      effectiveness: mitigation.effectiveness_score,
      implementationStatus: mitigation.status.toLowerCase(),
      cost: mitigation.cost_level.toLowerCase()
    }))
  }

  private transformSimulationResults(data: any) {
    return {
      success: data.simulation_success,
      pathsExplored: data.paths_explored,
      vulnerabilitiesFound: data.vulnerabilities_found,
      timeToCompromise: data.time_to_compromise,
      recommendations: data.recommendations
    }
  }
}
