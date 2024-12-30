import { KevFeedService } from '../services/kev-feed.service'

export class LiquidModel {
  private kevService: KevFeedService

  constructor() {
    this.kevService = new KevFeedService()
  }

  async calculateVulnerabilityRisk(vulnerability: any) {
    let riskScore = this.calculateBaseRiskScore(vulnerability)
    
    // Check if vulnerability is in KEV catalog
    const kevDetails = await this.kevService.getKevVulnerabilityDetails(vulnerability.cveId)
    if (kevDetails) {
      // Apply KEV risk weight
      const kevWeight = this.kevService.calculateKevRiskWeight(kevDetails)
      riskScore *= kevWeight

      // Add KEV-specific factors
      if (kevDetails.knownRansomwareCampaignUse) {
        riskScore *= 1.5 // Significant increase for ransomware association
      }
    }

    return this.normalizeRiskScore(riskScore)
  }

  private calculateBaseRiskScore(vulnerability: any) {
    // Base calculation using CVSS and other factors
    let score = vulnerability.cvssScore || 5.0
    
    // Consider asset criticality
    if (vulnerability.assetCriticality) {
      score *= (vulnerability.assetCriticality / 10)
    }

    // Consider exposure factors
    if (vulnerability.isExposed) {
      score *= 1.3
    }

    return score
  }

  private normalizeRiskScore(score: number): number {
    // Ensure score stays within 0-10 range
    return Math.min(Math.max(score, 0), 10)
  }

  // Vulnerability forecasting with KEV consideration
  async getVulnerabilityForecast() {
    const kevData = await this.kevService.getKevData()
    const baseForecasts = this.generateBaseForecast()

    return baseForecasts.map(forecast => {
      // Adjust forecast based on KEV trends
      if (kevData) {
        const recentKevCount = kevData.vulnerabilities.filter(v => {
          const addedDate = new Date(v.dateAdded)
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return addedDate > monthAgo
        }).length

        // Adjust prediction based on recent KEV activity
        if (recentKevCount > 10) {
          forecast.predicted_count *= 1.2 // Increase prediction if high KEV activity
        }
      }

      return forecast
    })
  }

  private generateBaseForecast() {
    // Generate base forecasts (example implementation)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      predicted_count: Math.floor(Math.random() * 100) + 50,
      confidence_score: Math.random() * 0.3 + 0.7,
    }))
  }

  // Add KEV data to threat intelligence feed
  async getThreatIntelFeed() {
    const kevData = await this.kevService.getKevData()
    const baseThreatFeed = this.getBaseThreatFeed()

    if (kevData) {
      // Add recent KEV entries to threat feed
      const recentKevVulns = kevData.vulnerabilities
        .filter(v => {
          const addedDate = new Date(v.dateAdded)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return addedDate > weekAgo
        })
        .map(v => ({
          type: 'KEV',
          severity: 'critical',
          title: v.vulnerabilityName,
          description: v.shortDescription,
          source: 'CISA KEV Catalog',
          timestamp: v.dateAdded,
          cveId: v.cveID,
          requiredAction: v.requiredAction,
          dueDate: v.dueDate,
        }))

      return [...recentKevVulns, ...baseThreatFeed]
    }

    return baseThreatFeed
  }

  private getBaseThreatFeed() {
    // Example base threat feed implementation
    return [
      {
        type: 'malware',
        severity: 'high',
        title: 'New Ransomware Variant Detected',
        description: 'New ransomware strain targeting healthcare sector',
        source: 'Internal Analysis',
        timestamp: new Date().toISOString(),
      },
      // Add more base threat feed items...
    ]
  }
}
