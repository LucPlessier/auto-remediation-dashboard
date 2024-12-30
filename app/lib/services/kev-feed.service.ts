import { BaseService } from './base.service'

// CISA KEV API endpoint
const KEV_API_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'

export interface KevVulnerability {
  cveID: string
  vendorProject: string
  product: string
  vulnerabilityName: string
  dateAdded: string
  shortDescription: string
  requiredAction: string
  dueDate: string
  knownRansomwareCampaignUse: boolean
  notes: string
}

export interface KevCatalog {
  title: string
  catalogVersion: string
  dateReleased: string
  count: number
  vulnerabilities: KevVulnerability[]
}

export class KevFeedService extends BaseService {
  private kevCache: {
    data: KevCatalog | null;
    lastFetched: Date | null;
  } = {
    data: null,
    lastFetched: null,
  }

  private readonly CACHE_DURATION = 1000 * 60 * 60 * 6 // 6 hours

  async getKevData(): Promise<KevCatalog | null> {
    try {
      // Check if we have valid cached data
      if (
        this.kevCache.data &&
        this.kevCache.lastFetched &&
        Date.now() - this.kevCache.lastFetched.getTime() < this.CACHE_DURATION
      ) {
        return this.kevCache.data
      }

      const response = await fetch(KEV_API_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch KEV data: ${response.statusText}`)
      }

      const data = await response.json()
      this.kevCache = {
        data,
        lastFetched: new Date(),
      }

      return data
    } catch (error) {
      console.error('Error fetching KEV data:', error)
      return null
    }
  }

  async isInKev(cveId: string): Promise<boolean> {
    const kevData = await this.getKevData()
    if (!kevData) return false

    return kevData.vulnerabilities.some(vuln => vuln.cveID === cveId)
  }

  async getKevVulnerabilityDetails(cveId: string): Promise<KevVulnerability | null> {
    const kevData = await this.getKevData()
    if (!kevData) return null

    return kevData.vulnerabilities.find(vuln => vuln.cveID === cveId) || null
  }

  calculateKevRiskWeight(vulnerability: KevVulnerability): number {
    let weight = 1.5 // Base weight for KEV vulnerabilities

    // Increase weight for ransomware-associated vulnerabilities
    if (vulnerability.knownRansomwareCampaignUse) {
      weight *= 1.5
    }

    // Add urgency factor based on due date
    const dueDate = new Date(vulnerability.dueDate)
    const now = new Date()
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDue <= 7) {
      weight *= 1.3 // Increase weight for imminent due dates
    } else if (daysUntilDue <= 30) {
      weight *= 1.2 // Slightly increase weight for near-term due dates
    }

    return weight
  }
}
