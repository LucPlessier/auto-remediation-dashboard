export class LiquidModel {
  async getRiskOverview() {
    return {
      overall_score: 65,
      metrics: [
        { category: 'Vulnerability', score: 72, trend: 'DOWN', previous_score: 78 },
        { category: 'Threat', score: 58, trend: 'UP', previous_score: 52 },
        { category: 'Asset', score: 85, trend: 'STABLE', previous_score: 85 },
        { category: 'User', score: 45, trend: 'DOWN', previous_score: 55 }
      ],
      last_updated: new Date().toISOString()
    }
  }

  async getAssetDiscovery() {
    return {
      total_assets: 1250,
      new_assets_count: 15,
      scan_progress: 78,
      asset_categories: [
        { name: 'Servers', count: 450, severity: 'HIGH' },
        { name: 'Workstations', count: 580, severity: 'MEDIUM' },
        { name: 'Network Devices', count: 120, severity: 'LOW' },
        { name: 'IoT Devices', count: 100, severity: 'HIGH' }
      ],
      last_scan_time: new Date(Date.now() - 3600000).toISOString(),
      next_scan_time: new Date(Date.now() + 3600000).toISOString()
    }
  }

  async getThreatIntelligence() {
    return {
      new_threats_count: 18,
      total_threats: 156,
      overall_severity: 'MEDIUM',
      severity_score: 65,
      threat_categories: [
        { name: 'Malware', count: 45, severity: 'HIGH' },
        { name: 'Phishing', count: 32, severity: 'MEDIUM' },
        { name: 'Zero-Day', count: 12, severity: 'CRITICAL' },
        { name: 'DDoS', count: 67, severity: 'LOW' }
      ],
      recent_activity: [
        {
          type: 'Detection',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          description: 'New ransomware variant detected',
          severity: 'HIGH'
        }
      ]
    }
  }

  async getExposureData() {
    return {
      total_exposures: 156,
      critical_exposures: 12,
      exposure_score: 68,
      exposure_categories: [
        { name: 'Open Ports', count: 45, severity: 'HIGH' },
        { name: 'Misconfigurations', count: 32, severity: 'MEDIUM' },
        { name: 'Outdated Software', count: 58, severity: 'HIGH' },
        { name: 'Weak Credentials', count: 21, severity: 'CRITICAL' }
      ],
      trends: [
        { time_period: '24h', percentage_change: -5 },
        { time_period: '7d', percentage_change: -15 },
        { time_period: '30d', percentage_change: -25 }
      ],
      last_updated: new Date().toISOString()
    }
  }

  async getVulnerabilityForecast() {
    return [
      { month: 'Jan', predicted_count: 45, confidence_score: 0.85, risk_level: 'MEDIUM', contributing_factors: [
        { name: 'Historical Trends', impact_weight: 0.4 },
        { name: 'Seasonal Patterns', impact_weight: 0.3 },
        { name: 'Industry Events', impact_weight: 0.3 }
      ]},
      { month: 'Feb', predicted_count: 52, confidence_score: 0.82, risk_level: 'HIGH', contributing_factors: [
        { name: 'Historical Trends', impact_weight: 0.35 },
        { name: 'Seasonal Patterns', impact_weight: 0.35 },
        { name: 'Industry Events', impact_weight: 0.3 }
      ]},
      { month: 'Mar', predicted_count: 38, confidence_score: 0.88, risk_level: 'LOW', contributing_factors: [
        { name: 'Historical Trends', impact_weight: 0.45 },
        { name: 'Seasonal Patterns', impact_weight: 0.25 },
        { name: 'Industry Events', impact_weight: 0.3 }
      ]},
      { month: 'Apr', predicted_count: 63, confidence_score: 0.79, risk_level: 'HIGH', contributing_factors: [
        { name: 'Historical Trends', impact_weight: 0.3 },
        { name: 'Seasonal Patterns', impact_weight: 0.4 },
        { name: 'Industry Events', impact_weight: 0.3 }
      ]},
      { month: 'May', predicted_count: 55, confidence_score: 0.84, risk_level: 'MEDIUM', contributing_factors: [
        { name: 'Historical Trends', impact_weight: 0.4 },
        { name: 'Seasonal Patterns', impact_weight: 0.3 },
        { name: 'Industry Events', impact_weight: 0.3 }
      ]},
      { month: 'Jun', predicted_count: 48, confidence_score: 0.86, risk_level: 'MEDIUM', contributing_factors: [
        { name: 'Historical Trends', impact_weight: 0.35 },
        { name: 'Seasonal Patterns', impact_weight: 0.35 },
        { name: 'Industry Events', impact_weight: 0.3 }
      ]}
    ]
  }

  async getDetailedVulnerabilityForecast(month: string) {
    const forecast = (await this.getVulnerabilityForecast()).find(f => f.month === month)
    if (!forecast) return null

    return {
      ...forecast,
      prediction_methodology: 'Machine Learning with Historical Analysis',
      historical_data: [
        { month: 'Previous 3', count: 42 },
        { month: 'Previous 2', count: 48 },
        { month: 'Previous 1', count: 44 }
      ],
      confidence_factors: {
        data_quality: 0.9,
        model_accuracy: 0.85,
        prediction_stability: 0.88
      }
    }
  }

  async getAlerts() {
    return {
      alerts: [
        {
          id: '1',
          title: 'Critical Vulnerability Detected',
          message: 'A critical vulnerability was detected in the production server.',
          type: 'error',
          severity: 'critical',
          source: 'Vulnerability Scanner',
          timestamp: new Date().toISOString(),
          acknowledged: false,
          relatedEntities: [
            {
              type: 'server',
              id: 'srv-001',
              name: 'Production Web Server'
            }
          ]
        },
        {
          id: '2',
          title: 'Suspicious Login Activity',
          message: 'Multiple failed login attempts detected from unusual IP.',
          type: 'warning',
          severity: 'high',
          source: 'Security Gateway',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          acknowledged: true,
          relatedEntities: [
            {
              type: 'user',
              id: 'usr-123',
              name: 'admin'
            }
          ]
        }
      ]
    }
  }

  async acknowledgeAlert(alertId: string) {
    // Mock implementation
    return true
  }

  async dismissAlert(alertId: string) {
    // Mock implementation
    return true
  }

  async getAlertDetails(alertId: string) {
    // Mock implementation
    return {
      id: alertId,
      title: 'Critical Vulnerability Detected',
      message: 'A critical vulnerability was detected in the production server.',
      type: 'error',
      severity: 'critical',
      source: 'Vulnerability Scanner',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      relatedEntities: [
        {
          type: 'server',
          id: 'srv-001',
          name: 'Production Web Server'
        }
      ],
      details: {
        cve: 'CVE-2023-1234',
        description: 'Remote code execution vulnerability in web server software',
        remediation: 'Update web server to latest version',
        affectedSystems: ['srv-001', 'srv-002'],
        timeline: [
          {
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            event: 'Vulnerability detected'
          },
          {
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            event: 'Alert created'
          }
        ]
      }
    }
  }

  async getUserActivities(timeRange: string = '24h') {
    return [
      {
        id: 'activity-1',
        user_id: 'user-123',
        username: 'john.doe',
        action: 'FILE_ACCESS',
        resource: '/sensitive/data.txt',
        timestamp: new Date().toISOString(),
        risk_score: 75,
        anomaly_score: 0.85,
        location: {
          ip: '192.168.1.100',
          country: 'United States',
          city: 'San Francisco'
        },
        device: {
          type: 'DESKTOP',
          os: 'Windows 10',
          browser: 'Chrome'
        }
      }
    ]
  }

  async getAnomalyDetection() {
    return {
      anomalies: [
        {
          id: 'anomaly-1',
          type: 'LOGIN_PATTERN',
          description: 'Unusual login time detected',
          severity: 'MEDIUM',
          confidence: 0.85,
          affected_user: 'john.doe',
          timestamp: new Date().toISOString()
        }
      ],
      stats: {
        total_events: 1500,
        anomaly_rate: 0.02,
        false_positive_rate: 0.001
      }
    }
  }

  async getThreatIntel() {
    return {
      new_threats_count: 12,
      severity_level: 'MEDIUM',
      severity_score: 65,
      last_updated: new Date().toISOString(),
      trends: {
        daily: [/* ... */],
        weekly: [/* ... */]
      },
      recommendations: [
        'Update firewall rules',
        'Patch vulnerable systems'
      ]
    }
  }

  async getAttackPaths() {
    return [
      {
        id: 'path-1',
        name: 'Web Server Compromise',
        description: 'Potential path through exposed web server',
        severity: 'HIGH',
        probability: 0.75,
        impact_score: 85,
        steps: [
          {
            id: 'step-1',
            name: 'Initial Access',
            description: 'Exploit vulnerable web application',
            status: 'POSSIBLE',
            requirements: ['CVE-2023-1234']
          }
        ],
        mitigations: [
          {
            id: 'mit-1',
            name: 'Web Application Firewall',
            effectiveness: 'HIGH',
            implementation_status: 'PLANNED'
          }
        ],
        last_updated: new Date().toISOString()
      }
    ]
  }

  async getUserRiskProfiles() {
    return [
      {
        user_id: 'user-123',
        username: 'john.doe',
        risk_level: 'MEDIUM',
        risk_factors: [
          {
            name: 'Access Pattern',
            score: 65,
            description: 'Unusual access times detected'
          }
        ],
        recommendations: [
          'Enable 2FA',
          'Review access permissions'
        ],
        last_updated: new Date().toISOString()
      }
    ]
  }

  async search(query: string) {
    // Mock search results
    return {
      items: [
        {
          type: 'vulnerability',
          title: 'Critical SQL Injection',
          description: 'SQL Injection vulnerability found in login form',
          severity: 'high',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'asset',
          title: 'Web Server',
          description: 'Production web server with critical vulnerabilities',
          severity: 'medium',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'threat',
          title: 'Suspicious Login Activity',
          description: 'Multiple failed login attempts detected',
          severity: 'low',
          timestamp: new Date().toISOString(),
        }
      ],
      total: 3,
      query
    }
  }
}
